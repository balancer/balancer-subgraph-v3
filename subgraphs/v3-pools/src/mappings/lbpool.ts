import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/LBPoolFactory/BasePoolFactory";
import { LBPool } from "../types/LBPoolFactory/LBPool";
import { LbpParams } from "../types/schema";
import { scaleDown } from "../helpers/math";

function handleLBPoolParams(poolAddress: Address): Bytes {
  let lbPool = LBPool.bind(poolAddress);
  let normalizedWeightsResult = lbPool.try_getNormalizedWeights();
  let gradualUpdateParamsResult = lbPool.try_getGradualWeightUpdateParams();
  let swapEnabledResult = lbPool.try_getSwapEnabled();

  let lbpParams = new LbpParams(poolAddress);
  if (!normalizedWeightsResult.reverted) {
    lbpParams.startWeights = normalizedWeightsResult.value.map<BigDecimal>((weight) =>
      scaleDown(weight, 18)
    );
  }
  if (!gradualUpdateParamsResult.reverted) {
    lbpParams.startTime = gradualUpdateParamsResult.startTime;
    lbpParams.endTime = gradualUpdateParamsResult.endTime;
    lbpParams.endWeights = gradualUpdateParamsResult.endWeights.value.map<BigDecimal>((weight) =>
      scaleDown(weight, 18)
    );
  }
  if (!swapEnabledResult.reverted) {
    lbpParams.swapEnabledResult = swapEnabledResult.swapEnabled;
  }

  lbpParams.save();
  return lbpParams.id;
}

export function handleLBPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.LBPool,
    1,
    handleLBPoolParams,
    "lbpParams"
  );
}
