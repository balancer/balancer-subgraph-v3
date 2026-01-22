import { Address, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolHookCreated, PoolType } from "./common";
import { StablePool } from "../types/StablePoolV2Factory/StablePool";
import { StableSurgeParams } from "../types/schema";
import {
  StableSurgeHook,
  StableSurgeHookRegistered,
} from "../types/StableSurgeHookV2/StableSurgeHook";
import { scaleDown } from "../helpers/math";

function handleStableSurgeParams(
  poolAddress: Address,
  hookAddress: Address
): Bytes {
  let stablePool = StablePool.bind(poolAddress);
  let surgeParams = new StableSurgeParams(poolAddress);

  let ampResult = stablePool.try_getAmplificationParameter();
  if (!ampResult.reverted) {
    let ampValue = ampResult.value.value0;
    let ampPrecision = ampResult.value.value2;
    surgeParams.amp = ampValue.div(ampPrecision);
  }

  let stableSurge = StableSurgeHook.bind(hookAddress);

  let maxSurgeFee = stableSurge.try_getMaxSurgeFeePercentage(poolAddress);
  if (!maxSurgeFee.reverted) {
    surgeParams.maxSurgeFeePercentage = scaleDown(maxSurgeFee.value, 18);
  }

  let surgeThreshold = stableSurge.try_getSurgeThresholdPercentage(poolAddress);
  if (!surgeThreshold.reverted) {
    surgeParams.surgeThresholdPercentage = scaleDown(surgeThreshold.value, 18);
  }

  surgeParams.save();

  return surgeParams.id;
}

export function handleStableSurgeHookRegistered(
  event: StableSurgeHookRegistered
): void {
  handlePoolHookCreated(
    event.params.pool,
    event.params.factory, // Factory
    event.address, // Hook
    PoolType.StableSurge,
    1,
    handleStableSurgeParams,
    "stableSurgeParams"
  );
}

export function handleStableSurgeHookV2Registered(
  event: StableSurgeHookRegistered
): void {
  handlePoolHookCreated(
    event.params.pool,
    event.params.factory, // Factory
    event.address, // Hook
    PoolType.StableSurge,
    2,
    handleStableSurgeParams,
    "stableSurgeParams"
  );
}

export function handleStableSurgeHookV3Registered(
  event: StableSurgeHookRegistered
): void {
  handlePoolHookCreated(
    event.params.pool,
    event.params.factory, // Factory
    event.address, // Hook
    PoolType.StableSurge,
    3,
    handleStableSurgeParams,
    "stableSurgeParams"
  );
}
