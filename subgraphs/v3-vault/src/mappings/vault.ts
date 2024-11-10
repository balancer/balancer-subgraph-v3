import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  BufferSharesBurned,
  BufferSharesMinted,
  LiquidityAddedToBuffer,
  LiquidityRemovedFromBuffer,
  PoolBalanceChanged,
  PoolRegistered,
  Swap as SwapEvent,
  Unwrap,
  Wrap,
} from "../types/Vault/Vault";
import {
  Buffer,
  BufferShare,
  Pool,
  Swap,
  AddRemove,
  Hook,
  HookConfig,
  LiquidityManagement,
} from "../types/schema";
import {
  createPoolSnapshot,
  createPoolToken,
  createRateProvider,
  createUser,
  getToken,
  getVault,
  loadPoolToken,
  updateProtocolFeeAmounts,
} from "../helpers/entities";
import { ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../helpers/constants";
import { scaleDown } from "../helpers/misc";
import { BPT } from "../types/templates";
import { ERC20 } from "../types/Vault/ERC20";
import { VaultExtension } from "../types/Vault/VaultExtension";
import { ERC4626 } from "../types/Vault/ERC4626";

/************************************
 ******* POOLS REGISTRATIONS ********
 ************************************/

export function handlePoolRegistered(event: PoolRegistered): void {
  let vault = getVault(event.address);
  let poolAddress = event.params.pool;

  let pool = new Pool(poolAddress);
  pool.vault = vault.id;
  pool.address = poolAddress;
  pool.factory = event.params.factory;
  pool.pauseWindowEndTime = event.params.pauseWindowEndTime;
  pool.pauseManager = event.params.roleAccounts.pauseManager;
  pool.totalShares = ZERO_BD;
  pool.isInitialized = false;
  pool.swapsCount = ZERO_BI;
  pool.holdersCount = ZERO_BI;
  pool.protocolSwapFee = ZERO_BD;
  pool.protocolYieldFee = ZERO_BD;
  pool.poolCreatorSwapFee = ZERO_BD;
  pool.poolCreatorYieldFee = ZERO_BD;

  let poolContract = ERC20.bind(poolAddress);
  let symbolCall = poolContract.try_symbol();
  let nameCall = poolContract.try_name();

  pool.name = nameCall.reverted ? "" : nameCall.value;
  pool.symbol = symbolCall.reverted ? "" : symbolCall.value;

  let vaultContract = VaultExtension.bind(event.address);
  let swapFeeCall = vaultContract.try_getStaticSwapFeePercentage(poolAddress);

  pool.swapFee = swapFeeCall.reverted
    ? ZERO_BD
    : scaleDown(swapFeeCall.value, 18);

  pool.blockNumber = event.block.number;
  pool.blockTimestamp = event.block.timestamp;
  pool.transactionHash = event.transaction.hash;

  for (let i: i32 = 0; i < event.params.tokenConfig.length; i++) {
    let tokenConfig = event.params.tokenConfig[i];
    createPoolToken(poolAddress, tokenConfig, i);
    createRateProvider(poolAddress, tokenConfig);
  }

  let hookAddress = event.params.hooksConfig.hooksContract;
  let hook = Hook.load(hookAddress);
  if (!hook) {
    hook = new Hook(hookAddress);
    hook.address = hookAddress;
    hook.save();
  }

  let hookConfig = new HookConfig(hookAddress.concat(poolAddress));
  hookConfig.pool = poolAddress;
  hookConfig.hook = hookAddress;
  hookConfig.enableHookAdjustedAmounts =
    event.params.hooksConfig.enableHookAdjustedAmounts;
  hookConfig.shouldCallBeforeInitialize =
    event.params.hooksConfig.shouldCallBeforeInitialize;
  hookConfig.shouldCallAfterInitialize =
    event.params.hooksConfig.shouldCallAfterInitialize;
  hookConfig.shouldCallComputeDynamicSwapFee =
    event.params.hooksConfig.shouldCallComputeDynamicSwapFee;
  hookConfig.shouldCallBeforeSwap =
    event.params.hooksConfig.shouldCallBeforeSwap;
  hookConfig.shouldCallAfterSwap = event.params.hooksConfig.shouldCallAfterSwap;
  hookConfig.shouldCallBeforeAddLiquidity =
    event.params.hooksConfig.shouldCallBeforeAddLiquidity;
  hookConfig.shouldCallAfterAddLiquidity =
    event.params.hooksConfig.shouldCallAfterAddLiquidity;
  hookConfig.shouldCallBeforeRemoveLiquidity =
    event.params.hooksConfig.shouldCallBeforeRemoveLiquidity;
  hookConfig.shouldCallAfterRemoveLiquidity =
    event.params.hooksConfig.shouldCallAfterRemoveLiquidity;
  hookConfig.save();

  let liquidityManagement = new LiquidityManagement(poolAddress);
  liquidityManagement.pool = poolAddress;
  liquidityManagement.enableRemoveLiquidityCustom =
    event.params.liquidityManagement.enableRemoveLiquidityCustom;
  liquidityManagement.disableUnbalancedLiquidity =
    event.params.liquidityManagement.disableUnbalancedLiquidity;
  liquidityManagement.enableAddLiquidityCustom =
    event.params.liquidityManagement.enableAddLiquidityCustom;
  liquidityManagement.enableDonation =
    event.params.liquidityManagement.enableDonation;
  liquidityManagement.save();

  pool.liquidityManagement = liquidityManagement.id;
  pool.hookConfig = hookConfig.id;
  pool.hook = hook.id;
  pool.save();

  createPoolSnapshot(pool, event.block.timestamp.toI32());

  BPT.create(poolAddress);
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
  let poolAddress = event.params.pool;
  let amounts: BigInt[] = event.params.deltas;

  let transactionHash = event.transaction.hash;
  let logIndex = event.logIndex;

  let pool = Pool.load(poolAddress);
  if (pool == null) {
    log.warning("Pool not found in handlePoolJoined: {} {}", [
      poolAddress.toHex(),
      transactionHash.toHex(),
    ]);
    return;
  }

  pool.isInitialized = true;
  pool.save();

  let joinId = transactionHash.concatI32(logIndex.toI32());
  let join = new AddRemove(joinId);

  let poolTokens = pool.tokens.load();
  let joinAmounts = new Array<BigDecimal>(amounts.length);

  for (let i: i32 = 0; i < poolTokens.length; i++) {
    let poolToken = poolTokens[i];
    let joinAmount = scaleDown(event.params.deltas[i], poolToken.decimals);
    joinAmounts[i] = joinAmount;
    poolToken.balance = poolToken.balance.plus(joinAmount);
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
  let poolAddress = event.params.pool;
  let amounts: BigInt[] = event.params.deltas;

  let transactionHash = event.transaction.hash;
  let logIndex = event.logIndex;

  let pool = Pool.load(poolAddress);
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
  createUser(event.transaction.from);

  let swap = new Swap(event.transaction.hash.concatI32(event.logIndex.toI32()));

  let tokenIn = getToken(event.params.tokenIn);
  let tokenOut = getToken(event.params.tokenOut);
  let swapFeeToken = getToken(event.params.tokenIn);

  let tokenAmountIn = scaleDown(event.params.amountIn, tokenIn.decimals);
  let tokenAmountOut = scaleDown(event.params.amountOut, tokenOut.decimals);
  let swapFeeAmount = scaleDown(
    event.params.swapFeeAmount,
    swapFeeToken.decimals
  );

  swap.pool = event.params.pool;
  swap.tokenIn = event.params.tokenIn;
  swap.tokenInSymbol = tokenIn.symbol;
  swap.tokenAmountIn = tokenAmountIn;
  swap.tokenOut = event.params.tokenOut;
  swap.tokenOutSymbol = tokenOut.symbol;
  swap.tokenAmountOut = tokenAmountOut;
  swap.swapFeeAmount = swapFeeAmount;
  swap.swapFeeToken = event.params.tokenIn;
  swap.swapFeePercentage = scaleDown(event.params.swapFeePercentage, 18);
  swap.user = event.transaction.from;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;
  swap.blockTimestamp = event.block.timestamp;
  swap.transactionHash = event.transaction.hash;

  swap.save();

  let poolAddress = event.params.pool;

  let pool = Pool.load(poolAddress);
  if (pool == null) {
    log.warning("Pool not found in handleSwap: {} {}", [
      poolAddress.toHex(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  pool.swapsCount = pool.swapsCount.plus(BigInt.fromI32(1));
  pool.save();

  let tokenInAddress = event.params.tokenIn;
  let tokenOutAddress = event.params.tokenOut;

  let poolTokenIn = loadPoolToken(poolAddress, tokenInAddress);
  let poolTokenOut = loadPoolToken(poolAddress, tokenOutAddress);
  if (poolTokenIn == null || poolTokenOut == null) {
    log.warning(
      "PoolToken not found in handleSwap: (tokenIn: {}), (tokenOut: {})",
      [tokenInAddress.toHexString(), tokenOutAddress.toHexString()]
    );
    return;
  }

  let newInAmount = poolTokenIn.balance.plus(tokenAmountIn);
  poolTokenIn.balance = newInAmount;
  poolTokenIn.volume = poolTokenIn.volume.plus(tokenAmountIn);
  poolTokenIn.save();

  let newOutAmount = poolTokenOut.balance.minus(tokenAmountOut);
  poolTokenOut.balance = newOutAmount;
  poolTokenOut.volume = poolTokenOut.volume.plus(tokenAmountOut);
  poolTokenOut.save();

  updateProtocolFeeAmounts(pool);
  createPoolSnapshot(pool, event.block.timestamp.toI32());
}

/************************************
 ************* BUFFERS **************
 ************************************/

export function getBuffer(wrappedTokenAddress: Address): Buffer {
  let buffer = Buffer.load(wrappedTokenAddress);

  if (buffer) return buffer;

  let erc4626Contract = ERC4626.bind(wrappedTokenAddress);
  let asset = erc4626Contract.try_asset();
  let underlyingTokenAddress = asset.reverted ? ZERO_ADDRESS : asset.value;

  let wrappedToken = getToken(wrappedTokenAddress);
  let underlyingToken = getToken(underlyingTokenAddress);

  buffer = new Buffer(wrappedTokenAddress);
  buffer.wrappedToken = wrappedToken.id;
  buffer.underlyingToken = underlyingToken.id;
  buffer.wrappedBalance = ZERO_BD;
  buffer.underlyingBalance = ZERO_BD;
  buffer.totalShares = ZERO_BD;

  return buffer;
}

export function handleLiquidityAddedToBuffer(
  event: LiquidityAddedToBuffer
): void {
  let buffer = getBuffer(event.params.wrappedToken);

  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let underlyingToken = getToken(changetype<Address>(buffer.underlyingToken));

  let amountWrapped = scaleDown(
    event.params.amountWrapped,
    wrappedToken.decimals
  );
  let amountUnderlying = scaleDown(
    event.params.amountUnderlying,
    underlyingToken.decimals
  );

  buffer.wrappedBalance = buffer.wrappedBalance.plus(amountWrapped);
  buffer.underlyingBalance = buffer.underlyingBalance.plus(amountUnderlying);

  buffer.save();
}

export function handleLiquidityRemovedFromBuffer(
  event: LiquidityRemovedFromBuffer
): void {
  let buffer = getBuffer(event.params.wrappedToken);

  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let underlyingToken = getToken(changetype<Address>(buffer.underlyingToken));

  let amountWrapped = scaleDown(
    event.params.amountWrapped,
    wrappedToken.decimals
  );
  let amountUnderlying = scaleDown(
    event.params.amountUnderlying,
    underlyingToken.decimals
  );

  buffer.wrappedBalance = buffer.wrappedBalance.minus(amountWrapped);
  buffer.underlyingBalance = buffer.underlyingBalance.minus(amountUnderlying);

  buffer.save();
}

export function handleBufferSharesMinted(event: BufferSharesMinted): void {
  createUser(event.params.to);

  let buffer = getBuffer(event.params.wrappedToken);
  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let issuedShares = scaleDown(
    event.params.issuedShares,
    wrappedToken.decimals
  );
  buffer.totalShares = buffer.totalShares.plus(issuedShares);
  buffer.save();

  let bufferShareId = buffer.id.concat(event.params.to);
  let bufferShare = BufferShare.load(bufferShareId);

  if (!bufferShare) {
    bufferShare = new BufferShare(bufferShareId);
    bufferShare.user = event.params.to;
    bufferShare.buffer = buffer.id;
    bufferShare.balance = ZERO_BD;
  }

  bufferShare.balance = bufferShare.balance.plus(issuedShares);
  bufferShare.save();
}

export function handleBufferSharesBurned(event: BufferSharesBurned): void {
  createUser(event.params.from);

  let buffer = getBuffer(event.params.wrappedToken);
  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let burnedShares = scaleDown(
    event.params.burnedShares,
    wrappedToken.decimals
  );
  buffer.totalShares = buffer.totalShares.minus(burnedShares);
  buffer.save();

  let bufferShareId = event.params.wrappedToken.concat(event.params.from);
  let bufferShare = BufferShare.load(bufferShareId);

  if (!bufferShare) {
    bufferShare = new BufferShare(bufferShareId);
    bufferShare.user = event.params.from;
    bufferShare.buffer = buffer.id;
    bufferShare.balance = ZERO_BD;
  }

  bufferShare.balance = bufferShare.balance.minus(burnedShares);
  bufferShare.save();
}

export function handleUnwrap(event: Unwrap): void {
  let buffer = getBuffer(event.params.wrappedToken);

  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let underlyingToken = getToken(changetype<Address>(buffer.underlyingToken));

  let burnedShares = scaleDown(
    event.params.burnedShares,
    wrappedToken.decimals
  );
  let withdrawnUnderlying = scaleDown(
    event.params.withdrawnUnderlying,
    underlyingToken.decimals
  );

  buffer.underlyingBalance =
    buffer.underlyingBalance.minus(withdrawnUnderlying);
  buffer.wrappedBalance = buffer.wrappedBalance.plus(burnedShares);
  buffer.save();
}

export function handleWrap(event: Wrap): void {
  let buffer = getBuffer(event.params.wrappedToken);

  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let underlyingToken = getToken(changetype<Address>(buffer.underlyingToken));

  let mintedShares = scaleDown(
    event.params.mintedShares,
    wrappedToken.decimals
  );
  let depositedUnderlying = scaleDown(
    event.params.depositedUnderlying,
    underlyingToken.decimals
  );

  buffer.underlyingBalance = buffer.underlyingBalance.plus(depositedUnderlying);
  buffer.wrappedBalance = buffer.wrappedBalance.minus(mintedShares);
  buffer.save();
}
