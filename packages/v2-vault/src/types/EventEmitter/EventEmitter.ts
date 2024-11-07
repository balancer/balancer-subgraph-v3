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

export class AuthorizationGranted extends ethereum.Event {
  get params(): AuthorizationGranted__Params {
    return new AuthorizationGranted__Params(this);
  }
}

export class AuthorizationGranted__Params {
  _event: AuthorizationGranted;

  constructor(event: AuthorizationGranted) {
    this._event = event;
  }

  get addr(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get identifier(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class AuthorizationRevoked extends ethereum.Event {
  get params(): AuthorizationRevoked__Params {
    return new AuthorizationRevoked__Params(this);
  }
}

export class AuthorizationRevoked__Params {
  _event: AuthorizationRevoked;

  constructor(event: AuthorizationRevoked) {
    this._event = event;
  }

  get addr(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get identifier(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class LogArgument extends ethereum.Event {
  get params(): LogArgument__Params {
    return new LogArgument__Params(this);
  }
}

export class LogArgument__Params {
  _event: LogArgument;

  constructor(event: LogArgument) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get identifier(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get message(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get value(): BigInt {
    return this._event.parameters[3].value.toBigInt();
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

  get newOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class EventEmitter extends ethereum.SmartContract {
  static bind(address: Address): EventEmitter {
    return new EventEmitter("EventEmitter", address);
  }

  isAuthorized(param0: Address, param1: Bytes): boolean {
    let result = super.call(
      "isAuthorized",
      "isAuthorized(address,bytes32):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromFixedBytes(param1),
      ],
    );

    return result[0].toBoolean();
  }

  try_isAuthorized(
    param0: Address,
    param1: Bytes,
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAuthorized",
      "isAuthorized(address,bytes32):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromFixedBytes(param1),
      ],
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

  get identifier(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get addr(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class AuthorizeCall__Outputs {
  _call: AuthorizeCall;

  constructor(call: AuthorizeCall) {
    this._call = call;
  }
}

export class EmitEventCall extends ethereum.Call {
  get inputs(): EmitEventCall__Inputs {
    return new EmitEventCall__Inputs(this);
  }

  get outputs(): EmitEventCall__Outputs {
    return new EmitEventCall__Outputs(this);
  }
}

export class EmitEventCall__Inputs {
  _call: EmitEventCall;

  constructor(call: EmitEventCall) {
    this._call = call;
  }

  get identifier(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get message(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get value(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class EmitEventCall__Outputs {
  _call: EmitEventCall;

  constructor(call: EmitEventCall) {
    this._call = call;
  }
}

export class RemoveAuthorizationCall extends ethereum.Call {
  get inputs(): RemoveAuthorizationCall__Inputs {
    return new RemoveAuthorizationCall__Inputs(this);
  }

  get outputs(): RemoveAuthorizationCall__Outputs {
    return new RemoveAuthorizationCall__Outputs(this);
  }
}

export class RemoveAuthorizationCall__Inputs {
  _call: RemoveAuthorizationCall;

  constructor(call: RemoveAuthorizationCall) {
    this._call = call;
  }

  get identifier(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get addr(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RemoveAuthorizationCall__Outputs {
  _call: RemoveAuthorizationCall;

  constructor(call: RemoveAuthorizationCall) {
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
