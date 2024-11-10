import { Address } from "@graphprotocol/graph-ts";

import { getVault } from "../helpers/entities";
import { Pool } from "../types/schema";
import { scaleDown } from "../helpers/misc";
import {
  GlobalProtocolSwapFeePercentageChanged,
  GlobalProtocolYieldFeePercentageChanged,
  PoolCreatorSwapFeePercentageChanged,
  PoolCreatorYieldFeePercentageChanged,
  ProtocolSwapFeePercentageChanged,
  ProtocolYieldFeePercentageChanged,
} from "../types/ProtocolFeeController/ProtocolFeeController";

const VAULT_ADDRESS = Address.fromString(
  "0x68aD967ae8393B722EC69dB1018Ec28AF9A34493"
);

export function handleGlobalProtocolSwapFeePercentageChanged(
  event: GlobalProtocolSwapFeePercentageChanged
): void {
  let vault = getVault(VAULT_ADDRESS);
  vault.protocolSwapFee = scaleDown(event.params.swapFeePercentage, 18);
  vault.save();
}

export function handleGlobalProtocolYieldFeePercentageChanged(
  event: GlobalProtocolYieldFeePercentageChanged
): void {
  let vault = getVault(VAULT_ADDRESS);
  vault.protocolYieldFee = scaleDown(event.params.yieldFeePercentage, 18);
  vault.save();
}

export function handlePoolCreatorSwapFeePercentageChanged(
  event: PoolCreatorSwapFeePercentageChanged
): void {
  let pool = Pool.load(event.params.pool) as Pool;
  pool.poolCreatorSwapFee = scaleDown(
    event.params.poolCreatorSwapFeePercentage,
    18
  );
  pool.save();
}

export function handlePoolCreatorYieldFeePercentageChanged(
  event: PoolCreatorYieldFeePercentageChanged
): void {
  let pool = Pool.load(event.params.pool) as Pool;
  pool.poolCreatorYieldFee = scaleDown(
    event.params.poolCreatorYieldFeePercentage,
    18
  );
  pool.save();
}

export function handleProtocolSwapFeePercentageChanged(
  event: ProtocolSwapFeePercentageChanged
): void {
  let pool = Pool.load(event.params.pool) as Pool;
  pool.protocolSwapFee = scaleDown(event.params.swapFeePercentage, 18);
  pool.save();
}

export function handleProtocolYieldFeePercentageChanged(
  event: ProtocolYieldFeePercentageChanged
): void {
  let pool = Pool.load(event.params.pool) as Pool;
  pool.protocolYieldFee = scaleDown(event.params.yieldFeePercentage, 18);
  pool.save();
}
