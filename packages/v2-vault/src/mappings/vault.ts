import { BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";
import {
  Swap as SwapEvent,
  PoolBalanceChanged,
  TokensRegistered,
} from "../types/Vault/Vault";
import { Pool, Swap, AddRemove } from "../types/schema";
import { getPoolAddress, scaleDown } from "../helpers/misc";
import { VAULT_ADDRESS, ZERO_ADDRESS, ZERO_BD } from "../helpers/constants";
import { ERC20 } from "../types/Vault/ERC20";
import {
  createPoolSnapshot,
  createPoolToken,
  createRateProvider,
  createUser,
  getPoolShare,
  getToken,
  getVault,
  loadPoolToken,
} from "../helpers/entities";
import { ZERO_BI } from "../helpers/constants";
import { BasePool } from "../types/templates";
import {
  FlashLoanFeePercentageChanged,
  SwapFeePercentageChanged,
} from "../types/ProtocolFeeCollector/ProtocolFeeCollector";
import { PreMintedBPT } from "../types/Vault/PreMintedBPT";
import { RateProviders } from "../types/Vault/RateProviders";

/************************************
 ******* POOLS REGISTRATIONS ********
 ************************************/

export function handleTokensRegistered(event: TokensRegistered): void {
  let vault = getVault(event.address);

  let poolId = event.params.poolId;
  let poolAddress = getPoolAddress(poolId);

  let pool = new Pool(poolId);
  pool.vault = vault.id;
  pool.address = poolAddress;
  pool.factory = ZERO_ADDRESS; // TODO: isPoolFromFactory or remove it
  pool.pauseWindowEndTime = ZERO_BI; // TODO: remove or hardcode 1y?
  pool.pauseManager = ZERO_ADDRESS; // TODO: should be the owner
  pool.totalShares = ZERO_BD;
  pool.isInitialized = false;
  pool.swapsCount = ZERO_BI;
  pool.holdersCount = ZERO_BI;
  pool.totalProtocolFeePaidInBPT = ZERO_BD;

  let poolContract = ERC20.bind(poolAddress);
  let symbolCall = poolContract.try_symbol();
  let nameCall = poolContract.try_name();

  pool.name = nameCall.reverted ? "" : nameCall.value;
  pool.symbol = symbolCall.reverted ? "" : symbolCall.value;
  pool.swapFee = ZERO_BD; // TODO: check if event updates this value

  pool.blockNumber = event.block.number;
  pool.blockTimestamp = event.block.timestamp;
  pool.transactionHash = event.transaction.hash;

  let rateProviderContract = RateProviders.bind(poolAddress);
  let rateProviders = rateProviderContract.try_getRateProviders();
  let hasRateProviders = !rateProviders.reverted;

  for (let i: i32 = 0; i < event.params.tokens.length; i++) {
    let tokenAddress = event.params.tokens[i];
    createPoolToken(poolId, tokenAddress, false, i);
    if (!hasRateProviders) continue;
    createRateProvider(poolId, tokenAddress, rateProviders.value[i]);
  }

  pool.save();

  createPoolSnapshot(pool, event.block.timestamp.toI32());

  BasePool.create(poolAddress);
}

/************************************
 ****** DEPOSITS & WITHDRAWALS ******
 ************************************/

export function handlePoolBalanceChanged(event: PoolBalanceChanged): void {
  let amounts: BigInt[] = event.params.deltas;

  if (amounts.length === 0) {
    return;
  }

  createUser(event.params.liquidityProvider);

  let total: BigInt = amounts.reduce<BigInt>(
    (sum, amount) => sum.plus(amount),
    ZERO_BI
  );
  if (total.gt(ZERO_BI)) {
    handlePoolJoined(event);
  } else {
    handlePoolExited(event);
  }
}

function handlePoolJoined(event: PoolBalanceChanged): void {
  let poolId = event.params.poolId;
  let poolAddress = getPoolAddress(poolId);
  let amounts: BigInt[] = event.params.deltas;

  let transactionHash = event.transaction.hash;
  let logIndex = event.logIndex;

  let pool = Pool.load(poolId);
  if (pool == null) {
    log.warning("Pool not found in handlePoolJoined: {} {}", [
      poolAddress.toHex(),
      transactionHash.toHex(),
    ]);
    return;
  }

  let poolTokens = pool.tokens.load();

  if (pool.isInitialized == false) {
    let hasPreMintedBPT = false;
    for (let i = 0; i < poolTokens.length; i++) {
      if (poolTokens[i].address == poolAddress) {
        hasPreMintedBPT = true;
        break;
      }
    }
    if (hasPreMintedBPT) {
      let preMintedBPT = PreMintedBPT.bind(poolAddress);
      let totalSupplyCall = preMintedBPT.try_getActualSupply();
      pool.totalShares = totalSupplyCall.reverted
        ? ZERO_BD
        : scaleDown(totalSupplyCall.value, 18);
    }
    pool.isInitialized = true;
  }

  pool.save();

  let joinId = transactionHash.concatI32(logIndex.toI32());
  let join = new AddRemove(joinId);

  let joinAmounts = new Array<BigDecimal>(amounts.length);

  for (let i: i32 = 0; i < poolTokens.length; i++) {
    let poolToken = poolTokens[i];
    let joinAmount = scaleDown(event.params.deltas[i], poolToken.decimals);
    joinAmounts[i] = joinAmount;
    poolToken.balance = poolToken.balance.plus(joinAmount);
    let protocolFee = scaleDown(
      event.params.protocolFeeAmounts[i],
      poolToken.decimals
    );
    poolToken.totalProtocolFee = poolToken.totalProtocolFee.plus(protocolFee);
    poolToken.save();
  }

  join.type = "Add";
  join.sender = event.params.liquidityProvider;
  join.amounts = joinAmounts;
  join.pool = poolAddress;
  join.user = event.params.liquidityProvider;
  join.logIndex = logIndex;
  join.blockNumber = event.block.number;
  join.blockTimestamp = event.block.timestamp;
  join.transactionHash = transactionHash;
  join.save();

  createPoolSnapshot(pool, event.block.timestamp.toI32());
}

function handlePoolExited(event: PoolBalanceChanged): void {
  let poolId = event.params.poolId;
  let poolAddress = getPoolAddress(poolId);
  let amounts: BigInt[] = event.params.deltas;

  let transactionHash = event.transaction.hash;
  let logIndex = event.logIndex;

  let pool = Pool.load(poolId);
  if (pool == null) {
    log.warning("Pool not found in handlePoolJoined: {} {}", [
      poolAddress.toHex(),
      transactionHash.toHex(),
    ]);
    return;
  }

  let exitId = transactionHash.concatI32(logIndex.toI32());
  let exit = new AddRemove(exitId);

  let poolTokens = pool.tokens.load();
  let exitAmounts = new Array<BigDecimal>(amounts.length);

  for (let i: i32 = 0; i < poolTokens.length; i++) {
    let poolToken = poolTokens[i];
    let exitAmount = scaleDown(
      event.params.deltas[i].neg(),
      poolToken.decimals
    );
    exitAmounts[i] = exitAmount;
    poolToken.balance = poolToken.balance.minus(exitAmount);
    let protocolFee = scaleDown(
      event.params.protocolFeeAmounts[i],
      poolToken.decimals
    );
    poolToken.totalProtocolFee = poolToken.totalProtocolFee.plus(protocolFee);
    poolToken.save();
  }

  exit.type = "Remove";
  exit.sender = event.params.liquidityProvider;
  exit.amounts = exitAmounts;
  exit.pool = poolAddress;
  exit.user = event.params.liquidityProvider;
  exit.logIndex = logIndex;
  exit.blockNumber = event.block.number;
  exit.blockTimestamp = event.block.timestamp;
  exit.transactionHash = transactionHash;
  exit.save();

  createPoolSnapshot(pool, event.block.timestamp.toI32());
}

/************************************
 ************** SWAPS ***************
 ************************************/

export function handleSwap(event: SwapEvent): void {
  let poolId = event.params.poolId;
  let poolAddress = getPoolAddress(poolId);

  let pool = Pool.load(poolId);
  if (pool == null) {
    log.warning("Pool not found in handleSwap: {} {}", [
      poolAddress.toHex(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  pool.swapsCount = pool.swapsCount.plus(BigInt.fromI32(1));
  pool.save();

  createUser(event.transaction.from);

  let swap = new Swap(event.transaction.hash.concatI32(event.logIndex.toI32()));

  let tokenIn = getToken(event.params.tokenIn);
  let tokenOut = getToken(event.params.tokenOut);
  let swapFeeToken = getToken(event.params.tokenOut);

  let tokenAmountIn = scaleDown(event.params.amountIn, tokenIn.decimals);
  let tokenAmountOut = scaleDown(event.params.amountOut, tokenOut.decimals);
  let swapFeeAmount = tokenAmountIn.times(pool.swapFee);

  swap.pool = event.params.poolId;
  swap.tokenIn = event.params.tokenIn;
  swap.tokenInSymbol = tokenIn.symbol;
  swap.tokenAmountIn = tokenAmountIn;
  swap.tokenOut = event.params.tokenOut;
  swap.tokenOutSymbol = tokenOut.symbol;
  swap.tokenAmountOut = tokenAmountOut;
  swap.swapFeeToken = swapFeeToken.id;
  swap.swapFeeAmount = swapFeeAmount;
  swap.user = event.transaction.from;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;
  swap.blockTimestamp = event.block.timestamp;
  swap.transactionHash = event.transaction.hash;

  swap.save();

  let tokenInAddress = event.params.tokenIn;
  let tokenOutAddress = event.params.tokenOut;

  if (tokenInAddress == poolAddress) {
    pool.totalShares = pool.totalShares.minus(tokenAmountIn);
    let vaultPoolShare = getPoolShare(poolAddress, VAULT_ADDRESS);
    vaultPoolShare.balance = vaultPoolShare.balance.minus(tokenAmountIn);
    vaultPoolShare.save();
  } else if (tokenOutAddress == poolAddress) {
    pool.totalShares = pool.totalShares.plus(tokenAmountOut);
    let vaultPoolShare = getPoolShare(poolAddress, VAULT_ADDRESS);
    vaultPoolShare.balance = vaultPoolShare.balance.plus(tokenAmountOut);
    vaultPoolShare.save();
  }

  let poolTokenIn = loadPoolToken(poolId, tokenInAddress);
  let poolTokenOut = loadPoolToken(poolId, tokenOutAddress);
  if (poolTokenIn == null || poolTokenOut == null) {
    log.warning(
      "PoolToken not found in handleSwap: (tokenIn: {}), (tokenOut: {})",
      [tokenInAddress.toHexString(), tokenOutAddress.toHexString()]
    );
    return;
  }

  let vault = getVault(event.address);

  let newInAmount = poolTokenIn.balance.plus(tokenAmountIn);
  poolTokenIn.balance = newInAmount;
  poolTokenIn.volume = poolTokenIn.volume.plus(tokenAmountIn);
  poolTokenIn.totalProtocolSwapFee = poolTokenIn.totalProtocolSwapFee.plus(
    swapFeeAmount.times(vault.protocolSwapFee)
  );
  poolTokenIn.save();

  let newOutAmount = poolTokenOut.balance.minus(tokenAmountOut);
  poolTokenOut.balance = newOutAmount;
  poolTokenOut.volume = poolTokenOut.volume.plus(tokenAmountOut);
  poolTokenOut.save();

  // updateProtocolFeeAmounts(pool);
  createPoolSnapshot(pool, event.block.timestamp.toI32());
}

export function handleFlashLoanFeePercentageChanged(
  event: FlashLoanFeePercentageChanged
): void {
  let vault = getVault(VAULT_ADDRESS);
  vault.protocolFlashLoanFee = scaleDown(
    event.params.newFlashLoanFeePercentage,
    18
  );
  vault.save();
}

export function handleSwapFeePercentageChanged(
  event: SwapFeePercentageChanged
): void {
  let vault = getVault(VAULT_ADDRESS);
  vault.protocolSwapFee = scaleDown(event.params.newSwapFeePercentage, 18);
  vault.protocolYieldFee = scaleDown(event.params.newSwapFeePercentage, 18);
  vault.save();
}
