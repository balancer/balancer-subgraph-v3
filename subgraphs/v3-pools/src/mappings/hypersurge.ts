/* src/mappings/hypersurge.ts */

import {
  Address,
  BigDecimal,
  BigInt,
  log,
} from "@graphprotocol/graph-ts";

import {
  HyperSurgeParams,
  HyperSurgeTokenPriceConfig,
} from "../../generated/schema";

import {
  HyperSurgeHook,
  PoolRegistered,
  TokenPriceConfiguredIndex,
  MaxSurgeFeePercentageChanged,
  ThresholdPercentageChanged,
  CapDeviationPercentageChanged,
} from "../../generated/HyperSurgeHook/HyperSurgeHook";

/** -----------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------- */

const DECIMALS_18 = 18 as i32;
const TRADE_TYPE_ARBITRAGE = 0;
const TRADE_TYPE_NOISE = 1;

/** Convert a 1e18-scaled uint256 percentage to BigDecimal (e.g., 0.01e18 -> 0.01) */
function pctToBd(value: BigInt): BigDecimal {
  const scale = BigInt.fromI32(10).pow(DECIMALS_18 as u8);
  return value.toBigDecimal().div(scale.toBigDecimal());
}

/** Fetch or init the per-pool entity */
function loadParams(pool: Address): HyperSurgeParams {
  const id = pool.toHexString();
  let p = HyperSurgeParams.load(id);
  if (p == null) {
    p = new HyperSurgeParams(id);
    // initialize with zeros to avoid nulls
    p.numTokens = 0;
    p.arbMaxSurgeFeePercentage = BigDecimal.zero();
    p.arbSurgeThresholdPercentage = BigDecimal.zero();
    p.arbCapDeviationPercentage = BigDecimal.zero();
    p.noiseMaxSurgeFeePercentage = BigDecimal.zero();
    p.noiseSurgeThresholdPercentage = BigDecimal.zero();
    p.noiseCapDeviationPercentage = BigDecimal.zero();
  }
  return p as HyperSurgeParams;
}

function refreshParamsFromChain(contract: HyperSurgeHook, pool: Address): void {
  let p = loadParams(pool);

  const tryNum = contract.try_getNumTokens(pool);
  if (!tryNum.reverted) {
    p.numTokens = tryNum.value;
  }

  const tryArbMax = contract.try_getMaxSurgeFeePercentage(pool, BigInt.fromI32(TRADE_TYPE_ARBITRAGE));
  if (!tryArbMax.reverted) {
    p.arbMaxSurgeFeePercentage = pctToBd(tryArbMax.value);
  }

  const tryArbThr = contract.try_getSurgeThresholdPercentage(pool, BigInt.fromI32(TRADE_TYPE_ARBITRAGE));
  if (!tryArbThr.reverted) {
    p.arbSurgeThresholdPercentage = pctToBd(tryArbThr.value);
  }

  const tryArbCap = contract.try_getCapDeviationPercentage(pool, BigInt.fromI32(TRADE_TYPE_ARBITRAGE));
  if (!tryArbCap.reverted) {
    p.arbCapDeviationPercentage = pctToBd(tryArbCap.value);
  }

  const tryNoiseMax = contract.try_getMaxSurgeFeePercentage(pool, BigInt.fromI32(TRADE_TYPE_NOISE));
  if (!tryNoiseMax.reverted) {
    p.noiseMaxSurgeFeePercentage = pctToBd(tryNoiseMax.value);
  }

  const tryNoiseThr = contract.try_getSurgeThresholdPercentage(pool, BigInt.fromI32(TRADE_TYPE_NOISE));
  if (!tryNoiseThr.reverted) {
    p.noiseSurgeThresholdPercentage = pctToBd(tryNoiseThr.value);
  }

  const tryNoiseCap = contract.try_getCapDeviationPercentage(pool, BigInt.fromI32(TRADE_TYPE_NOISE));
  if (!tryNoiseCap.reverted) {
    p.noiseCapDeviationPercentage = pctToBd(tryNoiseCap.value);
  }

  p.save();
}

/** Refresh all per-token price configs for a pool */
function refreshAllTokenPriceConfigs(contract: HyperSurgeHook, pool: Address, numTokens: i32): void {
  // Bulk fetch (getTokenPriceConfigs returns arrays)
  const tryCfg = contract.try_getTokenPriceConfigs(pool);
  if (tryCfg.reverted) {
    // Fallback: query individually below
    for (let i = 0; i < numTokens; i++) {
      refreshOneTokenPriceConfig(contract, pool, i as i32);
    }
    return;
  }

  const pairIdxArr = tryCfg.value.value0;       // uint32[] (as BigInt[])
  const priceDivArr = tryCfg.value.value1;      // uint32[] (as BigInt[])
  const n = pairIdxArr.length;

  for (let i = 0; i < numTokens && i < n; i++) {
    const idx = i as i32;
    const entityId = pool.toHexString() + "/" + idx.toString();
    let c = HyperSurgeTokenPriceConfig.load(entityId);
    if (c == null) {
      c = new HyperSurgeTokenPriceConfig(entityId);
      c.params = pool.toHexString();
      c.tokenIndex = idx;
    }
    c.pairIndex = pairIdxArr[i].toI32();
    c.priceDivisor = priceDivArr[i].toI32();
    c.save();
  }
}

/** Refresh a single token’s price config (used on TokenPriceConfiguredIndex) */
function refreshOneTokenPriceConfig(contract: HyperSurgeHook, pool: Address, tokenIndex: i32): void {
  const tryOne = contract.try_getTokenPriceConfigIndex(pool, tokenIndex as i32);
  if (tryOne.reverted) {
    log.warning("getTokenPriceConfigIndex reverted for pool {} token {}", [
      pool.toHexString(),
      tokenIndex.toString(),
    ]);
    return;
  }
  const pairIndex = tryOne.value.value0.toI32();
  const priceDiv = tryOne.value.value1.toI32();

  const entityId = pool.toHexString() + "/" + tokenIndex.toString();
  let c = HyperSurgeTokenPriceConfig.load(entityId);
  if (c == null) {
    c = new HyperSurgeTokenPriceConfig(entityId);
    c.params = pool.toHexString();
    c.tokenIndex = tokenIndex;
  }
  c.pairIndex = pairIndex;
  c.priceDivisor = priceDiv;
  c.save();
}

/** -----------------------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------------------- */

/** Emitted when a pool registers with the hook (pool, numTokens). */
export function handlePoolRegistered(event: PoolRegistered): void {
  const pool = event.params.pool;
  const contract = HyperSurgeHook.bind(event.address);

  // Create/update params entity and set numTokens right away
  let p = loadParams(pool);
  p.numTokens = event.params.numTokens; // uint8 -> i32 automatic
  p.save();

  // Refresh on-chain params and all token configs
  refreshParamsFromChain(contract, pool);
  refreshAllTokenPriceConfigs(contract, pool, p.numTokens);
}

/** Emitted when a token’s oracle mapping or divisor changes. */
export function handleTokenPriceConfiguredIndex(event: TokenPriceConfiguredIndex): void {
  const pool = event.params.pool;
  const tokenIdx = event.params.tokenIndex; // uint8 -> i32
  const contract = HyperSurgeHook.bind(event.address);

  // Ensure parent exists
  loadParams(pool).save();

  // Update only this token’s config (uses getTokenPriceConfigIndex for canonical values)
  refreshOneTokenPriceConfig(contract, pool, tokenIdx);
}

/** Any of these param-change events may alter the fee schedule for ARB/NOISE. Refresh both sides. */
export function handleMaxSurgeFeePercentageChanged(event: MaxSurgeFeePercentageChanged): void {
  const contract = HyperSurgeHook.bind(event.address);
  const pool = event.params.pool;
  loadParams(pool).save();
  refreshParamsFromChain(contract, pool);
}

export function handleThresholdPercentageChanged(event: ThresholdPercentageChanged): void {
  const contract = HyperSurgeHook.bind(event.address);
  const pool = event.params.pool;
  loadParams(pool).save();
  refreshParamsFromChain(contract, pool);
}

export function handleCapDeviationPercentageChanged(event: CapDeviationPercentageChanged): void {
  const contract = HyperSurgeHook.bind(event.address);
  const pool = event.params.pool;
  loadParams(pool).save();
  refreshParamsFromChain(contract, pool);
}
