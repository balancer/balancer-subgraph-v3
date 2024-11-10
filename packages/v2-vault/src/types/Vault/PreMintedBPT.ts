// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class PreMintedBPT extends ethereum.SmartContract {
  static bind(address: Address): PreMintedBPT {
    return new PreMintedBPT("PreMintedBPT", address);
  }

  getActualSupply(): BigInt {
    let result = super.call(
      "getActualSupply",
      "getActualSupply():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getActualSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getActualSupply",
      "getActualSupply():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}
