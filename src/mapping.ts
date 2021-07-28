import { BigInt, Address, Bytes, log, BigDecimal, ByteArray } from "@graphprotocol/graph-ts"
import {
  DMMToken,
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  Transfer as Dmg_Transfer
} from "../generated/DMMToken/DMMToken"

import {
  mDAI,
  Mint as mDai_Mint,
  Redeem as mDai_Redeem,
  Transfer as mDai_Transfer
} from "../generated/mDai/mDai"

import {
  mUSDC,
  Mint as mUSDC_Mint,
  Redeem as mUSDC_Redeem,
  Transfer as mUSDC_Transfer
} from "../generated/mUSDC/mUSDC"

import {
  mETH,
  Mint as mETH_Mint,
  Redeem as mETH_Redeem,
  Transfer as mETH_Transfer
} from "../generated/mETH/mETH"

import {
  mUSDT,
  Mint as mUSDT_Mint,
  Redeem as mUSDT_Redeem,
  Transfer as mUSDT_Transfer
} from "../generated/mUSDT/mUSDT"

import {
  dmgGovernance,
  ProposalCreated,
  VoteCast
} from "../generated/dmgGovernance/dmgGovernance"

import{toBigDecimal} from "../utils/utils"
import{
  Governance,
  mDai,
  mEth,
  mUsdc,
  mUsdt,
  Vote
} from "../generated/schema"


export function handleDelegateChanged(event: DelegateChanged): void {}
export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {}
export function handleApproval(event: Approval): void {}


export function handleTransfer(event: Dmg_Transfer): void {

}

export function handleMDAIMint (event: mDai_Mint): void{

}


export function handleMDAIRedeem (event: mDai_Redeem): void{

}

export function handleMDAITransfer (event: mDai_Transfer): void{

}

export function handleMUSDCMint (event: mUSDC_Mint): void{

  }
  
export function handleMUSDCRedeem (event: mUSDC_Redeem): void{

}
export function handleMUSDCTransfer (event: mUSDC_Transfer): void{

}

export function handleMETHMint (event: mETH_Mint): void{

}

export function handleMETHRedeem (event: mETH_Redeem): void{

}
export function handleMETHTransfer (event: mETH_Transfer): void{

}

export function handleMUSDTMint (event: mUSDT_Mint): void{

}

export function handleMUSDTRedeem (event: mUSDT_Redeem): void{

}
export function handleMUSDTTransfer (event: mUSDT_Transfer): void{

}

export function handleProposalCreated (event: ProposalCreated): void{

}
export function handleVoteCast (event: VoteCast): void{

}
