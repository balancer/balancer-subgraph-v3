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

export class GaugeCreated extends ethereum.Event {
  get params(): GaugeCreated__Params {
    return new GaugeCreated__Params(this);
  }
}

export class GaugeCreated__Params {
  _event: GaugeCreated;

  constructor(event: GaugeCreated) {
    this._event = event;
  }

  get gauge(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get pool(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class GaugeImplementationUpdated extends ethereum.Event {
  get params(): GaugeImplementationUpdated__Params {
    return new GaugeImplementationUpdated__Params(this);
  }
}

export class GaugeImplementationUpdated__Params {
  _event: GaugeImplementationUpdated;

  constructor(event: GaugeImplementationUpdated) {
    this._event = event;
  }

  get oldGaugeImplementation(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newGaugeImplementation(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class GaugeFactory extends ethereum.SmartContract {
  static bind(address: Address): GaugeFactory {
    return new GaugeFactory("GaugeFactory", address);
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

  getActionId(selector: Bytes): Bytes {
    let result = super.call("getActionId", "getActionId(bytes4):(bytes32)", [
      ethereum.Value.fromFixedBytes(selector)
    ]);

    return result[0].toBytes();
  }

  try_getActionId(selector: Bytes): ethereum.CallResult<Bytes> {
    let result = super.tryCall("getActionId", "getActionId(bytes4):(bytes32)", [
      ethereum.Value.fromFixedBytes(selector)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getAuthorizer(): Address {
    let result = super.call("getAuthorizer", "getAuthorizer():(address)", []);

    return result[0].toAddress();
  }

  try_getAuthorizer(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getAuthorizer",
      "getAuthorizer():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getAuthorizerAdaptor(): Address {
    let result = super.call(
      "getAuthorizerAdaptor",
      "getAuthorizerAdaptor():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getAuthorizerAdaptor(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getAuthorizerAdaptor",
      "getAuthorizerAdaptor():(address)",
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

  getVault(): Address {
    let result = super.call("getVault", "getVault():(address)", []);

    return result[0].toAddress();
  }

  try_getVault(): ethereum.CallResult<Address> {
    let result = super.tryCall("getVault", "getVault():(address)", []);
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

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

  get vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get gauge(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get authorizerAdaptor(): Address {
    return this._call.inputValues[2].value.toAddress();
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

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetAuthorizerAdaptorCall extends ethereum.Call {
  get inputs(): SetAuthorizerAdaptorCall__Inputs {
    return new SetAuthorizerAdaptorCall__Inputs(this);
  }

  get outputs(): SetAuthorizerAdaptorCall__Outputs {
    return new SetAuthorizerAdaptorCall__Outputs(this);
  }
}

export class SetAuthorizerAdaptorCall__Inputs {
  _call: SetAuthorizerAdaptorCall;

  constructor(call: SetAuthorizerAdaptorCall) {
    this._call = call;
  }

  get newGaugeImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetAuthorizerAdaptorCall__Outputs {
  _call: SetAuthorizerAdaptorCall;

  constructor(call: SetAuthorizerAdaptorCall) {
    this._call = call;
  }
}

export class SetGaugeImplementationCall extends ethereum.Call {
  get inputs(): SetGaugeImplementationCall__Inputs {
    return new SetGaugeImplementationCall__Inputs(this);
  }

  get outputs(): SetGaugeImplementationCall__Outputs {
    return new SetGaugeImplementationCall__Outputs(this);
  }
}

export class SetGaugeImplementationCall__Inputs {
  _call: SetGaugeImplementationCall;

  constructor(call: SetGaugeImplementationCall) {
    this._call = call;
  }

  get newGaugeImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetGaugeImplementationCall__Outputs {
  _call: SetGaugeImplementationCall;

  constructor(call: SetGaugeImplementationCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}