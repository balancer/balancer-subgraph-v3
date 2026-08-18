import { Address, Bytes, log } from "@graphprotocol/graph-ts";

import { createBasePool, PoolType } from "./common";
import { PoolCreated } from "../types/GyroECLPPoolFactory/BasePoolFactory";
import { GyroECLPPool } from "../types/GyroECLPPoolFactory/GyroECLPPool";
import { GyroEParams } from "../types/schema";
import {
  EclpRawParams,
  derivedParamsAreConsistent,
  tauMatchesBounds,
  tauVectorsAreNormalized,
} from "../helpers/gyroECLP";
import { scaleDown } from "../helpers/math";

/**
 * Reads the raw ECLP parameters, or null if the pool exposes neither reader. Newer pools expose the flat
 * getGyroECLPPoolImmutableData(); older versions only expose getECLPParams().
 */
function readEclpParams(poolAddress: Address): EclpRawParams | null {
  let gyroEPool = GyroECLPPool.bind(poolAddress);

  let immutableResult = gyroEPool.try_getGyroECLPPoolImmutableData();
  if (!immutableResult.reverted) {
    let d = immutableResult.value;
    return new EclpRawParams(
      d.paramsAlpha,
      d.paramsBeta,
      d.paramsC,
      d.paramsS,
      d.paramsLambda,
      d.tauAlphaX,
      d.tauAlphaY,
      d.tauBetaX,
      d.tauBetaY,
      d.u,
      d.v,
      d.w,
      d.z,
      d.dSq
    );
  }

  // Fallback for older pool versions (e.g. V2) that expose getECLPParams instead
  let eclpResult = gyroEPool.try_getECLPParams();
  if (!eclpResult.reverted) {
    let params = eclpResult.value.value0;
    let d = eclpResult.value.value1;
    return new EclpRawParams(
      params.alpha,
      params.beta,
      params.c,
      params.s,
      params.lambda,
      d.tauAlpha.x,
      d.tauAlpha.y,
      d.tauBeta.x,
      d.tauBeta.y,
      d.u,
      d.v,
      d.w,
      d.z,
      d.dSq
    );
  }

  return null;
}

function saveGyroEParams(
  poolAddress: Address,
  raw: EclpRawParams | null
): Bytes {
  let gyroEParams = new GyroEParams(poolAddress);
  if (raw) {
    // Base params - 18 decimals
    gyroEParams.alpha = scaleDown(raw.alpha, 18);
    gyroEParams.beta = scaleDown(raw.beta, 18);
    gyroEParams.c = scaleDown(raw.c, 18);
    gyroEParams.s = scaleDown(raw.s, 18);
    gyroEParams.lambda = scaleDown(raw.lambda, 18);

    // Derived params - 38 decimals
    gyroEParams.tauAlphaX = scaleDown(raw.tauAlphaX, 38);
    gyroEParams.tauAlphaY = scaleDown(raw.tauAlphaY, 38);
    gyroEParams.tauBetaX = scaleDown(raw.tauBetaX, 38);
    gyroEParams.tauBetaY = scaleDown(raw.tauBetaY, 38);
    gyroEParams.u = scaleDown(raw.u, 38);
    gyroEParams.v = scaleDown(raw.v, 38);
    gyroEParams.w = scaleDown(raw.w, 38);
    gyroEParams.z = scaleDown(raw.z, 38);
    gyroEParams.dSq = scaleDown(raw.dSq, 38);
  }
  gyroEParams.save();
  return gyroEParams.id;
}

function createGyroEPool(
  poolAddress: Address,
  factoryAddress: Address,
  version: i32
): void {
  let raw = readEclpParams(poolAddress);

  // The pool constructor checks only bounds on the derived params, never that they belong to the primary
  // params. A pool that fails either half of that missing check misprices against what it advertises, so
  // it is not indexed at all: no Pool, no GyroEParams, and no Factory either, since getFactory only runs
  // once the checks have passed.
  if (raw) {
    let reason = "";
    if (!derivedParamsAreConsistent(raw)) {
      reason = "u, v, w, z and dSq are inconsistent with c, s, tauAlpha and tauBeta";
    } else if (!tauVectorsAreNormalized(raw)) {
      reason = "tauAlpha or tauBeta is not a unit vector";
    } else if (!tauMatchesBounds(raw)) {
      reason = "tauAlpha or tauBeta does not correspond to the pool's alpha and beta";
    }
    if (reason != "") {
      log.warning("GyroECLP pool {} not indexed: {}", [
        poolAddress.toHexString(),
        reason,
      ]);
      return;
    }
  }

  let pool = createBasePool(poolAddress, factoryAddress, PoolType.GyroE, version);
  pool.gyroEParams = saveGyroEParams(poolAddress, raw);
  pool.save();
}

export function handleGyroEPoolCreated(event: PoolCreated): void {
  createGyroEPool(
    event.params.pool,
    event.address, // Factory
    1
  );
}

export function handleGyroEV2PoolCreated(event: PoolCreated): void {
  createGyroEPool(
    event.params.pool,
    event.address, // Factory
    2
  );
}
