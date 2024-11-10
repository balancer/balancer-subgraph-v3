import {
  BigDecimal,
  BigInt,
  Address,
  dataSource,
} from "@graphprotocol/graph-ts";

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString("0");
export const ONE_BD = BigDecimal.fromString("1");

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

class AddressByNetwork {
  public canonical: string;
  public custom: string;
  public fantom: string;
}

let network: string = dataSource.network();

// this list should be updated only if vault is deployed on a new chain
// with an address different than the standard vanity address
// in that case, AddressByNetwork and forNetwork must be updated accordingly
// with a new entry for the new network - folowwing subgraph slugs
let vaultAddressByNetwork: AddressByNetwork = {
  canonical: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
  custom: "0x0000000000000000000000000000000000000000",
  fantom: "0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce",
};

function forNetwork(
  addressByNetwork: AddressByNetwork,
  network: string
): Address {
  if (network == "custom") {
    return Address.fromString(addressByNetwork.custom);
  } else if (network == "fantom") {
    return Address.fromString(addressByNetwork.fantom);
  } else {
    return Address.fromString(addressByNetwork.canonical);
  }
}

export let VAULT_ADDRESS = forNetwork(vaultAddressByNetwork, network);
