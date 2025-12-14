import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/LBPoolFactory/BasePoolFactory";
import { LBPool } from "../types/LBPoolFactory/LBPool";
import { LBPParams } from "../types/schema";

function handleLBPoolParams(poolAddress: Address): Bytes {
  let lbp = LBPool.bind(poolAddress);
  let lbpParams = new LBPParams(poolAddress);

  let immutableData = lbp.getLBPoolImmutableData();
  let projectTokenIndex = immutableData.projectTokenIndex.toI32();
  let reserveTokenIndex = immutableData.reserveTokenIndex.toI32();

  lbpParams.owner = lbp.owner();
  lbpParams.projectToken = immutableData.tokens[projectTokenIndex];
  lbpParams.reserveToken = immutableData.tokens[reserveTokenIndex];
  lbpParams.projectTokenStartWeight =
    immutableData.startWeights[projectTokenIndex];
  lbpParams.projectTokenEndWeight = immutableData.endWeights[projectTokenIndex];
  lbpParams.reserveTokenStartWeight =
    immutableData.startWeights[reserveTokenIndex];
  lbpParams.reserveTokenEndWeight = immutableData.endWeights[reserveTokenIndex];
  lbpParams.startTime = immutableData.startTime;
  lbpParams.endTime = immutableData.endTime;
  lbpParams.isProjectTokenSwapInBlocked =
    immutableData.isProjectTokenSwapInBlocked;

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
