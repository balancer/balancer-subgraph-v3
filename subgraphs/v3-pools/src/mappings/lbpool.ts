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

export function handleGradualWeightUpdateScheduled(event: GradualWeightUpdateScheduled): void {
  let poolAddress = event.address;
  let lbpParams = LbpParams.load(poolAddress);

  if (lbpParams) {
    lbpParams.startTime = event.params.startTime;
    lbpParams.endTime = event.params.endTime;
    lbpParams.startWeights = event.params.startWeights.map<BigDecimal>((weight) =>
      scaleDown(weight, 18)
    );
    lbpParams.endWeights = event.params.endWeights.map<BigDecimal>((weight) =>
      scaleDown(weight, 18)
    );

    lbpParams.save();
  }
}

export function handleSwapEnabledSet(event: SwapEnabledSet): void {
  let poolAddress = event.address;
  let lbpParams = LbpParams.load(poolAddress);

  if (lbpParams) {
    lbpParams.swapEnabled = event.params.swapEnabled;
    lbpParams.save();
  }
}