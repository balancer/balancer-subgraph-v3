import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/GyroECLPPoolFactory/BasePoolFactory";
import { GyroECLPPool } from "../types/GyroECLPPoolFactory/GyroECLPPool";
import { GyroEParams } from "../types/schema";
import { scaleDown } from "../helpers/math";

function handleGyroEPoolParams(poolAddress: Address): Bytes {
  let gyroEPool = GyroECLPPool.bind(poolAddress);
  let gyroEParams = new GyroEParams(poolAddress);
  let gyroEResult = gyroEPool.try_getGyroECLPPoolImmutableData();
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
  } else {
    // Fallback for older pool versions (e.g. V2) that expose getECLPParams instead
    let eclpResult = gyroEPool.try_getECLPParams();
    if (!eclpResult.reverted) {
      let params = eclpResult.value.value0;
      let d = eclpResult.value.value1;

      // Base params - 18 decimals
      gyroEParams.alpha = scaleDown(params.alpha, 18);
      gyroEParams.beta = scaleDown(params.beta, 18);
      gyroEParams.c = scaleDown(params.c, 18);
      gyroEParams.s = scaleDown(params.s, 18);
      gyroEParams.lambda = scaleDown(params.lambda, 18);

      // Derived params - 38 decimals
      gyroEParams.tauAlphaX = scaleDown(d.tauAlpha.x, 38);
      gyroEParams.tauAlphaY = scaleDown(d.tauAlpha.y, 38);
      gyroEParams.tauBetaX = scaleDown(d.tauBeta.x, 38);
      gyroEParams.tauBetaY = scaleDown(d.tauBeta.y, 38);
      gyroEParams.u = scaleDown(d.u, 38);
      gyroEParams.v = scaleDown(d.v, 38);
      gyroEParams.w = scaleDown(d.w, 38);
      gyroEParams.z = scaleDown(d.z, 38);
      gyroEParams.dSq = scaleDown(d.dSq, 38);
    }
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
