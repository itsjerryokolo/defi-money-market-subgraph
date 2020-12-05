import { BigInt, Address, Bytes, log, BigDecimal } from "@graphprotocol/graph-ts"
import {
  DMMToken,
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  Transfer
} from "../generated/DMMToken/DMMToken"
import {
  mDai,
  Mint,
  Redeem
} from "../generated/mDai/mDai"
import {
  mUSDC,
  Mint,
  Redeem
} from "../generated/mUSDC/mUSDC"


import { dmgApproval, dmgTrade,  } from "../generated/schema"
import {mDaiMint, mDaiRedeem, mDaiTrade } from "../generated/schema"
import {mUSDCMint, mUSDCRedeem, mUSDCTrade} from "../generated/schema"

export function handleApproval(event: Approval): void {
let dmgapproval = new dmgApproval(event.transaction.hash.toHex())
dmgapproval.amountApproved = event.transaction.value
dmgapproval.ownerAddress = event.params.owner
dmgapproval.spenderAddress = event.params.spender
dmgapproval.transactionBlock = event.block.number
dmgapproval.save()

}
  //  Entities can be loaded from the store using a string ID; this ID
  //  needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  //  Entities only exist after they have been saved to the store;
  //  `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //    Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }



  // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // // Entity fields can be set based on event parameters
  // entity.owner = event.params.owner
  // entity.spender = event.params.spender

  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.APPROVE_TYPE_HASH(...)
  // - contract.DELEGATION_TYPE_HASH(...)
  // - contract.DOMAIN_TYPE_HASH(...)
  // - contract.TRANSFER_TYPE_HASH(...)
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.burn(...)
  // - contract.checkpoints(...)
  // - contract.decimals(...)
  // - contract.delegates(...)
  // - contract.domainSeparator(...)
  // - contract.getCurrentVotes(...)
  // - contract.getPriorVotes(...)
  // - contract.name(...)
  // - contract.nonceOf(...)
  // - contract.nonces(...)
  // - contract.numCheckpoints(...)
  // - contract.symbol(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)


export function handleDelegateChanged(event: DelegateChanged): void {

}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {

}
export function handleTransfer(event: Transfer): void {
    //    Entity fields can be set using simple assignments
    //   entity.count = BigInt.fromI32(0)
    let dmgtrade = new dmgTrade(event.transaction.hash.toHex()) 
    dmgtrade.transferedFrom= event.params.from
    dmgtrade.transferedTo = event.params.to
    dmgtrade.amountTransfered = event.transaction.value
    dmgtrade.transactionDate = event.block.timestamp
    dmgtrade.transactionBlock = event.block.number
    dmgtrade.save()
}

export function handleMDAIMint (event: Mint): void{
    let mdaiMint = new mDaiMint(event.transaction.hash.toHex())
    let contract = mDai.bind(event.address)
    mdaiMint.minterAddress = event.params.minter
    mdaiMint.recipientAddress = event.params.recipient
    mdaiMint.amountMinted = event.params.amount
    mdaiMint.tokenAddress = contract._address
    mdaiMint.symbol =  contract.symbol()
    mdaiMint.totalSupply = contract.totalSupply()
    mdaiMint.transactionDate = event.block.timestamp
    mdaiMint.transactionBlock = event.block.number
    mdaiMint.save()
}


export function handleMDAIRedeem (event: Redeem): void{
    let mdaiRedeem = new mDaiRedeem(event.transaction.hash.toHex())
    let contract = mDai.bind(event.address)
    mdaiRedeem.redeemerAddress = event.params.redeemer
    mdaiRedeem.recipientAddress = event.params.recipient
    mdaiRedeem.amountRedeemed = event.params.amount
    mdaiRedeem.tokenAddress = contract._address
    mdaiRedeem.symbol =  contract.symbol()
    mdaiRedeem.totalSupply = contract.totalSupply()
    mdaiRedeem.transactionDate = event.block.timestamp
    mdaiRedeem.transactionBlock = event.block.number
    mdaiRedeem.save() 
}

export function handleMDAITransfer (event: Transfer): void{
    let mdaiTrade = new mDaiTrade(event.transaction.hash.toHex()) 
    mdaiTrade.transferedFrom= event.params.from
    mdaiTrade.transferedTo = event.params.to
    mdaiTrade.amountTransfered = event.transaction.value
    mdaiTrade.transactionDate = event.block.timestamp
    mdaiTrade.transactionBlock = event.block.number
    mdaiTrade.save()
}

export function handleMUSDCMint (event: Mint): void{
    let musdcMint = new mUSDCMint(event.transaction.hash.toHex())
    let contract = mUSDC.bind(event.address)
    musdcMint.minterAddress = event.params.minter
    musdcMint.recipientAddress = event.params.recipient
    musdcMint.amountMinted = event.params.amount
    musdcMint.tokenAddress = contract._address
    musdcMint.symbol =  contract.symbol()
    musdcMint.totalSupply = contract.totalSupply()
    musdcMint.transactionDate = event.block.timestamp
    musdcMint.transactionBlock = event.block.number
    musdcMint.save()
  }
  
  
  export function handleMUSDCRedeem (event: Redeem): void{
      let musdcRedeem = new mUSDCRedeem(event.transaction.hash.toHex())
      let contract = mUSDC.bind(event.address)
      musdcRedeem.redeemerAddress = event.params.redeemer
      musdcRedeem.recipientAddress = event.params.recipient
      musdcRedeem.amountRedeemed = event.params.amount
      musdcRedeem.tokenAddress = contract._address
      musdcRedeem.symbol =  contract.symbol()
      musdcRedeem.totalSupply = contract.totalSupply()
      musdcRedeem.transactionDate = event.block.timestamp
      musdcRedeem.transactionBlock = event.block.number
      musdcRedeem.save() 
  }
  export function handleMUSDCTransfer (event: Transfer): void{
      let musdcTrade = new mUSDCTrade(event.transaction.hash.toHex())
      musdcTrade.transferedFrom= event.params.from
      musdcTrade.transferedTo = event.params.to
      musdcTrade.amountTransfered = event.transaction.value
      musdcTrade.transactionDate = event.block.timestamp
      musdcTrade.transactionBlock = event.block.number
      musdcTrade.save()
  }