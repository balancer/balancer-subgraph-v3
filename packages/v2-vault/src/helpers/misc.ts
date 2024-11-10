import {
  Address,
  BigDecimal,
  BigInt,
  ByteArray,
  Bytes,
} from "@graphprotocol/graph-ts";

export function tokenToDecimal(amount: BigInt, decimals: i32): BigDecimal {
  let scale = BigInt.fromI32(10)
    .pow(decimals as u8)
    .toBigDecimal();
  return amount.toBigDecimal().div(scale);
}

export function scaleDown(num: BigInt, decimals: i32): BigDecimal {
  return num.divDecimal(BigInt.fromI32(10).pow(u8(decimals)).toBigDecimal());
}

export function scaleUp(num: BigDecimal, decimals: i32): BigInt {
  return BigInt.fromString(
    num
      .truncate(decimals)
      .times(BigInt.fromI32(10).pow(u8(decimals)).toBigDecimal())
      .toString()
  );
}

export function getPoolAddress(poolId: Bytes): Address {
  return changetype<Address>(
    Address.fromHexString(poolId.toHexString().slice(0, 42))
  );
}
