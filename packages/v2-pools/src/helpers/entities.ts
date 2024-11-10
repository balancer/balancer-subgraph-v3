import { Address } from "@graphprotocol/graph-ts";
import { Factory, Pool } from "../types/schema";

export function getFactory(
  factoryAddress: Address,
  type: string,
  version: i32
): Factory {
  let factory = Factory.load(factoryAddress);

  if (factory == null) {
    factory = new Factory(factoryAddress);
    factory.address = factoryAddress;
    factory.type = type;
    factory.version = version;
    factory.save();
  }

  return factory;
}
