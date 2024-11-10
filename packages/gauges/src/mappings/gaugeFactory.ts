import { Address, log } from "@graphprotocol/graph-ts";

import { GaugeFactory, RootGauge, SingleRecipientGauge } from "../types/schema";
import { getLiquidityGauge } from "../helpers/gauge";

import {
  RootGauge as RootGaugeTemplate,
  LiquidityGauge as LiquidityGaugeTemplate,
  RewardsOnlyGauge as RewardsOnlyGaugeTemplate,
  ChildChainStreamer as ChildChainStreamerTemplate,
  SingleRecipientGauge as SingleRecipientGaugeTemplate,
} from "../types/templates";
import { getPoolEntity, getPoolId, isPoolRegistered } from "../helpers/misc";
import { RewardsOnlyGaugeCreated } from "../types/ChildChainLiquidityGaugeFactory/ChildChainLiquidityGaugeFactory";
import {
  isArbitrumFactory,
  isAvalancheFactory,
  isBaseFactory,
  isFraxtalFactory,
  isGnosisFactory,
  isOptimismFactory,
  isPolygonFactory,
  isPolygonZkEVMFactory,
} from "../helpers/constants";
import { GaugeCreated as LiquidityGaugeCreated } from "../types/GaugeV2Factory/GaugeV2Factory";
import { GaugeCreated as RootGaugeCreated } from "../types/ArbitrumRootGaugeV2Factory/ArbitrumRootGaugeV2Factory";
import { LiquidityGauge as LiquidityGaugeV2 } from "../types/GaugeV2Factory/LiquidityGauge";
import { ArbitrumRootGauge as RootGaugeContract } from "../types/templates/RootGauge/ArbitrumRootGauge";

function getGaugeFactory(address: Address): GaugeFactory {
  let factory = GaugeFactory.load(address.toHexString());

  if (factory == null) {
    factory = new GaugeFactory(address.toHexString());
    factory.numGauges = 0;
    factory.save();
  }

  return factory;
}

export function handleMainnetLiquidityGaugeCreated(
  event: LiquidityGaugeCreated
): void {
  handleLiquidityGaugeCreated(event, false);
}

export function handleChildChainV2LiquidityGaugeCreated(
  event: LiquidityGaugeCreated
): void {
  handleLiquidityGaugeCreated(event, true);
}

function handleLiquidityGaugeCreated(
  event: LiquidityGaugeCreated,
  childChainGauge: boolean
): void {
  const gaugeAddress = event.params.gauge;
  const factoryAddress = event.address;
  let factory = getGaugeFactory(factoryAddress);
  factory.numGauges += 1;
  factory.save();

  const gaugeContract = LiquidityGaugeV2.bind(gaugeAddress);
  const lpTokenCall = gaugeContract.try_lp_token();
  if (lpTokenCall.reverted) {
    log.warning("Call to lp_token() failed: {} {}", [
      gaugeAddress.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  const poolAddress = lpTokenCall.value;
  const poolRegistered = isPoolRegistered(poolAddress);

  let gauge = getLiquidityGauge(gaugeAddress, poolAddress);

  if (poolRegistered) {
    const pool = getPoolEntity(lpTokenCall.value, gaugeAddress);
    // If we're on a child chain and the pool doesn't have a preferential gauge yet
    if (childChainGauge && pool.preferentialGauge === null) {
      pool.preferentialGauge = gauge.id;
      gauge.isPreferentialGauge = true;
    }
    pool.save();
  }

  gauge.pool = poolRegistered ? poolAddress.toHexString() : null;
  gauge.poolId = poolRegistered ? getPoolId(poolAddress) : null;
  gauge.factory = factory.id;
  gauge.save();

  // Gauge's relativeWeightCap is set on event RelativeWeightCapChanged

  LiquidityGaugeTemplate.create(gaugeAddress);
}

export function handleRewardsOnlyGaugeCreated(
  event: RewardsOnlyGaugeCreated
): void {
  let factory = getGaugeFactory(event.address);
  factory.numGauges += 1;
  factory.save();

  let poolAddress = event.params.pool;
  const poolRegistered = isPoolRegistered(poolAddress);

  let gauge = getLiquidityGauge(event.params.gauge, poolAddress);
  gauge.streamer = event.params.streamer;
  gauge.pool = poolRegistered ? poolAddress.toHexString() : null;
  gauge.poolId = poolRegistered ? getPoolId(poolAddress) : null;
  gauge.factory = factory.id;

  if (poolRegistered) {
    let pool = getPoolEntity(poolAddress, event.params.gauge);
    pool.address = poolAddress;
    pool.poolId = getPoolId(poolAddress);
    pool.preferentialGauge = gauge.id;
    gauge.isPreferentialGauge = true;
    pool.save();
  }

  gauge.save();

  RewardsOnlyGaugeTemplate.create(event.params.gauge);
  ChildChainStreamerTemplate.create(event.params.streamer);
}

export function handleSingleRecipientGaugeCreated(
  event: LiquidityGaugeCreated
): void {
  const gaugeAddress = event.params.gauge;
  const factoryAddress = event.address;
  let factory = getGaugeFactory(factoryAddress);
  factory.numGauges += 1;
  factory.save();

  const rootGaugeContract = RootGaugeContract.bind(gaugeAddress);
  const recipientCall = rootGaugeContract.try_getRecipient();
  if (recipientCall.reverted) {
    log.warning("Call to getRecipient() failed: {} {}", [
      gaugeAddress.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  let gauge = new SingleRecipientGauge(gaugeAddress.toHexString());
  gauge.recipient = recipientCall.value;
  gauge.isKilled = false;
  gauge.factory = factoryAddress.toHexString();

  gauge.save();

  // Gauge's relativeWeightCap is set on event RelativeWeightCapChanged

  SingleRecipientGaugeTemplate.create(gaugeAddress);
}

export function handleRootGaugeCreated(event: RootGaugeCreated): void {
  const gaugeAddress = event.params.gauge;
  const factoryAddress = event.address;
  let factory = getGaugeFactory(factoryAddress);
  factory.numGauges += 1;
  factory.save();

  const rootGaugeContract = RootGaugeContract.bind(gaugeAddress);
  const recipientCall = rootGaugeContract.try_getRecipient();
  if (recipientCall.reverted) {
    log.warning("Call to getRecipient() failed: {} {}", [
      gaugeAddress.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  let gauge = new RootGauge(gaugeAddress.toHexString());
  gauge.recipient = recipientCall.value;
  gauge.isKilled = false;
  gauge.factory = factoryAddress.toHexString();

  if (isArbitrumFactory(factoryAddress)) {
    gauge.chain = "Arbitrum";
  } else if (isOptimismFactory(factoryAddress)) {
    gauge.chain = "Optimism";
  } else if (isPolygonFactory(factoryAddress)) {
    gauge.chain = "Polygon";
  } else if (isGnosisFactory(factoryAddress)) {
    gauge.chain = "Gnosis";
  } else if (isAvalancheFactory(factoryAddress)) {
    gauge.chain = "Avalanche";
  } else if (isPolygonZkEVMFactory(factoryAddress)) {
    gauge.chain = "PolygonZkEvm";
  } else if (isBaseFactory(factoryAddress)) {
    gauge.chain = "Base";
  } else if (isFraxtalFactory(factoryAddress)) {
    gauge.chain = "Fraxtal";
  }

  gauge.save();

  // Gauge's relativeWeightCap is set on event RelativeWeightCapChanged

  RootGaugeTemplate.create(gaugeAddress);
}
