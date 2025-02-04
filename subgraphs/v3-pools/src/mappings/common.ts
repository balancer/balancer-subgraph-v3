import { Address, Bytes, Value } from "@graphprotocol/graph-ts";

import { getFactory } from "../helpers/entities";
import { Pool } from "../types/schema";

export namespace PoolType {
  export const Weighted = "Weighted";
  export const Stable = "Stable";
  export const QuantAMMWeighted = "QuantAMMWeighted";
  export const Gyro2 = "Gyro2";
  export const GyroE = "GyroE";
}

export function createBasePool(
  poolAddress: Address,
  factoryAddress: Address,
  poolType: string,
  version: i32
): Pool {
  let pool = new Pool(poolAddress);
  pool.address = poolAddress;
  let factory = getFactory(factoryAddress, poolType, version);
  pool.factory = factory.id;
  return pool;
}

export function handlePoolCreated(
  poolAddress: Address,
  factoryAddress: Address,
  poolType: string,
  version: i32,
  paramHandler: (address: Address) => Bytes,
  paramField: string
): void {
  let pool = createBasePool(poolAddress, factoryAddress, poolType, version);
  let params = paramHandler(poolAddress);
  pool.set(paramField, Value.fromBytes(params));
  pool.save();
}
