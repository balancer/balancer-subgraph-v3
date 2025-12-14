import { Address, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/ReClammPoolV2Factory/BasePoolFactory";
import { ReClammPool } from "../types/ReClammPoolV2Factory/ReClammPool";
import { ReClammParams } from "../types/schema";
import { ReClammPool as ReClammPoolTemplate } from "../types/templates";
import {
  DailyPriceShiftExponentUpdated,
  CenterednessMarginUpdated,
  PriceRatioStateUpdated,
  VirtualBalancesUpdated,
  LastTimestampUpdated,
} from "../types/templates/ReClammPool/ReClammPool";

function handleReClammPoolParams(poolAddress: Address): Bytes {
  let reClamm = ReClammPool.bind(poolAddress);
  let reClammParams = new ReClammParams(poolAddress);

  let reClammData = reClamm.getReClammPoolDynamicData();

  reClammParams.lastTimestamp = reClammData.lastTimestamp;
  reClammParams.lastVirtualBalances = reClammData.lastVirtualBalances;
  reClammParams.centerednessMargin = reClammData.centerednessMargin;
  reClammParams.dailyPriceShiftBase = reClammData.dailyPriceShiftBase;
  reClammParams.currentFourthRootPriceRatio =
    reClammData.currentFourthRootPriceRatio;
  reClammParams.startFourthRootPriceRatio =
    reClammData.startFourthRootPriceRatio;
  reClammParams.endFourthRootPriceRatio = reClammData.endFourthRootPriceRatio;
  reClammParams.priceRatioUpdateStartTime =
    reClammData.priceRatioUpdateStartTime;
  reClammParams.priceRatioUpdateEndTime = reClammData.priceRatioUpdateEndTime;

  let dailyPriceShiftExponent = reClamm.getDailyPriceShiftExponent();
  reClammParams.dailyPriceShiftExponent = dailyPriceShiftExponent;

  reClammParams.save();

  return reClammParams.id;
}

export function handleReClammPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.ReClamm,
    1,
    handleReClammPoolParams,
    "reClammParams"
  );

  ReClammPoolTemplate.create(event.params.pool);
}

export function handleReClammPoolV2Created(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.ReClamm,
    2,
    handleReClammPoolParams,
    "reClammParams"
  );

  ReClammPoolTemplate.create(event.params.pool);
}

export function handleReClammCenterednessMarginUpdated(
  event: CenterednessMarginUpdated
): void {
  let pool = ReClammParams.load(event.address) as ReClammParams;
  pool.centerednessMargin = event.params.centerednessMargin;
  pool.save();
}

export function handleReClammLastTimestampUpdated(
  event: LastTimestampUpdated
): void {
  let pool = ReClammParams.load(event.address) as ReClammParams;
  pool.lastTimestamp = event.params.lastTimestamp;
  pool.save();
}

export function handleReClammVirtualBalancesUpdated(
  event: VirtualBalancesUpdated
): void {
  let pool = ReClammParams.load(event.address) as ReClammParams;
  pool.lastVirtualBalances = [
    event.params.virtualBalanceA,
    event.params.virtualBalanceB,
  ];
  pool.save();
}

export function handleReClammDailyPriceShiftExponentUpdated(
  event: DailyPriceShiftExponentUpdated
): void {
  let pool = ReClammParams.load(event.address) as ReClammParams;
  pool.dailyPriceShiftBase = event.params.dailyPriceShiftBase;
  pool.dailyPriceShiftExponent = event.params.dailyPriceShiftExponent;
  pool.save();
}

export function handleReClammPriceRatioStateUpdated(
  event: PriceRatioStateUpdated
): void {
  let pool = ReClammParams.load(event.address) as ReClammParams;
  pool.priceRatioUpdateStartTime = event.params.priceRatioUpdateStartTime;
  pool.priceRatioUpdateEndTime = event.params.priceRatioUpdateEndTime;
  pool.startFourthRootPriceRatio = event.params.startFourthRootPriceRatio;
  pool.endFourthRootPriceRatio = event.params.endFourthRootPriceRatio;
  pool.save();
}
