import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/WeightedPoolFactory/BasePoolFactory";
import { WeightedPool } from "../types/WeightedPoolFactory/WeightedPool";
import { WeightedParams } from "../types/schema";
import { scaleDown } from "../helpers/math";

function handleWeightedPoolParams(poolAddress: Address): Bytes {
  let weightedPool = WeightedPool.bind(poolAddress);
  let weightsResult = weightedPool.try_getNormalizedWeights();
  let weightedParams = new WeightedParams(poolAddress);
  if (!weightsResult.reverted) {
    weightedParams.weights = weightsResult.value.map<BigDecimal>((weight) =>
      scaleDown(weight, 18)
    );
  }
  weightedParams.save();
  return weightedParams.id;
}

export function handleNewWeightedPoolV4(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.Weighted,
    4,
    handleWeightedPoolParams,
    "weightedParams"
  );
}
