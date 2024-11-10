import { BigInt } from "@graphprotocol/graph-ts";
import { SwapFeePercentageChanged } from "../types/templates/WeightedPool/WeightedPool";
import { Pool } from "../types/schema";

import { tokenToDecimal, scaleDown } from "../helpers/misc";
import { VAULT_ADDRESS, ZERO_ADDRESS, ZERO_BD } from "../helpers/constants";
import { Transfer } from "../types/Vault/ERC20";
import {
  createPoolSnapshot,
  getPool,
  getPoolShare,
  getVault,
  loadPoolToken,
} from "../helpers/entities";

/************************************
 *********** SWAP FEES ************
 ************************************/

export function handleSwapFeePercentageChange(
  event: SwapFeePercentageChanged
): void {
  let pool = getPool(event.address);
  const newSwapFee = scaleDown(event.params.swapFeePercentage, 18);
  pool.swapFee = newSwapFee;
  pool.save();
}

/************************************
 *********** POOL SHARES ************
 ************************************/

export function handleTransfer(event: Transfer): void {
  let poolAddress = event.address;

  let isMint = event.params.from == ZERO_ADDRESS;
  let isBurn = event.params.to == ZERO_ADDRESS;

  // skip pre-minted BPTs to the Vault
  if (
    (isMint && event.params.to == poolAddress) ||
    (event.params.from == poolAddress && event.params.to == VAULT_ADDRESS)
  )
    return;

  let poolShareFrom = getPoolShare(poolAddress, event.params.from);
  let poolShareFromBalance =
    poolShareFrom == null ? ZERO_BD : poolShareFrom.balance;

  let poolShareTo = getPoolShare(poolAddress, event.params.to);
  let poolShareToBalance = poolShareTo == null ? ZERO_BD : poolShareTo.balance;

  let pool = getPool(poolAddress);
  let poolId = pool.id;

  let BPT_DECIMALS = 18;

  if (isMint) {
    poolShareTo.balance = poolShareTo.balance.plus(
      tokenToDecimal(event.params.value, BPT_DECIMALS)
    );
    poolShareTo.save();
    pool.totalShares = pool.totalShares.plus(
      tokenToDecimal(event.params.value, BPT_DECIMALS)
    );

    // Mint of BPTs to ProtocolFeeController means protocol fee collection
    let vault = getVault(VAULT_ADDRESS);

    if (poolShareTo.user == vault.protocolFeesCollector) {
      let protocolFee = tokenToDecimal(event.params.value, BPT_DECIMALS);
      pool.totalProtocolFeePaidInBPT =
        pool.totalProtocolFeePaidInBPT.plus(protocolFee);

      createPoolSnapshot(pool, event.block.timestamp.toI32());
    }
  } else if (isBurn) {
    poolShareFrom.balance = poolShareFrom.balance.minus(
      tokenToDecimal(event.params.value, BPT_DECIMALS)
    );
    poolShareFrom.save();
    pool.totalShares = pool.totalShares.minus(
      tokenToDecimal(event.params.value, BPT_DECIMALS)
    );
  } else {
    poolShareTo.balance = poolShareTo.balance.plus(
      tokenToDecimal(event.params.value, BPT_DECIMALS)
    );
    poolShareTo.save();

    poolShareFrom.balance = poolShareFrom.balance.minus(
      tokenToDecimal(event.params.value, BPT_DECIMALS)
    );
    poolShareFrom.save();
  }

  if (
    poolShareTo !== null &&
    poolShareTo.balance.notEqual(ZERO_BD) &&
    poolShareToBalance.equals(ZERO_BD) &&
    poolShareTo.user != VAULT_ADDRESS
  ) {
    pool.holdersCount = pool.holdersCount.plus(BigInt.fromI32(1));
  }

  if (
    poolShareFrom !== null &&
    poolShareFrom.balance.equals(ZERO_BD) &&
    poolShareFromBalance.notEqual(ZERO_BD) &&
    poolShareFrom.user != VAULT_ADDRESS
  ) {
    pool.holdersCount = pool.holdersCount.minus(BigInt.fromI32(1));
  }

  pool.save();
}
