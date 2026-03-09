import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/GyroECLPPoolFactory/BasePoolFactory";
import { GyroECLPPool } from "../types/GyroECLPPoolFactory/GyroECLPPool";
import { GyroEParams } from "../types/schema";
import { scaleDown } from "../helpers/math";

function handleGyroEPoolParams(poolAddress: Address): Bytes {
  let gyroEPool = GyroECLPPool.bind(poolAddress);
  let gyroEResult = gyroEPool.try_getGyroECLPPoolImmutableData();
  let gyroEParams = new GyroEParams(poolAddress);
  if (!gyroEResult.reverted) {
    // Base params - 18 decimals
    gyroEParams.alpha = scaleDown(gyroEResult.value.paramsAlpha, 18);
    gyroEParams.beta = scaleDown(gyroEResult.value.paramsBeta, 18);
    gyroEParams.c = scaleDown(gyroEResult.value.paramsC, 18);
    gyroEParams.s = scaleDown(gyroEResult.value.paramsS, 18);
    gyroEParams.lambda = scaleDown(gyroEResult.value.paramsLambda, 18);

    // Derived params - 38 decimals
    gyroEParams.tauAlphaX = scaleDown(gyroEResult.value.tauAlphaX, 38);
    gyroEParams.tauAlphaY = scaleDown(gyroEResult.value.tauAlphaY, 38);
    gyroEParams.tauBetaX = scaleDown(gyroEResult.value.tauBetaX, 38);
    gyroEParams.tauBetaY = scaleDown(gyroEResult.value.tauBetaY, 38);
    gyroEParams.u = scaleDown(gyroEResult.value.u, 38);
    gyroEParams.v = scaleDown(gyroEResult.value.v, 38);
    gyroEParams.w = scaleDown(gyroEResult.value.w, 38);
    gyroEParams.z = scaleDown(gyroEResult.value.z, 38);
    gyroEParams.dSq = scaleDown(gyroEResult.value.dSq, 38);
  }
  gyroEParams.save();
  return gyroEParams.id;
}

export function handleGyroEPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.GyroE,
    1,
    handleGyroEPoolParams,
    "gyroEParams"
  );
}

export function handleGyroEV2PoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.GyroE,
    2,
    handleGyroEPoolParams,
    "gyroEParams"
  );
}
