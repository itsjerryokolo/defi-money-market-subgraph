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


pragma solidity ^0.5.0;

import "./DmmToken.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/IDmmEther.sol";
import "../libs/SafeEther.sol";

/**
 * @dev A wrapper around Ether and WETH for minting DMM.
 */
contract DmmEther is DmmToken, IDmmEther {

    using SafeEther for address;

    address public weth;

    bool private _shouldTransferIn = true;
    bool private _shouldRedeemToETH = true;

    constructor(
        address _weth,
        string memory _symbol,
        string memory _name,
        uint8 _decimals,
        uint _minMintAmount,
        uint _minRedeemAmount,
        uint _totalSupply,
        address _controller
    ) public DmmToken(
        _symbol,
        _name,
        _decimals,
        _minMintAmount,
        _minRedeemAmount,
        _totalSupply,
        _controller
    ) {
        weth = _weth;
    }

    function() payable external {
        // If ETH is sent by the WETH contract, do nothing - this means we're unwrapping
        if (_msgSender() != weth) {
            mintViaEther();
        }
    }

    function wethToken() public view returns (address) {
        return weth;
    }

    function mintViaEther()
    whenNotPaused
    nonReentrant
    isNotDisabled
    public payable returns (uint) {
        require(msg.value > 0, "INSUFFICIENT_VALUE");
        IWETH(weth).deposit.value(msg.value)();
        _shouldTransferIn = false;

        return _mint(_msgSender(), _msgSender(), msg.value);
    }

    function mint(
        uint underlyingAmount
    )
    whenNotPaused
    nonReentrant
    isNotDisabled
    public returns (uint) {
        _shouldTransferIn = true;
        return _mint(_msgSender(), _msgSender(), underlyingAmount);
    }


    function mintFromGaslessRequest(
        address owner,
        address recipient,
        uint nonce,
        uint expiry,
        uint underlyingAmount,
        uint feeAmount,
        address feeRecipient,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
    whenNotPaused
    nonReentrant
    isNotDisabled
    public returns (uint) {
        _shouldTransferIn = true;
        return _mintFromGaslessRequest(
            owner,
            recipient,
            nonce,
            expiry,
            underlyingAmount,
            feeAmount,
            feeRecipient,
            v,
            r,
            s
        );
    }

    function redeemToWETH(
        uint amount
    )
    whenNotPaused
    nonReentrant
    public returns (uint) {
        _shouldRedeemToETH = false;
        return _redeem(_msgSender(), _msgSender(), amount, /* shouldUseAllowance */ false);
    }

    function redeem(
        uint amount
    )
    whenNotPaused
    nonReentrant
    public returns (uint) {
        _shouldRedeemToETH = true;
        return _redeem(_msgSender(), _msgSender(), amount, /* shouldUseAllowance */ false);
    }

    function redeemFromGaslessRequest(
        address owner,
        address recipient,
        uint nonce,
        uint expiry,
        uint amount,
        uint feeAmount,
        address feeRecipient,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
    whenNotPaused
    nonReentrant
    public returns (uint) {
        _shouldRedeemToETH = true;
        return _redeemFromGaslessRequest(
            owner,
            recipient,
            nonce,
            expiry,
            amount,
            feeAmount,
            feeRecipient,
            v,
            r,
            s
        );
    }

    function transferUnderlyingIn(address sender, uint underlyingAmount) internal {
        if (!_shouldTransferIn) {
            // Do nothing. The ETH was already transferred into this contract
        } else {
            super.transferUnderlyingIn(sender, underlyingAmount);
        }
    }

    function transferUnderlyingOut(address recipient, uint underlyingAmount) internal {
        address underlyingToken = controller.getUnderlyingTokenForDmm(address(this));
        if (_shouldRedeemToETH) {
            IWETH(underlyingToken).withdraw(underlyingAmount);
            recipient.sendEther(underlyingAmount, "COULD_NOT_TRANSFER_ETH_OUT");
        } else {
            IERC20(underlyingToken).safeTransfer(recipient, underlyingAmount);
        }
    }

}