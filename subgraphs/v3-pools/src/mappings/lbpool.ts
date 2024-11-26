import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/LBPoolFactory/BasePoolFactory";
import { LBPool } from "../types/LBPoolFactory/LBPool";
import { LBParams } from "../types/schema";
import { scaleDown } from "../helpers/math";

function handleLBPoolParams(poolAddress: Address): Bytes {
  let lbPool = LBPool.bind(poolAddress);
  let weightsResult = lbPool.try_getNormalizedWeights();
  let lbParams = new lbParams(poolAddress);
  if (lbResult.reverted) {
    lbParams.weights = weightsResult.value.map<BigDecimal>((weight) =>
      scaleDown(weight, 18)
    );
  }
  lbParams.save();
  return lbParams.id;
}

export function handleLBPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.LBPool,
    1,
    handleLBPoolParams,
    "lbParams"
  );
}
