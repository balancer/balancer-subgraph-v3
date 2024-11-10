// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class RewardsOnlyGaugeCreated extends ethereum.Event {
  get params(): RewardsOnlyGaugeCreated__Params {
    return new RewardsOnlyGaugeCreated__Params(this);
  }
}

export class RewardsOnlyGaugeCreated__Params {
  _event: RewardsOnlyGaugeCreated;

  constructor(event: RewardsOnlyGaugeCreated) {
    this._event = event;
  }

  get gauge(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get pool(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get streamer(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class ChildChainLiquidityGaugeFactory extends ethereum.SmartContract {
  static bind(address: Address): ChildChainLiquidityGaugeFactory {
    return new ChildChainLiquidityGaugeFactory(
      "ChildChainLiquidityGaugeFactory",
      address
    );
  }

  create(pool: Address): Address {
    let result = super.call("create", "create(address):(address)", [
      ethereum.Value.fromAddress(pool)
    ]);

    return result[0].toAddress();
  }

  try_create(pool: Address): ethereum.CallResult<Address> {
    let result = super.tryCall("create", "create(address):(address)", [
      ethereum.Value.fromAddress(pool)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getChildChainStreamerImplementation(): Address {
    let result = super.call(
      "getChildChainStreamerImplementation",
      "getChildChainStreamerImplementation():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getChildChainStreamerImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getChildChainStreamerImplementation",
      "getChildChainStreamerImplementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getGaugeImplementation(): Address {
    let result = super.call(
      "getGaugeImplementation",
      "getGaugeImplementation():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getGaugeImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getGaugeImplementation",
      "getGaugeImplementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getGaugePool(gauge: Address): Address {
    let result = super.call("getGaugePool", "getGaugePool(address):(address)", [
      ethereum.Value.fromAddress(gauge)
    ]);

    return result[0].toAddress();
  }

  try_getGaugePool(gauge: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getGaugePool",
      "getGaugePool(address):(address)",
      [ethereum.Value.fromAddress(gauge)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getGaugeStreamer(gauge: Address): Address {
    let result = super.call(
      "getGaugeStreamer",
      "getGaugeStreamer(address):(address)",
      [ethereum.Value.fromAddress(gauge)]
    );

    return result[0].toAddress();
  }

  try_getGaugeStreamer(gauge: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getGaugeStreamer",
      "getGaugeStreamer(address):(address)",
      [ethereum.Value.fromAddress(gauge)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getPoolGauge(pool: Address): Address {
    let result = super.call("getPoolGauge", "getPoolGauge(address):(address)", [
      ethereum.Value.fromAddress(pool)
    ]);

    return result[0].toAddress();
  }

  try_getPoolGauge(pool: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getPoolGauge",
      "getPoolGauge(address):(address)",
      [ethereum.Value.fromAddress(pool)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getPoolStreamer(pool: Address): Address {
    let result = super.call(
      "getPoolStreamer",
      "getPoolStreamer(address):(address)",
      [ethereum.Value.fromAddress(pool)]
    );

    return result[0].toAddress();
  }

  try_getPoolStreamer(pool: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getPoolStreamer",
      "getPoolStreamer(address):(address)",
      [ethereum.Value.fromAddress(pool)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isGaugeFromFactory(gauge: Address): boolean {
    let result = super.call(
      "isGaugeFromFactory",
      "isGaugeFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(gauge)]
    );

    return result[0].toBoolean();
  }

  try_isGaugeFromFactory(gauge: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isGaugeFromFactory",
      "isGaugeFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(gauge)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isStreamerFromFactory(streamer: Address): boolean {
    let result = super.call(
      "isStreamerFromFactory",
      "isStreamerFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(streamer)]
    );

    return result[0].toBoolean();
  }

  try_isStreamerFromFactory(streamer: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isStreamerFromFactory",
      "isStreamerFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(streamer)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get gauge(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get childChainStreamer(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateCall extends ethereum.Call {
  get inputs(): CreateCall__Inputs {
    return new CreateCall__Inputs(this);
  }

  get outputs(): CreateCall__Outputs {
    return new CreateCall__Outputs(this);
  }
}

export class CreateCall__Inputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get pool(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class CreateCall__Outputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}
