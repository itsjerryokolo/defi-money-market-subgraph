/*
 * Copyright 2020 DMM Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


pragma solidity ^0.5.13;
pragma experimental ABIEncoderV2;

import "../../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./SafeBitMath.sol";

import "../../utils/EvmUtil.sol";
import "./IDMGToken.sol";
import "./DMGTokenData.sol";
import "./DMGTokenConstants.sol";

/**
 * This contract is mainly based on Compound's COMP token
 * (https://etherscan.io/address/0xc00e94cb662c3520282e6f5717214004a7f26888). Unfortunately, no license was found on
 * Etherscan for the token and the code for the token cannot be found on their GitHub, so the proper attribution to the
 * Compound team cannot be made.
 *
 * Changes made to the token contract include modifying internal storage of balances/allowances to use 128 bits instead
 * of 96, increasing the number of bits for a checkpoint to 64, adding a burn function, and creating an initial
 * totalSupply of 250mm.
 */
contract DMGToken is IDMGToken, IERC20, DMGTokenConstants, DMGTokenData {

    string public constant name = "DMM: Governance";

    /**
     * @notice Construct the DMG token
     * @param _account The initial account to receive all of the tokens
     * @param _totalSupply The total supply of all the tokens, which is sent to _account.
     */
    function initialize(
        address _account,
        uint _totalSupply
    )
    public
    initializer {
        require(_totalSupply == uint128(_totalSupply), "DMG: total supply exceeds 128 bits");
        totalSupply = _totalSupply;

        domainSeparator = keccak256(
            abi.encode(DOMAIN_TYPE_HASH, keccak256(bytes(name)), EvmUtil.getChainId(), address(this))
        );

        balances[_account] = uint128(_totalSupply);
        emit Transfer(address(0), _account, _totalSupply);
    }

    /**
     * @notice Get the number of tokens `spender` is approved to spend on behalf of `account`
     * @param account The address of the account holding the funds
     * @param spender The address of the account spending the funds
     * @return The number of tokens approved
     */
    function allowance(address account, address spender) external view returns (uint) {
        return allowances[account][spender];
    }

    /**
     * @notice Approve `spender` to transfer up to `amount` from `src`
     * @dev This will overwrite the approval amount for `spender`
     *  and is subject to issues noted [here](https://eips.ethereum.org/EIPS/eip-20#approve)
     * @param spender The address of the account which may transfer tokens
     * @param rawAmount The number of tokens that are approved (2^256-1 means infinite)
     * @return Whether or not the approval succeeded
     */
    function approve(address spender, uint rawAmount) external returns (bool) {
        uint128 amount;
        if (rawAmount == uint(- 1)) {
            amount = uint128(- 1);
        } else {
            amount = SafeBitMath.safe128(rawAmount, "DMG::approve: amount exceeds 128 bits");
        }

        _approveTokens(msg.sender, spender, amount);
        return true;
    }

    /**
     * @notice Get the number of tokens held by the `account`
     * @param account The address of the account to get the balance of
     * @return The number of tokens held
     */
    function balanceOf(address account) external view returns (uint) {
        return balances[account];
    }

    /**
     * @notice Transfer `amount` tokens from `msg.sender` to `dst`
     * @param dst The address of the destination account
     * @param rawAmount The number of tokens to transfer
     * @return Whether or not the transfer succeeded
     */
    function transfer(address dst, uint rawAmount) external returns (bool) {
        uint128 amount = SafeBitMath.safe128(rawAmount, "DMG::transfer: amount exceeds 128 bits");
        _transferTokens(msg.sender, dst, amount);
        return true;
    }

    /**
     * @notice Transfers `amount` tokens from `msg.sender` to the zero address
     * @param rawAmount The number of tokens to burn
     * @return Whether or not the transfer succeeded
    */
    function burn(uint rawAmount) external returns (bool) {
        uint128 amount = SafeBitMath.safe128(rawAmount, "DMG::burn: amount exceeds 128 bits");
        _burnTokens(msg.sender, amount);
        return true;
    }

    /**
     * @notice Transfer `amount` tokens from `src` to `dst`
     * @param src The address of the source account
     * @param dst The address of the destination account
     * @param rawAmount The number of tokens to transfer
     * @return Whether or not the transfer succeeded
     */
    function transferFrom(address src, address dst, uint rawAmount) external returns (bool) {
        address spender = msg.sender;
        uint128 spenderAllowance = allowances[src][spender];
        uint128 amount = SafeBitMath.safe128(rawAmount, "DMG::allowances: amount exceeds 128 bits");

        if (spender != src && spenderAllowance != uint128(- 1)) {
            uint128 newAllowance = SafeBitMath.sub128(spenderAllowance, amount, "DMG::transferFrom: transfer amount exceeds spender allowance");
            allowances[src][spender] = newAllowance;

            emit Approval(src, spender, newAllowance);
        }

        _transferTokens(src, dst, amount);
        return true;
    }

    /**
     * @notice Delegate votes from `msg.sender` to `delegatee`
     * @param delegatee The address to delegate votes to
     */
    function delegate(address delegatee) public {
        return _delegate(msg.sender, delegatee);
    }

    function nonceOf(address signer) public view returns (uint) {
        return nonces[signer];
    }

    /**
     * @notice Delegates votes from signatory to `delegatee`
     * @param delegatee The address to delegate votes to
     * @param nonce The contract state required to match the signature
     * @param expiry The time at which to expire the signature
     * @param v The recovery byte of the signature
     * @param r Half of the ECDSA signature pair
     * @param s Half of the ECDSA signature pair
     */
    function delegateBySig(address delegatee, uint nonce, uint expiry, uint8 v, bytes32 r, bytes32 s) public {
        bytes32 structHash = keccak256(abi.encode(DELEGATION_TYPE_HASH, delegatee, nonce, expiry));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "DMG::delegateBySig: invalid signature");
        require(nonce == nonces[signatory]++, "DMG::delegateBySig: invalid nonce");
        require(now <= expiry, "DMG::delegateBySig: signature expired");
        return _delegate(signatory, delegatee);
    }

    /**
     * @notice Transfers tokens from signatory to `recipient`
     * @param recipient The address to receive the tokens
     * @param rawAmount The amount of tokens to be sent to recipient
     * @param nonce The contract state required to match the signature
     * @param expiry The time at which to expire the signature
     * @param v The recovery byte of the signature
     * @param r Half of the ECDSA signature pair
     * @param s Half of the ECDSA signature pair
     */
    function transferBySig(address recipient, uint rawAmount, uint nonce, uint expiry, uint8 v, bytes32 r, bytes32 s) public {
        bytes32 structHash = keccak256(abi.encode(TRANSFER_TYPE_HASH, recipient, rawAmount, nonce, expiry));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "DMG::transferBySig: invalid signature");
        require(nonce == nonces[signatory]++, "DMG::transferBySig: invalid nonce");
        require(now <= expiry, "DMG::transferBySig: signature expired");

        uint128 amount = SafeBitMath.safe128(rawAmount, "DMG::transferBySig: amount exceeds 128 bits");
        return _transferTokens(signatory, recipient, amount);
    }

    /**
     * @notice Approves tokens from signatory to be spent by `spender`
     * @param spender The address to receive the tokens
     * @param rawAmount The amount of tokens to be sent to spender
     * @param nonce The contract state required to match the signature
     * @param expiry The time at which to expire the signature
     * @param v The recovery byte of the signature
     * @param r Half of the ECDSA signature pair
     * @param s Half of the ECDSA signature pair
     */
    function approveBySig(address spender, uint rawAmount, uint nonce, uint expiry, uint8 v, bytes32 r, bytes32 s) public {
        bytes32 structHash = keccak256(abi.encode(APPROVE_TYPE_HASH, spender, rawAmount, nonce, expiry));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "DMG::approveBySig: invalid signature");
        require(nonce == nonces[signatory]++, "DMG::approveBySig: invalid nonce");
        require(now <= expiry, "DMG::approveBySig: signature expired");

        uint128 amount;
        if (rawAmount == uint(- 1)) {
            amount = uint128(- 1);
        } else {
            amount = SafeBitMath.safe128(rawAmount, "DMG::approveBySig: amount exceeds 128 bits");
        }
        _approveTokens(signatory, spender, amount);
    }

    /**
     * @notice Gets the current votes balance for `account`
     * @param account The address to get votes balance
     * @return The number of current votes for `account`
     */
    function getCurrentVotes(address account) external view returns (uint128) {
        uint64 nCheckpoints = numCheckpoints[account];
        return nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
    }

    /**
     * @notice Determine the prior number of votes for an account as of a block number
     * @dev Block number must be a finalized block or else this function will revert to prevent misinformation.
     * @param account The address of the account to check
     * @param blockNumber The block number to get the vote balance at
     * @return The number of votes the account had as of the given block
     */
    function getPriorVotes(address account, uint blockNumber) public view returns (uint128) {
        require(blockNumber < block.number, "DMG::getPriorVotes: not yet determined");

        uint64 nCheckpoints = numCheckpoints[account];
        if (nCheckpoints == 0) {
            return 0;
        }

        // First check most recent balance
        if (checkpoints[account][nCheckpoints - 1].fromBlock <= blockNumber) {
            return checkpoints[account][nCheckpoints - 1].votes;
        }

        // Next check implicit zero balance
        if (checkpoints[account][0].fromBlock > blockNumber) {
            return 0;
        }

        uint64 lower = 0;
        uint64 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint64 center = upper - (upper - lower) / 2;
            // ceil, avoiding overflow
            Checkpoint memory cp = checkpoints[account][center];
            if (cp.fromBlock == blockNumber) {
                return cp.votes;
            } else if (cp.fromBlock < blockNumber) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return checkpoints[account][lower].votes;
    }

    function _delegate(address delegator, address delegatee) internal {
        address currentDelegate = delegates[delegator];
        uint128 delegatorBalance = balances[delegator];
        delegates[delegator] = delegatee;

        emit DelegateChanged(delegator, currentDelegate, delegatee);

        _moveDelegates(currentDelegate, delegatee, delegatorBalance);
    }

    function _transferTokens(address src, address dst, uint128 amount) internal {
        require(src != address(0), "DMG::_transferTokens: cannot transfer from the zero address");
        require(dst != address(0), "DMG::_transferTokens: cannot transfer to the zero address");

        balances[src] = SafeBitMath.sub128(balances[src], amount, "DMG::_transferTokens: transfer amount exceeds balance");
        balances[dst] = SafeBitMath.add128(balances[dst], amount, "DMG::_transferTokens: transfer amount overflows");
        emit Transfer(src, dst, amount);

        _moveDelegates(delegates[src], delegates[dst], amount);
    }

    function _approveTokens(address owner, address spender, uint128 amount) internal {
        allowances[owner][spender] = amount;

        emit Approval(owner, spender, amount);
    }

    function _burnTokens(address src, uint128 amount) internal {
        require(src != address(0), "DMG::_burnTokens: cannot burn from the zero address");

        balances[src] = SafeBitMath.sub128(balances[src], amount, "DMG::_burnTokens: burn amount exceeds balance");
        emit Transfer(src, address(0), amount);

        totalSupply = SafeBitMath.sub128(uint128(totalSupply), amount, "DMG::_burnTokens: burn amount exceeds total supply");

        _moveDelegates(delegates[src], address(0), amount);
    }

    function _moveDelegates(address srcRep, address dstRep, uint128 amount) internal {
        if (srcRep != dstRep && amount > 0) {
            if (srcRep != address(0)) {
                uint64 srcRepNum = numCheckpoints[srcRep];
                uint128 srcRepOld = srcRepNum > 0 ? checkpoints[srcRep][srcRepNum - 1].votes : 0;
                uint128 srcRepNew = SafeBitMath.sub128(srcRepOld, amount, "DMG::_moveVotes: vote amount underflows");
                _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
            }

            if (dstRep != address(0)) {
                uint64 dstRepNum = numCheckpoints[dstRep];
                uint128 dstRepOld = dstRepNum > 0 ? checkpoints[dstRep][dstRepNum - 1].votes : 0;
                uint128 dstRepNew = SafeBitMath.add128(dstRepOld, amount, "DMG::_moveVotes: vote amount overflows");
                _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
            }
        }
    }

    function _writeCheckpoint(address delegatee, uint64 nCheckpoints, uint128 oldVotes, uint128 newVotes) internal {
        uint64 blockNumber = SafeBitMath.safe64(block.number, "DMG::_writeCheckpoint: block number exceeds 64 bits");

        if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
            checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
        } else {
            checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
            numCheckpoints[delegatee] = nCheckpoints + 1;
        }

        emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
    }

}