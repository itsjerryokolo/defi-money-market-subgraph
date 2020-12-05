// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class dmgApproval extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save dmgApproval entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save dmgApproval entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("dmgApproval", id.toString(), this);
  }

  static load(id: string): dmgApproval | null {
    return store.get("dmgApproval", id) as dmgApproval | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get amountApproved(): BigInt {
    let value = this.get("amountApproved");
    return value.toBigInt();
  }

  set amountApproved(value: BigInt) {
    this.set("amountApproved", Value.fromBigInt(value));
  }

  get ownerAddress(): Bytes {
    let value = this.get("ownerAddress");
    return value.toBytes();
  }

  set ownerAddress(value: Bytes) {
    this.set("ownerAddress", Value.fromBytes(value));
  }

  get spenderAddress(): Bytes {
    let value = this.get("spenderAddress");
    return value.toBytes();
  }

  set spenderAddress(value: Bytes) {
    this.set("spenderAddress", Value.fromBytes(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class dmgTransfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save dmgTransfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save dmgTransfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("dmgTransfer", id.toString(), this);
  }

  static load(id: string): dmgTransfer | null {
    return store.get("dmgTransfer", id) as dmgTransfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get transferedFrom(): Bytes {
    let value = this.get("transferedFrom");
    return value.toBytes();
  }

  set transferedFrom(value: Bytes) {
    this.set("transferedFrom", Value.fromBytes(value));
  }

  get transferedTo(): Bytes {
    let value = this.get("transferedTo");
    return value.toBytes();
  }

  set transferedTo(value: Bytes) {
    this.set("transferedTo", Value.fromBytes(value));
  }

  get amountTransfered(): BigInt {
    let value = this.get("amountTransfered");
    return value.toBigInt();
  }

  set amountTransfered(value: BigInt) {
    this.set("amountTransfered", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mDaiMint extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mDaiMint entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mDaiMint entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mDaiMint", id.toString(), this);
  }

  static load(id: string): mDaiMint | null {
    return store.get("mDaiMint", id) as mDaiMint | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get minterAddress(): Bytes {
    let value = this.get("minterAddress");
    return value.toBytes();
  }

  set minterAddress(value: Bytes) {
    this.set("minterAddress", Value.fromBytes(value));
  }

  get recipientAddress(): Bytes {
    let value = this.get("recipientAddress");
    return value.toBytes();
  }

  set recipientAddress(value: Bytes) {
    this.set("recipientAddress", Value.fromBytes(value));
  }

  get amountMinted(): BigInt {
    let value = this.get("amountMinted");
    return value.toBigInt();
  }

  set amountMinted(value: BigInt) {
    this.set("amountMinted", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mDaiRedeem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mDaiRedeem entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mDaiRedeem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mDaiRedeem", id.toString(), this);
  }

  static load(id: string): mDaiRedeem | null {
    return store.get("mDaiRedeem", id) as mDaiRedeem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get redeemerAddress(): Bytes {
    let value = this.get("redeemerAddress");
    return value.toBytes();
  }

  set redeemerAddress(value: Bytes) {
    this.set("redeemerAddress", Value.fromBytes(value));
  }

  get recipientAddress(): Bytes {
    let value = this.get("recipientAddress");
    return value.toBytes();
  }

  set recipientAddress(value: Bytes) {
    this.set("recipientAddress", Value.fromBytes(value));
  }

  get amountRedeemed(): BigInt {
    let value = this.get("amountRedeemed");
    return value.toBigInt();
  }

  set amountRedeemed(value: BigInt) {
    this.set("amountRedeemed", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mDaiTransfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mDaiTransfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mDaiTransfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mDaiTransfer", id.toString(), this);
  }

  static load(id: string): mDaiTransfer | null {
    return store.get("mDaiTransfer", id) as mDaiTransfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get transferedFrom(): Bytes {
    let value = this.get("transferedFrom");
    return value.toBytes();
  }

  set transferedFrom(value: Bytes) {
    this.set("transferedFrom", Value.fromBytes(value));
  }

  get transferedTo(): Bytes {
    let value = this.get("transferedTo");
    return value.toBytes();
  }

  set transferedTo(value: Bytes) {
    this.set("transferedTo", Value.fromBytes(value));
  }

  get amountTransfered(): BigInt {
    let value = this.get("amountTransfered");
    return value.toBigInt();
  }

  set amountTransfered(value: BigInt) {
    this.set("amountTransfered", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mUSDCMint extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mUSDCMint entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mUSDCMint entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mUSDCMint", id.toString(), this);
  }

  static load(id: string): mUSDCMint | null {
    return store.get("mUSDCMint", id) as mUSDCMint | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get minterAddress(): Bytes {
    let value = this.get("minterAddress");
    return value.toBytes();
  }

  set minterAddress(value: Bytes) {
    this.set("minterAddress", Value.fromBytes(value));
  }

  get recipientAddress(): Bytes {
    let value = this.get("recipientAddress");
    return value.toBytes();
  }

  set recipientAddress(value: Bytes) {
    this.set("recipientAddress", Value.fromBytes(value));
  }

  get amountMinted(): BigInt {
    let value = this.get("amountMinted");
    return value.toBigInt();
  }

  set amountMinted(value: BigInt) {
    this.set("amountMinted", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mUSDCRedeem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mUSDCRedeem entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mUSDCRedeem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mUSDCRedeem", id.toString(), this);
  }

  static load(id: string): mUSDCRedeem | null {
    return store.get("mUSDCRedeem", id) as mUSDCRedeem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get redeemerAddress(): Bytes {
    let value = this.get("redeemerAddress");
    return value.toBytes();
  }

  set redeemerAddress(value: Bytes) {
    this.set("redeemerAddress", Value.fromBytes(value));
  }

  get recipientAddress(): Bytes {
    let value = this.get("recipientAddress");
    return value.toBytes();
  }

  set recipientAddress(value: Bytes) {
    this.set("recipientAddress", Value.fromBytes(value));
  }

  get amountRedeemed(): BigInt {
    let value = this.get("amountRedeemed");
    return value.toBigInt();
  }

  set amountRedeemed(value: BigInt) {
    this.set("amountRedeemed", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mUSDCTransfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mUSDCTransfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mUSDCTransfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mUSDCTransfer", id.toString(), this);
  }

  static load(id: string): mUSDCTransfer | null {
    return store.get("mUSDCTransfer", id) as mUSDCTransfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get transferedFrom(): Bytes {
    let value = this.get("transferedFrom");
    return value.toBytes();
  }

  set transferedFrom(value: Bytes) {
    this.set("transferedFrom", Value.fromBytes(value));
  }

  get transferedTo(): Bytes {
    let value = this.get("transferedTo");
    return value.toBytes();
  }

  set transferedTo(value: Bytes) {
    this.set("transferedTo", Value.fromBytes(value));
  }

  get amountTransfered(): BigInt {
    let value = this.get("amountTransfered");
    return value.toBigInt();
  }

  set amountTransfered(value: BigInt) {
    this.set("amountTransfered", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mETHMint extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mETHMint entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mETHMint entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mETHMint", id.toString(), this);
  }

  static load(id: string): mETHMint | null {
    return store.get("mETHMint", id) as mETHMint | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get minterAddress(): Bytes {
    let value = this.get("minterAddress");
    return value.toBytes();
  }

  set minterAddress(value: Bytes) {
    this.set("minterAddress", Value.fromBytes(value));
  }

  get recipientAddress(): Bytes {
    let value = this.get("recipientAddress");
    return value.toBytes();
  }

  set recipientAddress(value: Bytes) {
    this.set("recipientAddress", Value.fromBytes(value));
  }

  get amountMinted(): BigInt {
    let value = this.get("amountMinted");
    return value.toBigInt();
  }

  set amountMinted(value: BigInt) {
    this.set("amountMinted", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mETHRedeem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mETHRedeem entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mETHRedeem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mETHRedeem", id.toString(), this);
  }

  static load(id: string): mETHRedeem | null {
    return store.get("mETHRedeem", id) as mETHRedeem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get redeemerAddress(): Bytes {
    let value = this.get("redeemerAddress");
    return value.toBytes();
  }

  set redeemerAddress(value: Bytes) {
    this.set("redeemerAddress", Value.fromBytes(value));
  }

  get recipientAddress(): Bytes {
    let value = this.get("recipientAddress");
    return value.toBytes();
  }

  set recipientAddress(value: Bytes) {
    this.set("recipientAddress", Value.fromBytes(value));
  }

  get amountRedeemed(): BigInt {
    let value = this.get("amountRedeemed");
    return value.toBigInt();
  }

  set amountRedeemed(value: BigInt) {
    this.set("amountRedeemed", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}

export class mETHTransfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save mETHTransfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save mETHTransfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("mETHTransfer", id.toString(), this);
  }

  static load(id: string): mETHTransfer | null {
    return store.get("mETHTransfer", id) as mETHTransfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get transferedFrom(): Bytes {
    let value = this.get("transferedFrom");
    return value.toBytes();
  }

  set transferedFrom(value: Bytes) {
    this.set("transferedFrom", Value.fromBytes(value));
  }

  get transferedTo(): Bytes {
    let value = this.get("transferedTo");
    return value.toBytes();
  }

  set transferedTo(value: Bytes) {
    this.set("transferedTo", Value.fromBytes(value));
  }

  get amountTransfered(): BigInt {
    let value = this.get("amountTransfered");
    return value.toBigInt();
  }

  set amountTransfered(value: BigInt) {
    this.set("amountTransfered", Value.fromBigInt(value));
  }

  get transactionDate(): BigInt {
    let value = this.get("transactionDate");
    return value.toBigInt();
  }

  set transactionDate(value: BigInt) {
    this.set("transactionDate", Value.fromBigInt(value));
  }

  get transactionBlock(): BigInt {
    let value = this.get("transactionBlock");
    return value.toBigInt();
  }

  set transactionBlock(value: BigInt) {
    this.set("transactionBlock", Value.fromBigInt(value));
  }
}
