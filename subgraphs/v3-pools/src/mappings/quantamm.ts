import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/QuantAMMWeightedPoolFactory/BasePoolFactory";
import { QuantAMMWeightedPool } from "../types/QuantAMMWeightedPoolFactory/QuantAMMWeightedPool";
import { UpdateWeightRunner as RunnerContract } from "../types/QuantAMMWeightedPoolFactory/UpdateWeightRunner";
import { QuantAMMGradientBasedRule as GradientRuleContract } from "../types/QuantAMMWeightedPoolFactory/QuantAMMGradientBasedRule";
import { QuantAMMMathMovingAverage as AveragesRuleContract } from "../types/QuantAMMWeightedPoolFactory/QuantAMMMathMovingAverage";

import {
  QuantAMMWeightedDetail,
  QuantAMMWeightedParams,
} from "../types/schema";

/*
 * We store pool details as a list of lists of strings.
 * The first list is the category of the detail.
 * The second list is the name of the detail.
 *
 * The categories and names are stored in the CATEGORIES and NAMES arrays.
 *
 * For example:
 *  overview:
 *   - adaptabilityScore
 *   - description
 *  ruleDetail:
 *   - updateRuleName
 *
 */
const CATEGORIES = ["overview", "ruleDetail"];
const NAMES = [["adaptabilityScore", "description"], ["updateRuleName"]];

function getNumberOfAssets(pool: QuantAMMWeightedPool): number {
  const info = pool.getTokenInfo(); // (tokens, tokenInfo, balancesRaw, lastBalancesLiveScaled18)
  return info.value0.length;
}

function handleQuantAMMWeightedPoolParams(poolAddress: Address): Bytes {
  const pool = QuantAMMWeightedPool.bind(poolAddress);
  const params = new QuantAMMWeightedParams(poolAddress);

  for (let i = 0; i < CATEGORIES.length; i++) {
    const category = CATEGORIES[i];
    const names = NAMES[i];

    for (let j = 0; j < names.length; j++) {
      const name = names[j];
      const poolDetailResult = pool.try_getPoolDetail(category, name);

      if (poolDetailResult.reverted) continue;
      if (poolDetailResult.value.value0 == "") continue;
      if (poolDetailResult.value.value1 == "") continue;

      const details = new QuantAMMWeightedDetail(
        poolAddress.concatI32(i).concatI32(j)
      );

      details.name = name;
      details.category = category;
      details.type = poolDetailResult.value.value0;
      details.value = poolDetailResult.value.value1;
      details.pool = params.id;
      details.save();
    }
  }
  const immutableData = pool.getQuantAMMWeightedPoolImmutableData();
  params.absoluteWeightGuardRail = immutableData.absoluteWeightGuardRail;
  params.oracleStalenessThreshold = immutableData.oracleStalenessThreshold;
  params.maxTradeSizeRatio = immutableData.maxTradeSizeRatio;
  params.updateInterval = immutableData.updateInterval;
  params.poolRegistry = immutableData.poolRegistry;
  params.epsilonMax = immutableData.epsilonMax;
  params.lambda = immutableData.lambda;

  // Dynamic parameters
  const dynamicData = pool.getQuantAMMWeightedPoolDynamicData();
  params.weightsAtLastUpdateInterval =
    dynamicData.firstFourWeightsAndMultipliers
      .slice(0, 4)
      .concat(dynamicData.secondFourWeightsAndMultipliers.slice(0, 4));
  params.weightBlockMultipliers = dynamicData.firstFourWeightsAndMultipliers
    .slice(4, 8)
    .concat(dynamicData.secondFourWeightsAndMultipliers.slice(4, 8));
  params.lastInterpolationTimePossible = dynamicData.lastInteropTime;
  params.lastUpdateIntervalTime = dynamicData.lastUpdateTime;

  const numberOfAssets = getNumberOfAssets(pool);
  const runnerAddr = pool.updateWeightRunner();

  const runner = RunnerContract.bind(runnerAddr);
  const ruleAddr = runner.getPoolRule(poolAddress);

  const gradientRule = GradientRuleContract.bind(ruleAddr);
  const gradients = gradientRule.try_getIntermediateGradientState(
    poolAddress,
    BigInt.fromI32(numberOfAssets)
  );

  const averagesRule = AveragesRuleContract.bind(ruleAddr);
  const averages = averagesRule.try_getMovingAverages(
    poolAddress,
    BigInt.fromI32(numberOfAssets)
  );

  params.rule = ruleAddr;
  params.runner = runnerAddr;
  if (!gradients.reverted) {
    params.gradientComputationTime = gradients.value;
  }
  if (!averages.reverted) {
    params.movingAverageIntermediates = averages;
  }

  params.save();

  return params.id;
}

export function handleQuantAMMWeightedPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.QuantAMMWeighted,
    1,
    handleQuantAMMWeightedPoolParams,
    "quantAMMWeightedParams"
  );
}
