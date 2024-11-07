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

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get spender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class PausedStateChanged extends ethereum.Event {
  get params(): PausedStateChanged__Params {
    return new PausedStateChanged__Params(this);
  }
}

export class PausedStateChanged__Params {
  _event: PausedStateChanged;

  constructor(event: PausedStateChanged) {
    this._event = event;
  }

  get paused(): boolean {
    return this._event.parameters[0].value.toBoolean();
  }
}

export class SwapFeePercentageChanged extends ethereum.Event {
  get params(): SwapFeePercentageChanged__Params {
    return new SwapFeePercentageChanged__Params(this);
  }
}

export class SwapFeePercentageChanged__Params {
  _event: SwapFeePercentageChanged;

  constructor(event: SwapFeePercentageChanged) {
    this._event = event;
  }

  get swapFeePercentage(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class BasePool__getPausedStateResult {
  value0: boolean;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: boolean, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getPaused(): boolean {
    return this.value0;
  }

  getPauseWindowEndTime(): BigInt {
    return this.value1;
  }

  getBufferPeriodEndTime(): BigInt {
    return this.value2;
  }
}

export class BasePool__onExitPoolResult {
  value0: Array<BigInt>;
  value1: Array<BigInt>;

  constructor(value0: Array<BigInt>, value1: Array<BigInt>) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigIntArray(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigIntArray(this.value1));
    return map;
  }

  getValue0(): Array<BigInt> {
    return this.value0;
  }

  getValue1(): Array<BigInt> {
    return this.value1;
  }
}

export class BasePool__onJoinPoolResult {
  value0: Array<BigInt>;
  value1: Array<BigInt>;

  constructor(value0: Array<BigInt>, value1: Array<BigInt>) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigIntArray(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigIntArray(this.value1));
    return map;
  }

  getValue0(): Array<BigInt> {
    return this.value0;
  }

  getValue1(): Array<BigInt> {
    return this.value1;
  }
}

export class BasePool__onSwapInputRequestStruct extends ethereum.Tuple {
  get kind(): i32 {
    return this[0].toI32();
  }

  get tokenIn(): Address {
    return this[1].toAddress();
  }

  get tokenOut(): Address {
    return this[2].toAddress();
  }

  get amount(): BigInt {
    return this[3].toBigInt();
  }

  get poolId(): Bytes {
    return this[4].toBytes();
  }

  get lastChangeBlock(): BigInt {
    return this[5].toBigInt();
  }

  get from(): Address {
    return this[6].toAddress();
  }

  get to(): Address {
    return this[7].toAddress();
  }

  get userData(): Bytes {
    return this[8].toBytes();
  }
}

export class BasePool__queryExitResult {
  value0: BigInt;
  value1: Array<BigInt>;

  constructor(value0: BigInt, value1: Array<BigInt>) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigIntArray(this.value1));
    return map;
  }

  getBptIn(): BigInt {
    return this.value0;
  }

  getAmountsOut(): Array<BigInt> {
    return this.value1;
  }
}

export class BasePool__queryJoinResult {
  value0: BigInt;
  value1: Array<BigInt>;

  constructor(value0: BigInt, value1: Array<BigInt>) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigIntArray(this.value1));
    return map;
  }

  getBptOut(): BigInt {
    return this.value0;
  }

  getAmountsIn(): Array<BigInt> {
    return this.value1;
  }
}

export class BasePool extends ethereum.SmartContract {
  static bind(address: Address): BasePool {
    return new BasePool("BasePool", address);
  }

  DOMAIN_SEPARATOR(): Bytes {
    let result = super.call(
      "DOMAIN_SEPARATOR",
      "DOMAIN_SEPARATOR():(bytes32)",
      [],
    );

    return result[0].toBytes();
  }

  try_DOMAIN_SEPARATOR(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "DOMAIN_SEPARATOR",
      "DOMAIN_SEPARATOR():(bytes32)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  allowance(owner: Address, spender: Address): BigInt {
    let result = super.call(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)],
    );

    return result[0].toBigInt();
  }

  try_allowance(owner: Address, spender: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  approve(spender: Address, amount: BigInt): boolean {
    let result = super.call("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(amount),
    ]);

    return result[0].toBoolean();
  }

  try_approve(spender: Address, amount: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(amount),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  balanceOf(account: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account),
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(account: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  decimals(): i32 {
    let result = super.call("decimals", "decimals():(uint8)", []);

    return result[0].toI32();
  }

  try_decimals(): ethereum.CallResult<i32> {
    let result = super.tryCall("decimals", "decimals():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  decreaseApproval(spender: Address, amount: BigInt): boolean {
    let result = super.call(
      "decreaseApproval",
      "decreaseApproval(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );

    return result[0].toBoolean();
  }

  try_decreaseApproval(
    spender: Address,
    amount: BigInt,
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "decreaseApproval",
      "decreaseApproval(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getActionId(selector: Bytes): Bytes {
    let result = super.call("getActionId", "getActionId(bytes4):(bytes32)", [
      ethereum.Value.fromFixedBytes(selector),
    ]);

    return result[0].toBytes();
  }

  try_getActionId(selector: Bytes): ethereum.CallResult<Bytes> {
    let result = super.tryCall("getActionId", "getActionId(bytes4):(bytes32)", [
      ethereum.Value.fromFixedBytes(selector),
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
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getInvariant(): BigInt {
    let result = super.call("getInvariant", "getInvariant():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getInvariant(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getInvariant", "getInvariant():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getLastInvariant(): BigInt {
    let result = super.call(
      "getLastInvariant",
      "getLastInvariant():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getLastInvariant(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getLastInvariant",
      "getLastInvariant():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getNormalizedWeights(): Array<BigInt> {
    let result = super.call(
      "getNormalizedWeights",
      "getNormalizedWeights():(uint256[])",
      [],
    );

    return result[0].toBigIntArray();
  }

  try_getNormalizedWeights(): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "getNormalizedWeights",
      "getNormalizedWeights():(uint256[])",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  getOwner(): Address {
    let result = super.call("getOwner", "getOwner():(address)", []);

    return result[0].toAddress();
  }

  try_getOwner(): ethereum.CallResult<Address> {
    let result = super.tryCall("getOwner", "getOwner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getPausedState(): BasePool__getPausedStateResult {
    let result = super.call(
      "getPausedState",
      "getPausedState():(bool,uint256,uint256)",
      [],
    );

    return new BasePool__getPausedStateResult(
      result[0].toBoolean(),
      result[1].toBigInt(),
      result[2].toBigInt(),
    );
  }

  try_getPausedState(): ethereum.CallResult<BasePool__getPausedStateResult> {
    let result = super.tryCall(
      "getPausedState",
      "getPausedState():(bool,uint256,uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new BasePool__getPausedStateResult(
        value[0].toBoolean(),
        value[1].toBigInt(),
        value[2].toBigInt(),
      ),
    );
  }

  getPoolId(): Bytes {
    let result = super.call("getPoolId", "getPoolId():(bytes32)", []);

    return result[0].toBytes();
  }

  try_getPoolId(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("getPoolId", "getPoolId():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getRate(): BigInt {
    let result = super.call("getRate", "getRate():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getRate(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getRate", "getRate():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getSwapFeePercentage(): BigInt {
    let result = super.call(
      "getSwapFeePercentage",
      "getSwapFeePercentage():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getSwapFeePercentage(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getSwapFeePercentage",
      "getSwapFeePercentage():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
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

  increaseApproval(spender: Address, amount: BigInt): boolean {
    let result = super.call(
      "increaseApproval",
      "increaseApproval(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );

    return result[0].toBoolean();
  }

  try_increaseApproval(
    spender: Address,
    amount: BigInt,
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "increaseApproval",
      "increaseApproval(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  nonces(owner: Address): BigInt {
    let result = super.call("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(owner),
    ]);

    return result[0].toBigInt();
  }

  try_nonces(owner: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(owner),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  onExitPool(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): BasePool__onExitPoolResult {
    let result = super.call(
      "onExitPool",
      "onExitPool(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256[],uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );

    return new BasePool__onExitPoolResult(
      result[0].toBigIntArray(),
      result[1].toBigIntArray(),
    );
  }

  try_onExitPool(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): ethereum.CallResult<BasePool__onExitPoolResult> {
    let result = super.tryCall(
      "onExitPool",
      "onExitPool(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256[],uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new BasePool__onExitPoolResult(
        value[0].toBigIntArray(),
        value[1].toBigIntArray(),
      ),
    );
  }

  onJoinPool(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): BasePool__onJoinPoolResult {
    let result = super.call(
      "onJoinPool",
      "onJoinPool(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256[],uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );

    return new BasePool__onJoinPoolResult(
      result[0].toBigIntArray(),
      result[1].toBigIntArray(),
    );
  }

  try_onJoinPool(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): ethereum.CallResult<BasePool__onJoinPoolResult> {
    let result = super.tryCall(
      "onJoinPool",
      "onJoinPool(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256[],uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new BasePool__onJoinPoolResult(
        value[0].toBigIntArray(),
        value[1].toBigIntArray(),
      ),
    );
  }

  onSwap(
    request: BasePool__onSwapInputRequestStruct,
    balanceTokenIn: BigInt,
    balanceTokenOut: BigInt,
  ): BigInt {
    let result = super.call(
      "onSwap",
      "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256):(uint256)",
      [
        ethereum.Value.fromTuple(request),
        ethereum.Value.fromUnsignedBigInt(balanceTokenIn),
        ethereum.Value.fromUnsignedBigInt(balanceTokenOut),
      ],
    );

    return result[0].toBigInt();
  }

  try_onSwap(
    request: BasePool__onSwapInputRequestStruct,
    balanceTokenIn: BigInt,
    balanceTokenOut: BigInt,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "onSwap",
      "onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256):(uint256)",
      [
        ethereum.Value.fromTuple(request),
        ethereum.Value.fromUnsignedBigInt(balanceTokenIn),
        ethereum.Value.fromUnsignedBigInt(balanceTokenOut),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  queryExit(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): BasePool__queryExitResult {
    let result = super.call(
      "queryExit",
      "queryExit(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256,uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );

    return new BasePool__queryExitResult(
      result[0].toBigInt(),
      result[1].toBigIntArray(),
    );
  }

  try_queryExit(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): ethereum.CallResult<BasePool__queryExitResult> {
    let result = super.tryCall(
      "queryExit",
      "queryExit(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256,uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new BasePool__queryExitResult(
        value[0].toBigInt(),
        value[1].toBigIntArray(),
      ),
    );
  }

  queryJoin(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): BasePool__queryJoinResult {
    let result = super.call(
      "queryJoin",
      "queryJoin(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256,uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );

    return new BasePool__queryJoinResult(
      result[0].toBigInt(),
      result[1].toBigIntArray(),
    );
  }

  try_queryJoin(
    poolId: Bytes,
    sender: Address,
    recipient: Address,
    balances: Array<BigInt>,
    lastChangeBlock: BigInt,
    protocolSwapFeePercentage: BigInt,
    userData: Bytes,
  ): ethereum.CallResult<BasePool__queryJoinResult> {
    let result = super.tryCall(
      "queryJoin",
      "queryJoin(bytes32,address,address,uint256[],uint256,uint256,bytes):(uint256,uint256[])",
      [
        ethereum.Value.fromFixedBytes(poolId),
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigIntArray(balances),
        ethereum.Value.fromUnsignedBigInt(lastChangeBlock),
        ethereum.Value.fromUnsignedBigInt(protocolSwapFeePercentage),
        ethereum.Value.fromBytes(userData),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new BasePool__queryJoinResult(
        value[0].toBigInt(),
        value[1].toBigIntArray(),
      ),
    );
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  totalSupply(): BigInt {
    let result = super.call("totalSupply", "totalSupply():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalSupply", "totalSupply():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  transfer(recipient: Address, amount: BigInt): boolean {
    let result = super.call("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(recipient),
      ethereum.Value.fromUnsignedBigInt(amount),
    ]);

    return result[0].toBoolean();
  }

  try_transfer(
    recipient: Address,
    amount: BigInt,
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(recipient),
      ethereum.Value.fromUnsignedBigInt(amount),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferFrom(sender: Address, recipient: Address, amount: BigInt): boolean {
    let result = super.call(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );

    return result[0].toBoolean();
  }

  try_transferFrom(
    sender: Address,
    recipient: Address,
    amount: BigInt,
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
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

  get vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get name(): string {
    return this._call.inputValues[1].value.toString();
  }

  get symbol(): string {
    return this._call.inputValues[2].value.toString();
  }

  get tokens(): Array<Address> {
    return this._call.inputValues[3].value.toAddressArray();
  }

  get normalizedWeights(): Array<BigInt> {
    return this._call.inputValues[4].value.toBigIntArray();
  }

  get swapFeePercentage(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get pauseWindowDuration(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get bufferPeriodDuration(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }

  get owner(): Address {
    return this._call.inputValues[8].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class DecreaseApprovalCall extends ethereum.Call {
  get inputs(): DecreaseApprovalCall__Inputs {
    return new DecreaseApprovalCall__Inputs(this);
  }

  get outputs(): DecreaseApprovalCall__Outputs {
    return new DecreaseApprovalCall__Outputs(this);
  }
}

export class DecreaseApprovalCall__Inputs {
  _call: DecreaseApprovalCall;

  constructor(call: DecreaseApprovalCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DecreaseApprovalCall__Outputs {
  _call: DecreaseApprovalCall;

  constructor(call: DecreaseApprovalCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class IncreaseApprovalCall extends ethereum.Call {
  get inputs(): IncreaseApprovalCall__Inputs {
    return new IncreaseApprovalCall__Inputs(this);
  }

  get outputs(): IncreaseApprovalCall__Outputs {
    return new IncreaseApprovalCall__Outputs(this);
  }
}

export class IncreaseApprovalCall__Inputs {
  _call: IncreaseApprovalCall;

  constructor(call: IncreaseApprovalCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class IncreaseApprovalCall__Outputs {
  _call: IncreaseApprovalCall;

  constructor(call: IncreaseApprovalCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class OnExitPoolCall extends ethereum.Call {
  get inputs(): OnExitPoolCall__Inputs {
    return new OnExitPoolCall__Inputs(this);
  }

  get outputs(): OnExitPoolCall__Outputs {
    return new OnExitPoolCall__Outputs(this);
  }
}

export class OnExitPoolCall__Inputs {
  _call: OnExitPoolCall;

  constructor(call: OnExitPoolCall) {
    this._call = call;
  }

  get poolId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get sender(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get balances(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get lastChangeBlock(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get protocolSwapFeePercentage(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get userData(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }
}

export class OnExitPoolCall__Outputs {
  _call: OnExitPoolCall;

  constructor(call: OnExitPoolCall) {
    this._call = call;
  }

  get value0(): Array<BigInt> {
    return this._call.outputValues[0].value.toBigIntArray();
  }

  get value1(): Array<BigInt> {
    return this._call.outputValues[1].value.toBigIntArray();
  }
}

export class OnJoinPoolCall extends ethereum.Call {
  get inputs(): OnJoinPoolCall__Inputs {
    return new OnJoinPoolCall__Inputs(this);
  }

  get outputs(): OnJoinPoolCall__Outputs {
    return new OnJoinPoolCall__Outputs(this);
  }
}

export class OnJoinPoolCall__Inputs {
  _call: OnJoinPoolCall;

  constructor(call: OnJoinPoolCall) {
    this._call = call;
  }

  get poolId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get sender(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get balances(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get lastChangeBlock(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get protocolSwapFeePercentage(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get userData(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }
}

export class OnJoinPoolCall__Outputs {
  _call: OnJoinPoolCall;

  constructor(call: OnJoinPoolCall) {
    this._call = call;
  }

  get value0(): Array<BigInt> {
    return this._call.outputValues[0].value.toBigIntArray();
  }

  get value1(): Array<BigInt> {
    return this._call.outputValues[1].value.toBigIntArray();
  }
}

export class PermitCall extends ethereum.Call {
  get inputs(): PermitCall__Inputs {
    return new PermitCall__Inputs(this);
  }

  get outputs(): PermitCall__Outputs {
    return new PermitCall__Outputs(this);
  }
}

export class PermitCall__Inputs {
  _call: PermitCall;

  constructor(call: PermitCall) {
    this._call = call;
  }

  get owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get spender(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get deadline(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get v(): i32 {
    return this._call.inputValues[4].value.toI32();
  }

  get r(): Bytes {
    return this._call.inputValues[5].value.toBytes();
  }

  get s(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }
}

export class PermitCall__Outputs {
  _call: PermitCall;

  constructor(call: PermitCall) {
    this._call = call;
  }
}

export class SetPausedCall extends ethereum.Call {
  get inputs(): SetPausedCall__Inputs {
    return new SetPausedCall__Inputs(this);
  }

  get outputs(): SetPausedCall__Outputs {
    return new SetPausedCall__Outputs(this);
  }
}

export class SetPausedCall__Inputs {
  _call: SetPausedCall;

  constructor(call: SetPausedCall) {
    this._call = call;
  }

  get paused(): boolean {
    return this._call.inputValues[0].value.toBoolean();
  }
}

export class SetPausedCall__Outputs {
  _call: SetPausedCall;

  constructor(call: SetPausedCall) {
    this._call = call;
  }
}

export class SetSwapFeePercentageCall extends ethereum.Call {
  get inputs(): SetSwapFeePercentageCall__Inputs {
    return new SetSwapFeePercentageCall__Inputs(this);
  }

  get outputs(): SetSwapFeePercentageCall__Outputs {
    return new SetSwapFeePercentageCall__Outputs(this);
  }
}

export class SetSwapFeePercentageCall__Inputs {
  _call: SetSwapFeePercentageCall;

  constructor(call: SetSwapFeePercentageCall) {
    this._call = call;
  }

  get swapFeePercentage(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetSwapFeePercentageCall__Outputs {
  _call: SetSwapFeePercentageCall;

  constructor(call: SetSwapFeePercentageCall) {
    this._call = call;
  }
}

export class TransferCall extends ethereum.Call {
  get inputs(): TransferCall__Inputs {
    return new TransferCall__Inputs(this);
  }

  get outputs(): TransferCall__Outputs {
    return new TransferCall__Outputs(this);
  }
}

export class TransferCall__Inputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get recipient(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class TransferCall__Outputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get sender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}
