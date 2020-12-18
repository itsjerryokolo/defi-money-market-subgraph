import { BigInt, Address, Bytes, log, BigDecimal, ByteArray } from "@graphprotocol/graph-ts"
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
import {
  mETH,
  Mint,
  Redeem
} from "../generated/mETH/mETH"

import {
  mUSDT,
  Mint,
  Redeem
} from "../generated/mUSDT/mUSDT"

// import {
//   mUSDK,
//   Mint,
//   Redeem
// } from "../generated/mUSDK/mUSDK"

import {
  dmgGovernance,
  ProposalCreated,
  VoteCast
} from "../generated/dmgGovernance/dmgGovernance"


import { dmgTransfer  } from "../generated/schema"
import {mDaiMint, mDaiRedeem, mDaiTransfer } from "../generated/schema"
import {mUSDCMint, mUSDCRedeem, mUSDCTransfer} from "../generated/schema"
import {mETHMint, mETHRedeem, mETHTransfer} from "../generated/schema"
import {mUSDTMint, mUSDTRedeem, mUSDTTransfer} from "../generated/schema"
//import {mUSDKMint, mUSDKRedeem, mUSDKTransfer} from "../generated/schema"
import {governanceProposal, Vote} from "../generated/schema"



export function handleDelegateChanged(event: DelegateChanged): void {}
export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {}
export function handleApproval(event: Approval): void {}


export function handleTransfer(event: Transfer): void {

    let dmgtransfer = new dmgTransfer(event.transaction.hash.toHex())
    let contract = DMMToken.bind(event.address)     
    dmgtransfer.transferedFrom= event.params.from
    dmgtransfer.transferedTo = event.params.to
    dmgtransfer.symbol = contract.symbol()
    dmgtransfer.amountTransfered = event.transaction.value
    dmgtransfer.totalSupply = contract.totalSupply()
    dmgtransfer.transactionDate = event.block.timestamp
    dmgtransfer.transactionBlock = event.block.number
    dmgtransfer.save()
}

//-----------------------------mDAI start
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
    let mdaiTrade = new mDaiTransfer(event.transaction.hash.toHex())
    let contract = mDai.bind(event.address) 
    mdaiTrade.transferedFrom = event.params.from
    mdaiTrade.transferedTo = event.params.to
    mdaiTrade.symbol = contract.symbol()
    mdaiTrade.amountTransfered = event.transaction.value
    mdaiTrade.transactionDate = event.block.timestamp
    mdaiTrade.transactionBlock = event.block.number
    mdaiTrade.save()
}
//-----------------------------mDAI end

//-----------------------------mUSDC start
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
      let musdcTrade = new mUSDCTransfer(event.transaction.hash.toHex())
      let contract = mUSDC.bind(event.address)
      musdcTrade.symbol =  contract.symbol()
      musdcTrade.transferedFrom= event.params.from
      musdcTrade.transferedTo = event.params.to
      musdcTrade.amountTransfered = event.transaction.value
      musdcTrade.transactionDate = event.block.timestamp
      musdcTrade.transactionBlock = event.block.number
      musdcTrade.save()
  }
 //-----------------------------mUSDC end 

//-----------------------------mETH start
  export function handleMETHMint (event: Mint): void{
    let methMint = new mETHMint(event.transaction.hash.toHex())
    let contract = mETH.bind(event.address)
    methMint.minterAddress = event.params.minter
    methMint.recipientAddress = event.params.recipient
    methMint.amountMinted = event.params.amount
    methMint.tokenAddress = contract._address
    methMint.symbol =  contract.symbol()
    methMint.totalSupply = contract.totalSupply()
    methMint.transactionDate = event.block.timestamp
    methMint.transactionBlock = event.block.number
    methMint.save()
  }
  
  
  export function handleMETHRedeem (event: Redeem): void{
      let methRedeem = new mETHRedeem(event.transaction.hash.toHex())
      let contract = mETH.bind(event.address)
      methRedeem.redeemerAddress = event.params.redeemer
      methRedeem.recipientAddress = event.params.recipient
      methRedeem.amountRedeemed = event.params.amount
      methRedeem.tokenAddress = contract._address
      methRedeem.symbol =  contract.symbol()
      methRedeem.totalSupply = contract.totalSupply()
      methRedeem.transactionDate = event.block.timestamp
      methRedeem.transactionBlock = event.block.number
      methRedeem.save() 
  }
  export function handleMETHTransfer (event: Transfer): void{
      let methTrade = new mETHTransfer(event.transaction.hash.toHex())
      let contract = mETH.bind(event.address)
      methTrade.symbol =  contract.symbol()
      methTrade.transferedFrom= event.params.from
      methTrade.transferedTo = event.params.to
      methTrade.amountTransfered = event.transaction.value
      methTrade.transactionDate = event.block.timestamp
      methTrade.transactionBlock = event.block.number
      methTrade.save()
  }
//-----------------------------mETH end


// //-----------------------------mUSDT start
export function handleMUSDTMint (event: Mint): void{
  let musdtMint = new mUSDTMint(event.transaction.hash.toHex())
  let contract = mUSDT.bind(event.address)
  musdtMint.minterAddress = event.params.minter
  musdtMint.recipientAddress = event.params.recipient
  musdtMint.amountMinted = event.params.amount
  musdtMint.tokenAddress = contract._address
  musdtMint.symbol =  contract.symbol()
  musdtMint.totalSupply = contract.totalSupply()
  musdtMint.transactionDate = event.block.timestamp
  musdtMint.transactionBlock = event.block.number
  musdtMint.save()
}


export function handleMUSDTRedeem (event: Redeem): void{
    let musdtRedeem = new mUSDTRedeem(event.transaction.hash.toHex())
    let contract = mUSDT.bind(event.address)
    musdtRedeem.redeemerAddress = event.params.redeemer
    musdtRedeem.recipientAddress = event.params.recipient
    musdtRedeem.amountRedeemed = event.params.amount
    musdtRedeem.tokenAddress = contract._address
    musdtRedeem.symbol =  contract.symbol()
    musdtRedeem.totalSupply = contract.totalSupply()
    musdtRedeem.transactionDate = event.block.timestamp
    musdtRedeem.transactionBlock = event.block.number
    musdtRedeem.save() 
}
export function handleMUSDTTransfer (event: Transfer): void{
    let musdtTrade = new mUSDTTransfer(event.transaction.hash.toHex())
    let contract = mUSDT.bind(event.address)
    musdtTrade.symbol =  contract.symbol()
    musdtTrade.transferedFrom= event.params.from
    musdtTrade.transferedTo = event.params.to
    musdtTrade.amountTransfered = event.transaction.value
    musdtTrade.transactionDate = event.block.timestamp
    musdtTrade.transactionBlock = event.block.number
    musdtTrade.save()
}
// //-----------------------------mUSDT end



//-----------------------------mUSDK start
// export function handleUSDKMint (event: Mint): void{
//   let musdkMint = new mUSDKMint(event.transaction.hash.toHex())
//   let contract = mUSDK.bind(event.address)
//   musdkMint.minterAddress = event.params.minter
//   musdkMint.recipientAddress = event.params.recipient
//   musdkMint.amountMinted = event.params.amount
//   musdkMint.tokenAddress = contract._address
//   musdkMint.symbol =  contract.symbol()
//   musdkMint.totalSupply = contract.totalSupply()
//   musdkMint.transactionDate = event.block.timestamp
//   musdkMint.transactionBlock = event.block.number
//   musdkMint.save()
// }


// export function handleMUSDKRedeem (event: Redeem): void{
//     let musdkRedeem = new mUSDKRedeem(event.transaction.hash.toHex())
//     let contract = mUSDK.bind(event.address)
//     musdkRedeem.redeemerAddress = event.params.redeemer
//     musdkRedeem.recipientAddress = event.params.recipient
//     musdkRedeem.amountRedeemed = event.params.amount
//     musdkRedeem.tokenAddress = contract._address
//     musdkRedeem.symbol =  contract.symbol()
//     musdkRedeem.totalSupply = contract.totalSupply()
//     musdkRedeem.transactionDate = event.block.timestamp
//     musdkRedeem.transactionBlock = event.block.number
//     musdkRedeem.save() 
// }
// export function handleUSDKTransfer (event: Transfer): void{
//     let musdkTrade = new mUSDKTransfer(event.transaction.hash.toHex())
//     let contract = mUSDK.bind(event.address)
//     musdkTrade.symbol =  contract.symbol()
//     musdkTrade.transferedFrom= event.params.from
//     musdkTrade.transferedTo = event.params.to
//     musdkTrade.amountTransfered = event.transaction.value
//     musdkTrade.transactionDate = event.block.timestamp
//     musdkTrade.transactionBlock = event.block.number
//     musdkTrade.save()
// }
//-----------------------------mUSDK end


//-----------------------------dmgGovernance
export function handleProposalCreated (event: ProposalCreated): void{
      let governanceproposal = new governanceProposal(event.params.id.toHex())
      governanceproposal.title = event.params.title
      governanceproposal.description = event.params.description
      governanceproposal.proposerAddress = event.params.proposer
      governanceproposal.proposalDate = event.block.timestamp
      governanceproposal.startBlock = event.params.startBlock
      governanceproposal.endBlock = event.params.endBlock
      governanceproposal.save()
}
export function handleVoteCast (event: VoteCast): void{
      let vote = new Vote(event.transaction.hash.toHex())
      vote.governanceProposalID = event.params.proposalId
      vote.voterAddress = event.params.voter
      vote.support = event.params.support
      vote.voteAmount = event.params.votes
      vote.transactionDate = event.block.timestamp
      vote.save()
}