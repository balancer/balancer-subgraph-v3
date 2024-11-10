import { Address, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/GyroEV2PoolFactory/BasePoolFactory";
import { GyroEParams } from "../types/schema";
import { GyroEPool } from "../types/GyroEV2PoolFactory/GyroEPool";
import { scaleDown } from "../helpers/math";

function handleGyroEParams(poolAddress: Address): Bytes {
  let gyroPool = GyroEPool.bind(poolAddress);
  let paramsResult = gyroPool.try_getECLPParams();
  let gyroParams = new GyroEParams(poolAddress);
  if (!paramsResult.reverted) {
    const params = paramsResult.value.value0;
    const derived = paramsResult.value.value1;
    gyroParams.alpha = scaleDown(params.alpha, 18);
    gyroParams.beta = scaleDown(params.beta, 18);
    gyroParams.lambda = scaleDown(params.lambda, 18);
    gyroParams.c = scaleDown(params.c, 18);
    gyroParams.s = scaleDown(params.s, 18);
    gyroParams.tauAlphaX = scaleDown(derived.tauAlpha.x, 38);
    gyroParams.tauAlphaY = scaleDown(derived.tauAlpha.y, 38);
    gyroParams.tauBetaX = scaleDown(derived.tauBeta.x, 38);
    gyroParams.tauBetaY = scaleDown(derived.tauBeta.y, 38);
    gyroParams.u = scaleDown(derived.u, 38);
    gyroParams.v = scaleDown(derived.v, 38);
    gyroParams.w = scaleDown(derived.w, 38);
    gyroParams.z = scaleDown(derived.z, 38);
    gyroParams.dSq = scaleDown(derived.dSq, 38);
  }
  gyroParams.save();

  return gyroParams.id;
}

export function handleNewGyroEV2Pool(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.GyroE,
    2,
    handleGyroEParams,
    "gyroEParams"
  );
}
