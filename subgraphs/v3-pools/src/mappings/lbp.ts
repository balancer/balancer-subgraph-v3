import { Address, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/LBPoolV2Factory/BasePoolFactory";
import { LBPool } from "../types/LBPoolV2Factory/LBPool";
import { LBPoolV3 } from "../types/LBPoolV3Factory/LBPoolV3";
import { LBPParams, FixedLBPParams } from "../types/schema";
import { FixedPriceLBPool } from "../types/FixedPriceLBPoolFactory/FixedPriceLBPool";

function handleLBPoolParams(poolAddress: Address): Bytes {
  let lbp = LBPool.bind(poolAddress);
  let lbpParams = new LBPParams(poolAddress);

  let immutableData = lbp.try_getLBPoolImmutableData();
  if (!immutableData.reverted) {
    let projectTokenIndex = immutableData.value.projectTokenIndex.toI32();
    let reserveTokenIndex = immutableData.value.reserveTokenIndex.toI32();

    lbpParams.owner = lbp.owner();
    lbpParams.projectToken = immutableData.value.tokens[projectTokenIndex];
    lbpParams.reserveToken = immutableData.value.tokens[reserveTokenIndex];
    lbpParams.startTime = immutableData.value.startTime;
    lbpParams.endTime = immutableData.value.endTime;
    lbpParams.projectTokenStartWeight =
      immutableData.value.startWeights[projectTokenIndex];
    lbpParams.projectTokenEndWeight =
      immutableData.value.endWeights[projectTokenIndex];
    lbpParams.reserveTokenStartWeight =
      immutableData.value.startWeights[reserveTokenIndex];
    lbpParams.reserveTokenEndWeight =
      immutableData.value.endWeights[reserveTokenIndex];
    lbpParams.isProjectTokenSwapInBlocked =
      immutableData.value.isProjectTokenSwapInBlocked;
  }

  lbpParams.save();

  return lbpParams.id;
}

function handleLBPoolV3Params(poolAddress: Address): Bytes {
  let lbpV3 = LBPoolV3.bind(poolAddress);
  let lbpParams = new LBPParams(poolAddress);

  let immutableData = lbpV3.try_getLBPoolImmutableData();
  if (!immutableData.reverted) {
    let projectTokenIndex = immutableData.value.projectTokenIndex.toI32();
    let reserveTokenIndex = immutableData.value.reserveTokenIndex.toI32();

    lbpParams.owner = lbpV3.owner();
    lbpParams.projectToken = immutableData.value.tokens[projectTokenIndex];
    lbpParams.reserveToken = immutableData.value.tokens[reserveTokenIndex];
    lbpParams.startTime = immutableData.value.startTime;
    lbpParams.endTime = immutableData.value.endTime;
    lbpParams.projectTokenStartWeight =
      immutableData.value.startWeights[projectTokenIndex];
    lbpParams.projectTokenEndWeight =
      immutableData.value.endWeights[projectTokenIndex];
    lbpParams.reserveTokenStartWeight =
      immutableData.value.startWeights[reserveTokenIndex];
    lbpParams.reserveTokenEndWeight =
      immutableData.value.endWeights[reserveTokenIndex];
    lbpParams.isProjectTokenSwapInBlocked =
      immutableData.value.isProjectTokenSwapInBlocked;
  }

  lbpParams.save();

  return lbpParams.id;
}

export function handleLBPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.LBP,
    1,
    handleLBPoolParams,
    "lbpParams"
  );
}

export function handleLBPoolV2Created(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.LBP,
    2,
    handleLBPoolParams,
    "lbpParams"
  );
}

export function handleLBPoolV3Created(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.LBP,
    3,
    handleLBPoolV3Params,
    "lbpParams"
  );
}

function handleFixedPriceLBPoolParams(poolAddress: Address): Bytes {
  let fixedPriceLBP = FixedPriceLBPool.bind(poolAddress);
  let fixedLBPParams = new FixedLBPParams(poolAddress);

  let immutableData = fixedPriceLBP.getFixedPriceLBPoolImmutableData();
  let projectTokenIndex = immutableData.projectTokenIndex.toI32();
  let reserveTokenIndex = immutableData.reserveTokenIndex.toI32();

  fixedLBPParams.owner = fixedPriceLBP.owner();
  fixedLBPParams.projectToken = immutableData.tokens[projectTokenIndex];
  fixedLBPParams.reserveToken = immutableData.tokens[reserveTokenIndex];
  fixedLBPParams.startTime = immutableData.startTime;
  fixedLBPParams.endTime = immutableData.endTime;
  fixedLBPParams.projectTokenRate = immutableData.projectTokenRate;
  fixedLBPParams.isProjectTokenSwapInBlocked =
    fixedPriceLBP.isProjectTokenSwapInBlocked();

  fixedLBPParams.save();

  return fixedLBPParams.id;
}

export function handleFixedPriceLBPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.FixedLBP,
    1,
    handleFixedPriceLBPoolParams,
    "fixedLBPParams"
  );
}
