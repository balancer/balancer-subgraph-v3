import { Address, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/StablePoolFactory/BasePoolFactory";
import { StablePool } from "../types/StablePoolFactory/StablePool";
import { StableParams } from "../types/schema";

function handleStablePoolParams(poolAddress: Address): Bytes {
  let stablePool = StablePool.bind(poolAddress);
  let ampResult = stablePool.try_getAmplificationParameter();
  let stableParams = new StableParams(poolAddress);
  if (!ampResult.reverted) {
    let ampValue = ampResult.value.value0;
    let ampPrecision = ampResult.value.value2;
    stableParams.amp = ampValue.div(ampPrecision);
  }
  stableParams.save();
  return stableParams.id;
}

export function handleNewComposableStablePoolV5(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.Composable,
    5,
    handleStablePoolParams,
    "stableParams"
  );
}

export function handleNewComposableStablePoolV6(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.Composable,
    6,
    handleStablePoolParams,
    "stableParams"
  );
}
