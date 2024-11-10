import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function scaleDown(num: BigInt, decimals: i32): BigDecimal {
  return num.divDecimal(BigInt.fromI32(10).pow(u8(decimals)).toBigDecimal());
}

export function scaleDownBPT(num: BigInt): BigDecimal {
  return scaleDown(num, 18);
}

export function scaleUp(num: BigDecimal, decimals: i32): BigInt {
  return BigInt.fromString(
    num
      .truncate(decimals)
      .times(BigInt.fromI32(10).pow(u8(decimals)).toBigDecimal())
      .toString(),
  );
}
