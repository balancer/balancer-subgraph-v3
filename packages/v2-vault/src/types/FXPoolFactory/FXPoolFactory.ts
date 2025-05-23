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

export class NewFXPool extends ethereum.Event {
  get params(): NewFXPool__Params {
    return new NewFXPool__Params(this);
  }
}

export class NewFXPool__Params {
  _event: NewFXPool;

  constructor(event: NewFXPool) {
    this._event = event;
  }

  get caller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get id(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get fxpool(): Address {
    return this._event.parameters[2].value.toAddress();
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

export class FXPoolFactory__getFxPoolsResultValue0Struct extends ethereum.Tuple {
  get poolAddress(): Address {
    return this[0].toAddress();
  }

  get poolId(): Bytes {
    return this[1].toBytes();
  }
}

export class FXPoolFactory__poolsResult {
  value0: Address;
  value1: Bytes;

  constructor(value0: Address, value1: Bytes) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromFixedBytes(this.value1));
    return map;
  }

  getPoolAddress(): Address {
    return this.value0;
  }

  getPoolId(): Bytes {
    return this.value1;
  }
}

export class FXPoolFactory extends ethereum.SmartContract {
  static bind(address: Address): FXPoolFactory {
    return new FXPoolFactory("FXPoolFactory", address);
  }

  getActiveFxPool(_assets: Array<Address>): Address {
    let result = super.call(
      "getActiveFxPool",
      "getActiveFxPool(address[]):(address)",
      [ethereum.Value.fromAddressArray(_assets)],
    );

    return result[0].toAddress();
  }

  try_getActiveFxPool(_assets: Array<Address>): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getActiveFxPool",
      "getActiveFxPool(address[]):(address)",
      [ethereum.Value.fromAddressArray(_assets)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getFxPools(
    _assets: Array<Address>,
  ): Array<FXPoolFactory__getFxPoolsResultValue0Struct> {
    let result = super.call(
      "getFxPools",
      "getFxPools(address[]):((address,bytes32)[])",
      [ethereum.Value.fromAddressArray(_assets)],
    );

    return result[0].toTupleArray<FXPoolFactory__getFxPoolsResultValue0Struct>();
  }

  try_getFxPools(
    _assets: Array<Address>,
  ): ethereum.CallResult<Array<FXPoolFactory__getFxPoolsResultValue0Struct>> {
    let result = super.tryCall(
      "getFxPools",
      "getFxPools(address[]):((address,bytes32)[])",
      [ethereum.Value.fromAddressArray(_assets)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<FXPoolFactory__getFxPoolsResultValue0Struct>(),
    );
  }

  newFXPool(
    _name: string,
    _symbol: string,
    _percentFee: BigInt,
    vault: Address,
    _assetsToRegister: Array<Address>,
  ): Bytes {
    let result = super.call(
      "newFXPool",
      "newFXPool(string,string,uint256,address,address[]):(bytes32)",
      [
        ethereum.Value.fromString(_name),
        ethereum.Value.fromString(_symbol),
        ethereum.Value.fromUnsignedBigInt(_percentFee),
        ethereum.Value.fromAddress(vault),
        ethereum.Value.fromAddressArray(_assetsToRegister),
      ],
    );

    return result[0].toBytes();
  }

  try_newFXPool(
    _name: string,
    _symbol: string,
    _percentFee: BigInt,
    vault: Address,
    _assetsToRegister: Array<Address>,
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "newFXPool",
      "newFXPool(string,string,uint256,address,address[]):(bytes32)",
      [
        ethereum.Value.fromString(_name),
        ethereum.Value.fromString(_symbol),
        ethereum.Value.fromUnsignedBigInt(_percentFee),
        ethereum.Value.fromAddress(vault),
        ethereum.Value.fromAddressArray(_assetsToRegister),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
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

  pools(param0: Bytes, param1: BigInt): FXPoolFactory__poolsResult {
    let result = super.call(
      "pools",
      "pools(bytes32,uint256):(address,bytes32)",
      [
        ethereum.Value.fromFixedBytes(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
      ],
    );

    return new FXPoolFactory__poolsResult(
      result[0].toAddress(),
      result[1].toBytes(),
    );
  }

  try_pools(
    param0: Bytes,
    param1: BigInt,
  ): ethereum.CallResult<FXPoolFactory__poolsResult> {
    let result = super.tryCall(
      "pools",
      "pools(bytes32,uint256):(address,bytes32)",
      [
        ethereum.Value.fromFixedBytes(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new FXPoolFactory__poolsResult(value[0].toAddress(), value[1].toBytes()),
    );
  }
}

export class NewFXPoolCall extends ethereum.Call {
  get inputs(): NewFXPoolCall__Inputs {
    return new NewFXPoolCall__Inputs(this);
  }

  get outputs(): NewFXPoolCall__Outputs {
    return new NewFXPoolCall__Outputs(this);
  }
}

export class NewFXPoolCall__Inputs {
  _call: NewFXPoolCall;

  constructor(call: NewFXPoolCall) {
    this._call = call;
  }

  get _name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _symbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _percentFee(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get vault(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _assetsToRegister(): Array<Address> {
    return this._call.inputValues[4].value.toAddressArray();
  }
}

export class NewFXPoolCall__Outputs {
  _call: NewFXPoolCall;

  constructor(call: NewFXPoolCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
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
