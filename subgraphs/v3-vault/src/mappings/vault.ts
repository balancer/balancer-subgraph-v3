import {
  Address,
  BigDecimal,
  BigInt,
  dataSource,
  log,
} from "@graphprotocol/graph-ts";
import {
  BufferSharesBurned,
  BufferSharesMinted,
  LiquidityAdded,
  LiquidityAddedToBuffer,
  LiquidityRemoved,
  LiquidityRemovedFromBuffer,
  PoolPausedStateChanged,
  PoolRecoveryModeStateChanged,
  PoolRegistered,
  ProtocolFeeControllerChanged,
  Swap as SwapEvent,
  SwapFeePercentageChanged,
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
  createPoolToken,
  createRateProvider,
  getToken,
  getVault,
  loadPoolToken,
  updateProtocolYieldFeeAmounts,
} from "../helpers/entities";
import { ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../helpers/constants";
import { hexToBigInt, scaleDown, scaleUp } from "../helpers/misc";
import { BPT, ProtocolFeeController } from "../types/templates";
import { ERC20 } from "../types/Vault/ERC20";
import { VaultExtension } from "../types/Vault/VaultExtension";
import { ERC4626 } from "../types/Vault/ERC4626";
import { mulDownSwapFee } from "../helpers/math";

/************************************
 ******* POOLS REGISTRATIONS ********
 ************************************/

export function handlePoolRegistered(event: PoolRegistered): void {
  let vault = getVault();
  let poolAddress = event.params.pool;

  let pool = new Pool(poolAddress);
  pool.vault = vault.id;
  pool.address = poolAddress;
  pool.factory = event.params.factory;
  pool.pauseWindowEndTime = event.params.pauseWindowEndTime;
  pool.totalShares = ZERO_BD;
  pool.isInitialized = false;
  pool.isInRecoveryMode = false;
  pool.isPaused = false;
  pool.swapsCount = ZERO_BI;
  pool.holdersCount = ZERO_BI;
  pool.protocolSwapFee = vault.protocolSwapFee;
  pool.protocolYieldFee = vault.protocolYieldFee;
  pool.poolCreatorSwapFee = ZERO_BD;
  pool.poolCreatorYieldFee = ZERO_BD;

  pool.swapFeeManager = event.params.roleAccounts.swapFeeManager;
  pool.pauseManager = event.params.roleAccounts.pauseManager;
  pool.poolCreator = event.params.roleAccounts.poolCreator;

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

  BPT.create(poolAddress);
}

/************************************
 ********** ADDS & REMOVES **********
 ************************************/

export function handleLiquidityAdded(event: LiquidityAdded): void {
  let poolAddress = event.params.pool;
  let amountsAddedRaw = event.params.amountsAddedRaw;

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
  let joinAmounts = new Array<BigDecimal>(amountsAddedRaw.length);

  let vault = VaultExtension.bind(event.address);
  let poolTokensInfo = vault.getPoolTokenInfo(poolAddress);

  for (let i: i32 = 0; i < poolTokens.length; i++) {
    let poolToken = poolTokens[i];
    let joinAmount = scaleDown(
      event.params.amountsAddedRaw[i],
      poolToken.decimals
    );
    joinAmounts[i] = joinAmount;

    poolToken.balance = scaleDown(
      poolTokensInfo.getBalancesRaw()[i],
      poolToken.decimals
    );

    let aggregateSwapFeeAmount = scaleDown(
      mulDownSwapFee(event.params.swapFeeAmountsRaw[i], pool.protocolSwapFee),
      poolToken.decimals
    );

    poolToken.vaultProtocolSwapFeeBalance =
      poolToken.vaultProtocolSwapFeeBalance.plus(aggregateSwapFeeAmount);
    poolToken.totalProtocolSwapFee = poolToken.totalProtocolSwapFee.plus(
      aggregateSwapFeeAmount
    );

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

  const storeEventsFrom = dataSource.context().get("storeEventsFrom");
  if (storeEventsFrom && event.block.number > storeEventsFrom.toBigInt()) {
    join.save();
  }

  updateProtocolYieldFeeAmounts(pool);
}

export function handleLiquidityRemoved(event: LiquidityRemoved): void {
  let poolAddress = event.params.pool;
  let amounts: BigInt[] = event.params.amountsRemovedRaw;

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

  let vault = VaultExtension.bind(event.address);
  let poolTokensInfo = vault.getPoolTokenInfo(poolAddress);

  for (let i: i32 = 0; i < poolTokens.length; i++) {
    let poolToken = poolTokens[i];
    let exitAmount = scaleDown(
      event.params.amountsRemovedRaw[i],
      poolToken.decimals
    );
    exitAmounts[i] = exitAmount;

    poolToken.balance = scaleDown(
      poolTokensInfo.getBalancesRaw()[i],
      poolToken.decimals
    );

    let aggregateSwapFeeAmount = scaleDown(
      mulDownSwapFee(event.params.swapFeeAmountsRaw[i], pool.protocolSwapFee),
      poolToken.decimals
    );

    poolToken.vaultProtocolSwapFeeBalance =
      poolToken.vaultProtocolSwapFeeBalance.plus(aggregateSwapFeeAmount);
    poolToken.totalProtocolSwapFee = poolToken.totalProtocolSwapFee.plus(
      aggregateSwapFeeAmount
    );

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

  const storeEventsFrom = dataSource.context().get("storeEventsFrom");
  if (storeEventsFrom && event.block.number > storeEventsFrom.toBigInt()) {
    exit.save();
  }

  updateProtocolYieldFeeAmounts(pool);
}

/************************************
 ************** SWAPS ***************
 ************************************/

export function handleSwap(event: SwapEvent): void {
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

  let swapFeePercentage = scaleDown(event.params.swapFeePercentage, 18);

  let hasDynamicSwapFee = pool.swapFee != swapFeePercentage;
  let swapFeeBaseAmount = swapFeeAmount;
  let swapFeeDeltaAmount = ZERO_BD;
  if (hasDynamicSwapFee) {
    let swapFeeDelta = swapFeePercentage.minus(pool.swapFee);
    swapFeeBaseAmount = scaleDown(
      mulDownSwapFee(event.params.amountIn, pool.swapFee),
      tokenIn.decimals
    );
    swapFeeDeltaAmount = scaleDown(
      mulDownSwapFee(event.params.amountIn, swapFeeDelta),
      tokenIn.decimals
    );
  }

  swap.pool = event.params.pool;
  swap.tokenIn = event.params.tokenIn;
  swap.tokenInSymbol = tokenIn.symbol;
  swap.tokenAmountIn = tokenAmountIn;
  swap.tokenOut = event.params.tokenOut;
  swap.tokenOutSymbol = tokenOut.symbol;
  swap.tokenAmountOut = tokenAmountOut;
  swap.swapFeeAmount = swapFeeAmount;
  swap.swapFeeBaseAmount = swapFeeBaseAmount;
  swap.swapFeeDeltaAmount = swapFeeDeltaAmount;
  swap.swapFeeToken = event.params.tokenIn;
  swap.swapFeePercentage = swapFeePercentage;
  swap.hasDynamicSwapFee = hasDynamicSwapFee;
  swap.user = event.transaction.from;
  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;
  swap.blockTimestamp = event.block.timestamp;
  swap.transactionHash = event.transaction.hash;

  const storeEventsFrom = dataSource.context().get("storeEventsFrom");
  if (storeEventsFrom && event.block.number > storeEventsFrom.toBigInt()) {
    swap.save();
  }

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

  let aggregateSwapFeeAmount = scaleDown(
    mulDownSwapFee(event.params.swapFeeAmount, pool.protocolSwapFee),
    poolTokenIn.decimals
  );

  let vault = VaultExtension.bind(event.address);
  let poolTokensInfo = vault.getPoolTokenInfo(poolAddress);

  poolTokenIn.balance = scaleDown(
    poolTokensInfo.getBalancesRaw()[poolTokenIn.index],
    poolTokenIn.decimals
  );
  poolTokenIn.volume = poolTokenIn.volume.plus(tokenAmountIn);
  poolTokenIn.totalSwapFee = poolTokenIn.totalSwapFee.plus(swapFeeAmount);
  poolTokenIn.vaultProtocolSwapFeeBalance =
    poolTokenIn.vaultProtocolSwapFeeBalance.plus(aggregateSwapFeeAmount);
  poolTokenIn.totalProtocolSwapFee = poolTokenIn.totalProtocolSwapFee.plus(
    aggregateSwapFeeAmount
  );

  poolTokenIn.totalStaticSwapFee =
    poolTokenIn.totalStaticSwapFee.plus(swapFeeAmount);
  poolTokenIn.totalSwapFeeBase =
    poolTokenIn.totalSwapFeeBase.plus(swapFeeBaseAmount);

  if (hasDynamicSwapFee) {
    poolTokenIn.totalDynamicSwapFee =
      poolTokenIn.totalDynamicSwapFee.plus(swapFeeAmount);
  }

  poolTokenIn.save();

  poolTokenOut.balance = scaleDown(
    poolTokensInfo.getBalancesRaw()[poolTokenOut.index],
    poolTokenOut.decimals
  );
  poolTokenOut.volume = poolTokenOut.volume.plus(tokenAmountOut);
  poolTokenOut.save();

  updateProtocolYieldFeeAmounts(pool);
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

// For Wrap/Unwrap events, bufferBalances is encoded into bytes as follows:
// [    16 bytes       |       16 bytes      ]
// [  wrappedBalance   |  underlyingBalance  ]
// [MSB                                   LSB]
export function handleUnwrap(event: Unwrap): void {
  let buffer = getBuffer(event.params.wrappedToken);

  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let underlyingToken = getToken(changetype<Address>(buffer.underlyingToken));

  // Convert to hex and remove the 0x prefix
  const bufferBalances = event.params.bufferBalances.toHex().slice(2);

  // Each byte represents 2 hex digits
  // Thus each balance is represented by 32 chars
  let wrappedBalance = bufferBalances.slice(0, 32);
  let underlyingBalance = bufferBalances.slice(32, 64);

  buffer.underlyingBalance = scaleDown(
    hexToBigInt(underlyingBalance),
    wrappedToken.decimals
  );
  buffer.wrappedBalance = scaleDown(
    hexToBigInt(wrappedBalance),
    underlyingToken.decimals
  );
  buffer.save();
}

// For Wrap/Unwrap events, bufferBalances is encoded into bytes as follows:
// [    16 bytes       |       16 bytes      ]
// [  wrappedBalance   |  underlyingBalance  ]
// [MSB                                   LSB]
export function handleWrap(event: Wrap): void {
  let buffer = getBuffer(event.params.wrappedToken);

  let wrappedToken = getToken(changetype<Address>(buffer.wrappedToken));
  let underlyingToken = getToken(changetype<Address>(buffer.underlyingToken));

  // Convert to hex and remove the 0x prefix
  const bufferBalances = event.params.bufferBalances.toHex().slice(2);

  // Each byte represents 2 hex digits
  // Thus each balance is represented by 32 chars
  let wrappedBalance = bufferBalances.slice(0, 32);
  let underlyingBalance = bufferBalances.slice(32, 64);

  buffer.underlyingBalance = scaleDown(
    hexToBigInt(underlyingBalance),
    wrappedToken.decimals
  );
  buffer.wrappedBalance = scaleDown(
    hexToBigInt(wrappedBalance),
    underlyingToken.decimals
  );
  buffer.save();
}

/************************************
 ********** POOLS STATE *************
 ************************************/

let FEE_SCALING_FACTOR = BigInt.fromI32(10).pow(11);

export function handleSwapFeePercentageChanged(
  event: SwapFeePercentageChanged
): void {
  let pool = Pool.load(event.params.pool);
  if (!pool) return;

  // Replicate the smart contract rounding behavior
  // https://github.com/balancer/balancer-v3-monorepo/blob/0d2de793ea4da7b0750f56ea01c8ea9788801f64/pkg/vault/contracts/lib/PoolConfigLib.sol#L167
  let roundedSwapFee = event.params.swapFeePercentage
    .div(FEE_SCALING_FACTOR)
    .times(FEE_SCALING_FACTOR);

  pool.swapFee = scaleDown(roundedSwapFee, 18);
  pool.save();
}

export function handlePoolRecoveryModeStateChanged(
  event: PoolRecoveryModeStateChanged
): void {
  let pool = Pool.load(event.params.pool) as Pool;
  pool.isInRecoveryMode = event.params.recoveryMode;
  pool.save();
}

export function handlePoolPausedStateChanged(
  event: PoolPausedStateChanged
): void {
  let pool = Pool.load(event.params.pool) as Pool;
  pool.isPaused = event.params.paused;
  pool.save();
}

/************************************
 ********* FEE CONTROLLER ***********
 ************************************/

export function handleProtocolFeeControllerChanged(
  event: ProtocolFeeControllerChanged
): void {
  let vault = getVault();
  vault.protocolFeeController = event.params.newProtocolFeeController;
  vault.save();

  ProtocolFeeController.create(event.params.newProtocolFeeController);
}
