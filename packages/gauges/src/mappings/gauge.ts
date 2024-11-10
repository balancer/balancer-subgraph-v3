import { ZERO_ADDRESS } from "../helpers/constants";
import { getGaugeShare, getRewardToken, setRewardData } from "../helpers/gauge";
import { scaleDown, scaleDownBPT } from "../helpers/maths";
import {
  Gauge,
  LiquidityGauge,
  Pool,
  RootGauge,
  SingleRecipientGauge,
} from "../types/schema";

import {
  Transfer,
  // eslint-disable-next-line camelcase
  Deposit_reward_tokenCall,
} from "../types/templates/LiquidityGauge/LiquidityGauge";
import {
  KillGaugeCall,
  UnkillGaugeCall,
} from "../types/templates/RootGauge/ArbitrumRootGauge";
import { RelativeWeightCapChanged } from "../types/GaugeV2Factory/LiquidityGauge";
import {
  ChildChainStreamer,
  RewardDurationUpdated,
} from "../types/templates/ChildChainStreamer/ChildChainStreamer";
import { bytesToAddress } from "../helpers/misc";

/**
 * On mainnet we can detect when a reward token is deposited into a gauge by listening for the Deposit_reward_tokenCall
 * When a reward token is deposited in the gauge, we set its reward data, creating the reward token entity in the process if it doesn't exist
 */
// eslint-disable-next-line camelcase
export function handleDepositRewardToken(call: Deposit_reward_tokenCall): void {
  /* eslint-disable no-underscore-dangle */
  const gaugeAddress = call.to;
  const tokenAddress = call.inputs._reward_token;
  const amount = call.inputs._amount;
  /* eslint-enable no-underscore-dangle */

  let gauge = LiquidityGauge.load(gaugeAddress.toHexString());
  if (!gauge) return;
  setRewardData(gaugeAddress, tokenAddress);

  const rewardToken = getRewardToken(tokenAddress, gaugeAddress);
  const amountScaled = scaleDown(amount, rewardToken.decimals);
  rewardToken.totalDeposited = rewardToken.totalDeposited.plus(amountScaled);
  rewardToken.save();
}

export function handleTransfer(event: Transfer): void {
  let gaugeAddress = event.address;

  let gauge = LiquidityGauge.load(gaugeAddress.toHexString()) as LiquidityGauge;

  /* eslint-disable no-underscore-dangle */
  let fromAddress = event.params._from;
  let toAddress = event.params._to;
  let value = event.params._value;
  /* eslint-enable no-underscore-dangle */

  let isMint = fromAddress.toHexString() == ZERO_ADDRESS;
  let isBurn = toAddress.toHexString() == ZERO_ADDRESS;

  if (isMint) {
    let userShareTo = getGaugeShare(toAddress, gaugeAddress);
    userShareTo.balance = userShareTo.balance.plus(scaleDownBPT(value));
    userShareTo.save();
    gauge.totalSupply = gauge.totalSupply.plus(scaleDownBPT(value));
  } else if (isBurn) {
    let userShareFrom = getGaugeShare(fromAddress, gaugeAddress);
    userShareFrom.balance = userShareFrom.balance.minus(scaleDownBPT(value));
    userShareFrom.save();
    gauge.totalSupply = gauge.totalSupply.minus(scaleDownBPT(value));
  } else {
    let userShareTo = getGaugeShare(toAddress, gaugeAddress);
    userShareTo.balance = userShareTo.balance.plus(scaleDownBPT(value));
    userShareTo.save();

    let userShareFrom = getGaugeShare(fromAddress, gaugeAddress);
    userShareFrom.balance = userShareFrom.balance.minus(scaleDownBPT(value));
    userShareFrom.save();
  }

  gauge.save();

  const rewardTokens = gauge.rewardTokensList;
  if (!rewardTokens) return;

  for (let i: i32 = 0; i < rewardTokens.length; i++) {
    setRewardData(gaugeAddress, bytesToAddress(rewardTokens[i]));
  }
}

export function handleRootKillGauge(call: KillGaugeCall): void {
  // eslint-disable-next-line no-underscore-dangle
  let gauge = RootGauge.load(call.to.toHexString()) as RootGauge;
  gauge.isKilled = true;
  gauge.save();
}

export function handleRootUnkillGauge(call: UnkillGaugeCall): void {
  // eslint-disable-next-line no-underscore-dangle
  let gauge = RootGauge.load(call.to.toHexString()) as RootGauge;
  gauge.isKilled = false;
  gauge.save();
}

export function handleSingleRecipientKillGauge(call: KillGaugeCall): void {
  // eslint-disable-next-line no-underscore-dangle
  let gauge = SingleRecipientGauge.load(
    call.to.toHexString()
  ) as SingleRecipientGauge;
  gauge.isKilled = true;
  gauge.save();
}

export function handleSingleRecipientUnkillGauge(call: UnkillGaugeCall): void {
  // eslint-disable-next-line no-underscore-dangle
  let gauge = SingleRecipientGauge.load(
    call.to.toHexString()
  ) as SingleRecipientGauge;
  gauge.isKilled = false;
  gauge.save();
}

export function handleKillGauge(call: KillGaugeCall): void {
  // eslint-disable-next-line no-underscore-dangle
  let killedGaugeId = call.to.toHexString();
  let killedGauge = LiquidityGauge.load(killedGaugeId);
  if (killedGauge == null) return;
  killedGauge.isKilled = true;
  killedGauge.isPreferentialGauge = false;
  killedGauge.save();

  // Update Pool's preferentialGauge

  let poolId = killedGauge.pool;
  if (poolId === null) return;

  let pool = Pool.load(poolId);
  if (pool == null) return;

  let currentPreferentialGaugeId = pool.preferentialGauge;

  if (
    currentPreferentialGaugeId &&
    currentPreferentialGaugeId == killedGaugeId
  ) {
    pool.preferentialGauge = "";

    let preferencialGaugeTimestamp = 0;
    for (let i: i32 = 0; i < pool.gaugesList.length; i++) {
      if (currentPreferentialGaugeId == pool.gaugesList[i].toHex()) continue;

      let liquidityGauge = LiquidityGauge.load(
        pool.gaugesList[i].toHex()
      ) as LiquidityGauge;

      let gaugeId = liquidityGauge.gauge;
      if (gaugeId === null) continue; // Gauge not added to GaugeController

      let gauge = Gauge.load(gaugeId) as Gauge;

      if (
        !liquidityGauge.isKilled &&
        gauge.addedTimestamp > preferencialGaugeTimestamp
      ) {
        pool.preferentialGauge = liquidityGauge.id;
        preferencialGaugeTimestamp = gauge.addedTimestamp;
      }
    }
  }

  pool.save();

  let poolPreferentialGauge = pool.preferentialGauge;
  if (poolPreferentialGauge === null) return;

  let preferentialGauge = LiquidityGauge.load(poolPreferentialGauge);
  if (preferentialGauge == null) return;

  preferentialGauge.isPreferentialGauge = true;
  preferentialGauge.save();
}

export function handleUnkillGauge(call: UnkillGaugeCall): void {
  // eslint-disable-next-line no-underscore-dangle
  let unkilledLiquidityGaugeId = call.to.toHexString();
  let unkilledLiquidityGauge = LiquidityGauge.load(unkilledLiquidityGaugeId);
  if (unkilledLiquidityGauge == null) return;
  unkilledLiquidityGauge.isKilled = false;
  unkilledLiquidityGauge.save();

  let unkilledGaugeId = unkilledLiquidityGauge.gauge;
  if (unkilledGaugeId === null) return; // Gauge not added to GaugeController

  // Update Pool's preferentialGauge

  let poolId = unkilledLiquidityGauge.pool;
  if (poolId === null) return;
  let pool = Pool.load(poolId);
  if (pool == null) return;

  let preferentialGaugeId = pool.preferentialGauge;
  if (preferentialGaugeId === null) {
    pool.preferentialGauge = unkilledLiquidityGaugeId;
    pool.save();

    unkilledLiquidityGauge.isPreferentialGauge = true;
    unkilledLiquidityGauge.save();

    return;
  }

  let preferentialGauge = LiquidityGauge.load(
    preferentialGaugeId
  ) as LiquidityGauge;

  let currentPreferentialGaugeId = preferentialGauge.gauge;
  if (currentPreferentialGaugeId === null) {
    pool.preferentialGauge = unkilledLiquidityGaugeId;
    pool.save();

    unkilledLiquidityGauge.isPreferentialGauge = true;
    unkilledLiquidityGauge.save();

    return;
  }

  let unkilledGauge = Gauge.load(unkilledGaugeId) as Gauge;
  let currentPreferentialGauge = Gauge.load(
    currentPreferentialGaugeId
  ) as Gauge;

  if (unkilledGauge.addedTimestamp > currentPreferentialGauge.addedTimestamp) {
    pool.preferentialGauge = unkilledLiquidityGaugeId;
    pool.save();

    unkilledLiquidityGauge.isPreferentialGauge = true;
    unkilledLiquidityGauge.save();

    let currentPreferentialLiquidityGaugeId =
      currentPreferentialGauge.liquidityGauge;
    if (currentPreferentialLiquidityGaugeId) {
      let currentPreferentialLiquidityGauge = LiquidityGauge.load(
        currentPreferentialLiquidityGaugeId
      ) as LiquidityGauge;
      currentPreferentialLiquidityGauge.isPreferentialGauge = false;
      currentPreferentialLiquidityGauge.save();
    }
  }
}

export function handleRelativeWeightCapChanged(
  event: RelativeWeightCapChanged
): void {
  let gauge = LiquidityGauge.load(
    event.address.toHexString()
  ) as LiquidityGauge;
  gauge.relativeWeightCap = scaleDownBPT(event.params.new_relative_weight_cap);
  gauge.save();
}

export function handleRootGaugeRelativeWeightCapChanged(
  event: RelativeWeightCapChanged
): void {
  let gauge = RootGauge.load(event.address.toHexString()) as RootGauge;
  gauge.relativeWeightCap = scaleDownBPT(event.params.new_relative_weight_cap);
  gauge.save();
}

export function handleSingleRecipientGaugeRelativeWeightCapChanged(
  event: RelativeWeightCapChanged
): void {
  let gauge = SingleRecipientGauge.load(
    event.address.toHexString()
  ) as SingleRecipientGauge;
  gauge.relativeWeightCap = scaleDownBPT(event.params.new_relative_weight_cap);
  gauge.save();
}

/**
 * RewardDurationUpdated is an event emitted by the ChildChainStreamer contract
 * It is emitted when a token if added to the ChildChainStreamer contract, so
 * we use it as a trigger to update the reward data of the respecitve token
 * on the gauge asssociated with the ChildChainStreamer contract in question.
 * If the token does not exist on the gauge, we create it.
 */
export function handleRewardDurationUpdated(
  event: RewardDurationUpdated
): void {
  // find the gauge associated with the ChildChainStreamer contract
  let streamer = ChildChainStreamer.bind(event.address);
  let gaugeCall = streamer.try_reward_receiver();
  if (gaugeCall.reverted) return;

  const gaugeAddress = gaugeCall.value;
  let gauge = LiquidityGauge.load(gaugeAddress.toHexString());
  if (!gauge) return;

  const rewardToken = event.params.reward_token;
  setRewardData(gaugeAddress, rewardToken);
}
