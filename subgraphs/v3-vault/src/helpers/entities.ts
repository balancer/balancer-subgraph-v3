import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Buffer,
  Pool,
  PoolToken,
  RateProvider,
  Token,
  Vault,
} from "../types/schema";
import { PoolShare } from "../types/schema";
import { ONE_BD, VAULT_ADDRESS, ZERO_ADDRESS, ZERO_BD } from "./constants";
import { PoolRegisteredTokenConfigStruct } from "../types/Vault/Vault";
import { ERC20 } from "../types/Vault/ERC20";
import { VaultExtension } from "../types/Vault/VaultExtension";
import { scaleDown } from "./misc";
import { ProtocolFeeController } from "../types/templates";

const DAY = 24 * 60 * 60;

export function getVault(): Vault {
  let vault: Vault | null = Vault.load(VAULT_ADDRESS);
  if (vault != null) return vault;

  let vaultContract = VaultExtension.bind(changetype<Address>(VAULT_ADDRESS));
  let protocolFeeController = vaultContract.getProtocolFeeController();

  vault = new Vault(VAULT_ADDRESS);
  vault.isPaused = false;
  vault.authorizer = ZERO_ADDRESS;
  vault.protocolSwapFee = ZERO_BD;
  vault.protocolYieldFee = ZERO_BD;
  vault.protocolFeeController = protocolFeeController;
  vault.save();

  ProtocolFeeController.create(protocolFeeController);

  return vault;
}

export function getPoolShareId(
  poolAddress: Address,
  userAddress: Address
): string {
  return poolAddress.toHex().concat("-").concat(userAddress.toHex());
}

export function getPoolShare(
  poolAddress: Address,
  userAddress: Address
): PoolShare {
  let poolShareId = getPoolShareId(poolAddress, userAddress);
  let poolShare = PoolShare.load(poolShareId);

  if (!poolShare) {
    poolShare = createPoolShare(poolAddress, userAddress);
  }

  return poolShare;
}

export function createPoolToken(
  poolAddress: Address,
  tokenConfig: PoolRegisteredTokenConfigStruct,
  index: i32
): void {
  let poolTokenId = poolAddress.concat(tokenConfig.token);
  let poolToken = PoolToken.load(poolTokenId);

  if (!poolToken) {
    poolToken = new PoolToken(poolTokenId);
  }

  let nestedPool = Pool.load(tokenConfig.token);

  let token = getToken(tokenConfig.token);

  poolToken.name = token.name;
  poolToken.symbol = token.symbol;
  poolToken.decimals = token.decimals;

  let buffer = Buffer.load(tokenConfig.token);

  let decimalDiff = 18 - poolToken.decimals;
  poolToken.scalingFactor = BigInt.fromI32(10).pow(u8(decimalDiff));

  poolToken.pool = poolAddress;
  poolToken.address = tokenConfig.token;
  poolToken.index = index;
  poolToken.priceRate = ONE_BD;
  poolToken.balance = ZERO_BD;
  poolToken.volume = ZERO_BD;
  poolToken.totalSwapFee = ZERO_BD;
  poolToken.totalSwapFeeBase = ZERO_BD;
  poolToken.totalSwapFeeDelta = ZERO_BD;
  poolToken.totalStaticSwapFee = ZERO_BD;
  poolToken.totalDynamicSwapFee = ZERO_BD;
  poolToken.totalProtocolSwapFee = ZERO_BD;
  poolToken.totalProtocolYieldFee = ZERO_BD;
  poolToken.controllerProtocolFeeBalance = ZERO_BD;
  poolToken.vaultProtocolSwapFeeBalance = ZERO_BD;
  poolToken.vaultProtocolYieldFeeBalance = ZERO_BD;
  poolToken.buffer = buffer ? buffer.id : null;
  poolToken.nestedPool = nestedPool ? nestedPool.id : null;
  poolToken.paysYieldFees = tokenConfig.paysYieldFees;
  poolToken.save();
}

export function createRateProvider(
  poolAddress: Address,
  tokenConfig: PoolRegisteredTokenConfigStruct
): void {
  let rateProviderId = poolAddress
    .concat(tokenConfig.token)
    .concat(tokenConfig.rateProvider);
  let rateProvider = RateProvider.load(rateProviderId);

  if (!rateProvider) {
    rateProvider = new RateProvider(rateProviderId);
  }

  rateProvider.pool = poolAddress;
  rateProvider.address = tokenConfig.rateProvider;
  rateProvider.token = poolAddress.concat(tokenConfig.token);
  rateProvider.save();
}

export function loadPoolToken(
  poolAddress: Address,
  tokenAddress: Address
): PoolToken {
  let poolTokenId = poolAddress.concat(tokenAddress);
  let poolToken = PoolToken.load(poolTokenId) as PoolToken;

  return poolToken;
}

export function createToken(tokenAddress: Address): void {
  let tokenContract = ERC20.bind(tokenAddress);

  let nameCall = tokenContract.try_name();
  let symbolCall = tokenContract.try_symbol();
  let decimalsCall = tokenContract.try_decimals();

  let token = new Token(tokenAddress);
  token.name = nameCall.reverted ? "" : nameCall.value;
  token.symbol = symbolCall.reverted ? "" : symbolCall.value;
  token.decimals = decimalsCall.reverted ? 0 : decimalsCall.value;
  token.address = tokenAddress;
  token.save();
}

export function getToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress);

  if (!token) {
    createToken(tokenAddress);
    token = Token.load(tokenAddress);
  }

  return token as Token;
}

export function createPoolShare(
  poolAddress: Address,
  userAddress: Address
): PoolShare {
  let poolShareId = getPoolShareId(poolAddress, userAddress);
  let poolShare = new PoolShare(poolShareId);
  poolShare.user = userAddress;
  poolShare.pool = poolAddress;
  poolShare.balance = ZERO_BD;
  poolShare.save();

  return poolShare;
}

export function updateProtocolYieldFeeAmounts(pool: Pool): void {
  let vault = VaultExtension.bind(changetype<Address>(pool.vault));

  let poolTokens = pool.tokens.load();
  for (let i = 0; i < poolTokens.length; i++) {
    let poolToken = poolTokens[i];

    if (!poolToken.paysYieldFees) continue;

    let aggregateYieldFee = vault.try_getAggregateYieldFeeAmount(
      changetype<Address>(pool.address),
      changetype<Address>(poolToken.address)
    );

    if (aggregateYieldFee.reverted) continue;

    let yieldFeeAmount = scaleDown(aggregateYieldFee.value, poolToken.decimals);
    let deltaYieldFee = yieldFeeAmount.minus(
      poolToken.vaultProtocolYieldFeeBalance
    );
    poolToken.vaultProtocolYieldFeeBalance = yieldFeeAmount;

    poolToken.totalProtocolYieldFee =
      poolToken.totalProtocolYieldFee.plus(deltaYieldFee);

    poolToken.save();
  }
}
