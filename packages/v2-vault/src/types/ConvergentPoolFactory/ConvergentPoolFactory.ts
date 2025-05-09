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

export class CCPoolCreated extends ethereum.Event {
  get params(): CCPoolCreated__Params {
    return new CCPoolCreated__Params(this);
  }
}

export class CCPoolCreated__Params {
  _event: CCPoolCreated;

  constructor(event: CCPoolCreated) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get bondToken(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PoolCreated extends ethereum.Event {
  get params(): PoolCreated__Params {
    return new PoolCreated__Params(this);
  }
}

export class PoolCreated__Params {
  _event: PoolCreated;

  constructor(event: PoolCreated) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class ConvergentPoolFactory extends ethereum.SmartContract {
  static bind(address: Address): ConvergentPoolFactory {
    return new ConvergentPoolFactory("ConvergentPoolFactory", address);
  }

  authorized(param0: Address): boolean {
    let result = super.call("authorized", "authorized(address):(bool)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toBoolean();
  }

  try_authorized(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("authorized", "authorized(address):(bool)", [
      ethereum.Value.fromAddress(param0),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  create(
    _underlying: Address,
    _bond: Address,
    _expiration: BigInt,
    _unitSeconds: BigInt,
    _percentFee: BigInt,
    _name: string,
    _symbol: string,
  ): Address {
    let result = super.call(
      "create",
      "create(address,address,uint256,uint256,uint256,string,string):(address)",
      [
        ethereum.Value.fromAddress(_underlying),
        ethereum.Value.fromAddress(_bond),
        ethereum.Value.fromUnsignedBigInt(_expiration),
        ethereum.Value.fromUnsignedBigInt(_unitSeconds),
        ethereum.Value.fromUnsignedBigInt(_percentFee),
        ethereum.Value.fromString(_name),
        ethereum.Value.fromString(_symbol),
      ],
    );

    return result[0].toAddress();
  }

  try_create(
    _underlying: Address,
    _bond: Address,
    _expiration: BigInt,
    _unitSeconds: BigInt,
    _percentFee: BigInt,
    _name: string,
    _symbol: string,
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "create",
      "create(address,address,uint256,uint256,uint256,string,string):(address)",
      [
        ethereum.Value.fromAddress(_underlying),
        ethereum.Value.fromAddress(_bond),
        ethereum.Value.fromUnsignedBigInt(_expiration),
        ethereum.Value.fromUnsignedBigInt(_unitSeconds),
        ethereum.Value.fromUnsignedBigInt(_percentFee),
        ethereum.Value.fromString(_name),
        ethereum.Value.fromString(_symbol),
      ],
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

  governance(): Address {
    let result = super.call("governance", "governance():(address)", []);

    return result[0].toAddress();
  }

  try_governance(): ethereum.CallResult<Address> {
    let result = super.tryCall("governance", "governance():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isAuthorized(who: Address): boolean {
    let result = super.call("isAuthorized", "isAuthorized(address):(bool)", [
      ethereum.Value.fromAddress(who),
    ]);

    return result[0].toBoolean();
  }

  try_isAuthorized(who: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isAuthorized", "isAuthorized(address):(bool)", [
      ethereum.Value.fromAddress(who),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isPoolFromFactory(pool: Address): boolean {
    let result = super.call(
      "isPoolFromFactory",
      "isPoolFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(pool)],
    );

    return result[0].toBoolean();
  }

  try_isPoolFromFactory(pool: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isPoolFromFactory",
      "isPoolFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(pool)],
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

  percentFeeGov(): BigInt {
    let result = super.call("percentFeeGov", "percentFeeGov():(uint256)", []);

    return result[0].toBigInt();
  }

  try_percentFeeGov(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "percentFeeGov",
      "percentFeeGov():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
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

  get _vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _governance(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AuthorizeCall extends ethereum.Call {
  get inputs(): AuthorizeCall__Inputs {
    return new AuthorizeCall__Inputs(this);
  }

  get outputs(): AuthorizeCall__Outputs {
    return new AuthorizeCall__Outputs(this);
  }
}

export class AuthorizeCall__Inputs {
  _call: AuthorizeCall;

  constructor(call: AuthorizeCall) {
    this._call = call;
  }

  get who(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AuthorizeCall__Outputs {
  _call: AuthorizeCall;

  constructor(call: AuthorizeCall) {
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

  get _underlying(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _bond(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _expiration(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _unitSeconds(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _percentFee(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _name(): string {
    return this._call.inputValues[5].value.toString();
  }

  get _symbol(): string {
    return this._call.inputValues[6].value.toString();
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

export class DeauthorizeCall extends ethereum.Call {
  get inputs(): DeauthorizeCall__Inputs {
    return new DeauthorizeCall__Inputs(this);
  }

  get outputs(): DeauthorizeCall__Outputs {
    return new DeauthorizeCall__Outputs(this);
  }
}

export class DeauthorizeCall__Inputs {
  _call: DeauthorizeCall;

  constructor(call: DeauthorizeCall) {
    this._call = call;
  }

  get who(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class DeauthorizeCall__Outputs {
  _call: DeauthorizeCall;

  constructor(call: DeauthorizeCall) {
    this._call = call;
  }
}

export class SetGovCall extends ethereum.Call {
  get inputs(): SetGovCall__Inputs {
    return new SetGovCall__Inputs(this);
  }

  get outputs(): SetGovCall__Outputs {
    return new SetGovCall__Outputs(this);
  }
}

export class SetGovCall__Inputs {
  _call: SetGovCall;

  constructor(call: SetGovCall) {
    this._call = call;
  }

  get newGov(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetGovCall__Outputs {
  _call: SetGovCall;

  constructor(call: SetGovCall) {
    this._call = call;
  }
}

export class SetGovFeeCall extends ethereum.Call {
  get inputs(): SetGovFeeCall__Inputs {
    return new SetGovFeeCall__Inputs(this);
  }

  get outputs(): SetGovFeeCall__Outputs {
    return new SetGovFeeCall__Outputs(this);
  }
}

export class SetGovFeeCall__Inputs {
  _call: SetGovFeeCall;

  constructor(call: SetGovFeeCall) {
    this._call = call;
  }

  get newFee(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetGovFeeCall__Outputs {
  _call: SetGovFeeCall;

  constructor(call: SetGovFeeCall) {
    this._call = call;
  }
}

export class SetOwnerCall extends ethereum.Call {
  get inputs(): SetOwnerCall__Inputs {
    return new SetOwnerCall__Inputs(this);
  }

  get outputs(): SetOwnerCall__Outputs {
    return new SetOwnerCall__Outputs(this);
  }
}

export class SetOwnerCall__Inputs {
  _call: SetOwnerCall;

  constructor(call: SetOwnerCall) {
    this._call = call;
  }

  get who(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetOwnerCall__Outputs {
  _call: SetOwnerCall;

  constructor(call: SetOwnerCall) {
    this._call = call;
  }
}
