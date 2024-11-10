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

export class EIP712DomainChanged extends ethereum.Event {
  get params(): EIP712DomainChanged__Params {
    return new EIP712DomainChanged__Params(this);
  }
}

export class EIP712DomainChanged__Params {
  _event: EIP712DomainChanged;

  constructor(event: EIP712DomainChanged) {
    this._event = event;
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

export class WeightedPool__eip712DomainResult {
  value0: Bytes;
  value1: string;
  value2: string;
  value3: BigInt;
  value4: Address;
  value5: Bytes;
  value6: Array<BigInt>;

  constructor(
    value0: Bytes,
    value1: string,
    value2: string,
    value3: BigInt,
    value4: Address,
    value5: Bytes,
    value6: Array<BigInt>,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromFixedBytes(this.value0));
    map.set("value1", ethereum.Value.fromString(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    map.set("value5", ethereum.Value.fromFixedBytes(this.value5));
    map.set("value6", ethereum.Value.fromUnsignedBigIntArray(this.value6));
    return map;
  }

  getFields(): Bytes {
    return this.value0;
  }

  getName(): string {
    return this.value1;
  }

  getVersion(): string {
    return this.value2;
  }

  getChainId(): BigInt {
    return this.value3;
  }

  getVerifyingContract(): Address {
    return this.value4;
  }

  getSalt(): Bytes {
    return this.value5;
  }

  getExtensions(): Array<BigInt> {
    return this.value6;
  }
}

export class WeightedPool__getTokenInfoResultTokenInfoStruct extends ethereum.Tuple {
  get tokenType(): i32 {
    return this[0].toI32();
  }

  get rateProvider(): Address {
    return this[1].toAddress();
  }

  get paysYieldFees(): boolean {
    return this[2].toBoolean();
  }
}

export class WeightedPool__getTokenInfoResult {
  value0: Array<Address>;
  value1: Array<WeightedPool__getTokenInfoResultTokenInfoStruct>;
  value2: Array<BigInt>;
  value3: Array<BigInt>;

  constructor(
    value0: Array<Address>,
    value1: Array<WeightedPool__getTokenInfoResultTokenInfoStruct>,
    value2: Array<BigInt>,
    value3: Array<BigInt>,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddressArray(this.value0));
    map.set("value1", ethereum.Value.fromTupleArray(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigIntArray(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigIntArray(this.value3));
    return map;
  }

  getTokens(): Array<Address> {
    return this.value0;
  }

  getTokenInfo(): Array<WeightedPool__getTokenInfoResultTokenInfoStruct> {
    return this.value1;
  }

  getBalancesRaw(): Array<BigInt> {
    return this.value2;
  }

  getLastLiveBalances(): Array<BigInt> {
    return this.value3;
  }
}

export class WeightedPool__onSwapInputRequestStruct extends ethereum.Tuple {
  get kind(): i32 {
    return this[0].toI32();
  }

  get amountGivenScaled18(): BigInt {
    return this[1].toBigInt();
  }

  get balancesScaled18(): Array<BigInt> {
    return this[2].toBigIntArray();
  }

  get indexIn(): BigInt {
    return this[3].toBigInt();
  }

  get indexOut(): BigInt {
    return this[4].toBigInt();
  }

  get router(): Address {
    return this[5].toAddress();
  }

  get userData(): Bytes {
    return this[6].toBytes();
  }
}

export class WeightedPool extends ethereum.SmartContract {
  static bind(address: Address): WeightedPool {
    return new WeightedPool("WeightedPool", address);
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

  PERMIT_TYPEHASH(): Bytes {
    let result = super.call(
      "PERMIT_TYPEHASH",
      "PERMIT_TYPEHASH():(bytes32)",
      [],
    );

    return result[0].toBytes();
  }

  try_PERMIT_TYPEHASH(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "PERMIT_TYPEHASH",
      "PERMIT_TYPEHASH():(bytes32)",
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

  computeBalance(
    balancesLiveScaled18: Array<BigInt>,
    tokenInIndex: BigInt,
    invariantRatio: BigInt,
  ): BigInt {
    let result = super.call(
      "computeBalance",
      "computeBalance(uint256[],uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigIntArray(balancesLiveScaled18),
        ethereum.Value.fromUnsignedBigInt(tokenInIndex),
        ethereum.Value.fromUnsignedBigInt(invariantRatio),
      ],
    );

    return result[0].toBigInt();
  }

  try_computeBalance(
    balancesLiveScaled18: Array<BigInt>,
    tokenInIndex: BigInt,
    invariantRatio: BigInt,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "computeBalance",
      "computeBalance(uint256[],uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigIntArray(balancesLiveScaled18),
        ethereum.Value.fromUnsignedBigInt(tokenInIndex),
        ethereum.Value.fromUnsignedBigInt(invariantRatio),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  computeInvariant(balancesLiveScaled18: Array<BigInt>): BigInt {
    let result = super.call(
      "computeInvariant",
      "computeInvariant(uint256[]):(uint256)",
      [ethereum.Value.fromUnsignedBigIntArray(balancesLiveScaled18)],
    );

    return result[0].toBigInt();
  }

  try_computeInvariant(
    balancesLiveScaled18: Array<BigInt>,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "computeInvariant",
      "computeInvariant(uint256[]):(uint256)",
      [ethereum.Value.fromUnsignedBigIntArray(balancesLiveScaled18)],
    );
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

  eip712Domain(): WeightedPool__eip712DomainResult {
    let result = super.call(
      "eip712Domain",
      "eip712Domain():(bytes1,string,string,uint256,address,bytes32,uint256[])",
      [],
    );

    return new WeightedPool__eip712DomainResult(
      result[0].toBytes(),
      result[1].toString(),
      result[2].toString(),
      result[3].toBigInt(),
      result[4].toAddress(),
      result[5].toBytes(),
      result[6].toBigIntArray(),
    );
  }

  try_eip712Domain(): ethereum.CallResult<WeightedPool__eip712DomainResult> {
    let result = super.tryCall(
      "eip712Domain",
      "eip712Domain():(bytes1,string,string,uint256,address,bytes32,uint256[])",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WeightedPool__eip712DomainResult(
        value[0].toBytes(),
        value[1].toString(),
        value[2].toString(),
        value[3].toBigInt(),
        value[4].toAddress(),
        value[5].toBytes(),
        value[6].toBigIntArray(),
      ),
    );
  }

  getCurrentLiveBalances(): Array<BigInt> {
    let result = super.call(
      "getCurrentLiveBalances",
      "getCurrentLiveBalances():(uint256[])",
      [],
    );

    return result[0].toBigIntArray();
  }

  try_getCurrentLiveBalances(): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "getCurrentLiveBalances",
      "getCurrentLiveBalances():(uint256[])",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  getMaximumSwapFeePercentage(): BigInt {
    let result = super.call(
      "getMaximumSwapFeePercentage",
      "getMaximumSwapFeePercentage():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getMaximumSwapFeePercentage(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getMaximumSwapFeePercentage",
      "getMaximumSwapFeePercentage():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getMinimumSwapFeePercentage(): BigInt {
    let result = super.call(
      "getMinimumSwapFeePercentage",
      "getMinimumSwapFeePercentage():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getMinimumSwapFeePercentage(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getMinimumSwapFeePercentage",
      "getMinimumSwapFeePercentage():(uint256)",
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

  getStaticSwapFeePercentage(): BigInt {
    let result = super.call(
      "getStaticSwapFeePercentage",
      "getStaticSwapFeePercentage():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getStaticSwapFeePercentage(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getStaticSwapFeePercentage",
      "getStaticSwapFeePercentage():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTokenInfo(): WeightedPool__getTokenInfoResult {
    let result = super.call(
      "getTokenInfo",
      "getTokenInfo():(address[],(uint8,address,bool)[],uint256[],uint256[])",
      [],
    );

    return new WeightedPool__getTokenInfoResult(
      result[0].toAddressArray(),
      result[1].toTupleArray<WeightedPool__getTokenInfoResultTokenInfoStruct>(),
      result[2].toBigIntArray(),
      result[3].toBigIntArray(),
    );
  }

  try_getTokenInfo(): ethereum.CallResult<WeightedPool__getTokenInfoResult> {
    let result = super.tryCall(
      "getTokenInfo",
      "getTokenInfo():(address[],(uint8,address,bool)[],uint256[],uint256[])",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WeightedPool__getTokenInfoResult(
        value[0].toAddressArray(),
        value[1].toTupleArray<WeightedPool__getTokenInfoResultTokenInfoStruct>(),
        value[2].toBigIntArray(),
        value[3].toBigIntArray(),
      ),
    );
  }

  getTokens(): Array<Address> {
    let result = super.call("getTokens", "getTokens():(address[])", []);

    return result[0].toAddressArray();
  }

  try_getTokens(): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall("getTokens", "getTokens():(address[])", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
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

  onSwap(request: WeightedPool__onSwapInputRequestStruct): BigInt {
    let result = super.call(
      "onSwap",
      "onSwap((uint8,uint256,uint256[],uint256,uint256,address,bytes)):(uint256)",
      [ethereum.Value.fromTuple(request)],
    );

    return result[0].toBigInt();
  }

  try_onSwap(
    request: WeightedPool__onSwapInputRequestStruct,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "onSwap",
      "onSwap((uint8,uint256,uint256[],uint256,uint256,address,bytes)):(uint256)",
      [ethereum.Value.fromTuple(request)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)],
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
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

  transfer(to: Address, amount: BigInt): boolean {
    let result = super.call("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(to),
      ethereum.Value.fromUnsignedBigInt(amount),
    ]);

    return result[0].toBoolean();
  }

  try_transfer(to: Address, amount: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(to),
      ethereum.Value.fromUnsignedBigInt(amount),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferFrom(from: Address, to: Address, amount: BigInt): boolean {
    let result = super.call(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromAddress(to),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );

    return result[0].toBoolean();
  }

  try_transferFrom(
    from: Address,
    to: Address,
    amount: BigInt,
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromAddress(to),
        ethereum.Value.fromUnsignedBigInt(amount),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  version(): string {
    let result = super.call("version", "version():(string)", []);

    return result[0].toString();
  }

  try_version(): ethereum.CallResult<string> {
    let result = super.tryCall("version", "version():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
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

  get params(): ConstructorCallParamsStruct {
    return changetype<ConstructorCallParamsStruct>(
      this._call.inputValues[0].value.toTuple(),
    );
  }

  get vault(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCallParamsStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get symbol(): string {
    return this[1].toString();
  }

  get numTokens(): BigInt {
    return this[2].toBigInt();
  }

  get normalizedWeights(): Array<BigInt> {
    return this[3].toBigIntArray();
  }

  get version(): string {
    return this[4].toString();
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

export class EmitApprovalCall extends ethereum.Call {
  get inputs(): EmitApprovalCall__Inputs {
    return new EmitApprovalCall__Inputs(this);
  }

  get outputs(): EmitApprovalCall__Outputs {
    return new EmitApprovalCall__Outputs(this);
  }
}

export class EmitApprovalCall__Inputs {
  _call: EmitApprovalCall;

  constructor(call: EmitApprovalCall) {
    this._call = call;
  }

  get owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get spender(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class EmitApprovalCall__Outputs {
  _call: EmitApprovalCall;

  constructor(call: EmitApprovalCall) {
    this._call = call;
  }
}

export class EmitTransferCall extends ethereum.Call {
  get inputs(): EmitTransferCall__Inputs {
    return new EmitTransferCall__Inputs(this);
  }

  get outputs(): EmitTransferCall__Outputs {
    return new EmitTransferCall__Outputs(this);
  }
}

export class EmitTransferCall__Inputs {
  _call: EmitTransferCall;

  constructor(call: EmitTransferCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class EmitTransferCall__Outputs {
  _call: EmitTransferCall;

  constructor(call: EmitTransferCall) {
    this._call = call;
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

  get amount(): BigInt {
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

  get to(): Address {
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

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
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
