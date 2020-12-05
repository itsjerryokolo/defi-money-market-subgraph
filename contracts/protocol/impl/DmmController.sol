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

import "../../../node_modules/@openzeppelin/contracts/lifecycle/Pausable.sol";
import "../../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../../../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";
import "../../../node_modules/@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../../../node_modules/@openzeppelin/contracts/utils/Address.sol";

import "../constants/CommonConstants.sol";
import "../impl/DmmBlacklistable.sol";
import "../interfaces/IOffChainAssetValuatorV1.sol";
import "../interfaces/IDmmController.sol";
import "../interfaces/IDmmToken.sol";
import "../interfaces/InterestRateInterface.sol";
import "../interfaces/IUnderlyingTokenValuator.sol";
import "../interfaces/IDmmTokenFactory.sol";
import "../interfaces/IPausable.sol";
import "../interfaces/IOffChainCurrencyValuatorV1.sol";

import "../../utils/Blacklistable.sol";

contract DmmController is IPausable, Pausable, CommonConstants, IDmmController, Ownable {

    using SafeMath for uint;
    using SafeERC20 for IERC20;
    using Address for address;

    /********************************
     * Events
     */

    event GuardianChanged(address previousGuardian, address newGuardian);
    event DmmTokenFactoryChanged(address previousDmmTokenFactory, address newDmmTokenFactory);
    event DmmEtherFactoryChanged(address previousDmmEtherFactory, address newDmmEtherFactory);
    event InterestRateInterfaceChanged(address previousInterestRateInterface, address newInterestRateInterface);
    event OffChainAssetValuatorChanged(address previousOffChainAssetValuator, address newOffChainAssetValuator);
    event OffChainCurrencyValuatorChanged(address previousOffChainCurrencyValuator, address newOffChainCurrencyValuator);
    event UnderlyingTokenValuatorChanged(address previousUnderlyingTokenValuator, address newUnderlyingTokenValuator);

    event MarketAdded(uint indexed dmmTokenId, address indexed dmmToken, address indexed underlyingToken);

    event DisableMarket(uint indexed dmmTokenId);
    event EnableMarket(uint indexed dmmTokenId);

    event MinCollateralizationChanged(uint previousMinCollateralization, uint newMinCollateralization);
    event MinReserveRatioChanged(uint previousMinReserveRatio, uint newMinReserveRatio);

    /********************************
     * Controller Fields
     */

    address public guardian;
    InterestRateInterface public interestRateInterface;
    IOffChainAssetValuatorV1 public offChainAssetsValuator;
    IOffChainCurrencyValuatorV1 public offChainCurrencyValuator;
    IUnderlyingTokenValuator public underlyingTokenValuator;
    IDmmTokenFactory public dmmEtherFactory;
    IDmmTokenFactory public dmmTokenFactory;
    DmmBlacklistable public blacklistable;
    uint public minCollateralization;
    uint public minReserveRatio;
    address public wethToken;

    /********************************
     * DMM Account Management
     */

    mapping(uint => address) public dmmTokenIdToDmmTokenAddressMap;
    mapping(address => uint) public dmmTokenAddressToDmmTokenIdMap;

    mapping(address => uint) public underlyingTokenAddressToDmmTokenIdMap;
    mapping(uint => address) public dmmTokenIdToUnderlyingTokenAddressMap;

    mapping(uint => bool) public dmmTokenIdToIsDisabledMap;
    uint[] public dmmTokenIds;

    /********************************
     * Constants
     */

    uint public constant COLLATERALIZATION_BASE_RATE = 1e18;
    uint public constant INTEREST_RATE_BASE_RATE = 1e18;
    uint public constant MIN_RESERVE_RATIO_BASE_RATE = 1e18;

    constructor(
        address _guardian,
        address _interestRateInterface,
        address _offChainAssetsValuator,
        address _offChainCurrencyValuator,
        address _underlyingTokenValuator,
        address _dmmEtherFactory,
        address _dmmTokenFactory,
        address _blacklistable,
        uint _minCollateralization,
        uint _minReserveRatio,
        address _wethToken
    ) public {
        guardian = _guardian;
        interestRateInterface = InterestRateInterface(_interestRateInterface);
        offChainAssetsValuator = IOffChainAssetValuatorV1(_offChainAssetsValuator);
        offChainCurrencyValuator = IOffChainCurrencyValuatorV1(_offChainCurrencyValuator);
        underlyingTokenValuator = IUnderlyingTokenValuator(_underlyingTokenValuator);
        dmmTokenFactory = IDmmTokenFactory(_dmmTokenFactory);
        dmmEtherFactory = IDmmTokenFactory(_dmmEtherFactory);
        blacklistable = DmmBlacklistable(_blacklistable);
        minCollateralization = _minCollateralization;
        minReserveRatio = _minReserveRatio;
        wethToken = _wethToken;
    }

    /*****************
     * Modifiers
     */

    modifier whenNotPaused() {
        require(!paused(), "ECOSYSTEM_PAUSED");
        _;
    }

    modifier whenPaused() {
        require(paused(), "ECOSYSTEM_NOT_PAUSED");
        _;
    }

    modifier checkTokenExists(uint dmmTokenId) {
        require(dmmTokenIdToDmmTokenAddressMap[dmmTokenId] != address(0x0), "TOKEN_DOES_NOT_EXIST");
        _;
    }

    modifier onlyOwnerOrGuardian() {
        require(isOwner() || msg.sender == guardian, "MUST_BE_OWNER_OR_GUARDIAN");
        _;
    }

    /**********************
     * Public Functions
     */

    function transferOwnership(address newOwner) public onlyOwner {
        address oldOwner = owner();
        super.transferOwnership(newOwner);
        _removePauser(oldOwner);
        _addPauser(newOwner);
    }

    function addMarket(
        address underlyingToken,
        string memory symbol,
        string memory name,
        uint8 decimals,
        uint minMintAmount,
        uint minRedeemAmount,
        uint totalSupply
    ) public onlyOwner {
        require(
            underlyingTokenAddressToDmmTokenIdMap[underlyingToken] == 0,
            "TOKEN_ALREADY_EXISTS"
        );

        IDmmToken dmmToken;
        address controller = address(this);
        if (underlyingToken == wethToken) {
            dmmToken = dmmEtherFactory.deployToken(
                symbol,
                name,
                decimals,
                minMintAmount,
                minRedeemAmount,
                totalSupply,
                controller
            );
        } else {
            dmmToken = dmmTokenFactory.deployToken(
                symbol,
                name,
                decimals,
                minMintAmount,
                minRedeemAmount,
                totalSupply,
                controller
            );
        }

        _addMarket(address(dmmToken), underlyingToken);
    }

    function addMarketFromExistingDmmToken(
        address dmmToken,
        address underlyingToken
    )
    onlyOwner
    public {
        require(
            underlyingTokenAddressToDmmTokenIdMap[underlyingToken] == 0,
            "TOKEN_ALREADY_EXISTS"
        );
        require(
            dmmToken.isContract(),
            "DMM_TOKEN_IS_NOT_CONTRACT"
        );
        require(
            underlyingToken.isContract(),
            "UNDERLYING_TOKEN_IS_NOT_CONTRACT"
        );
        require(
            Ownable(dmmToken).owner() == address(this),
            "INVALID_DMM_TOKEN_OWNERSHIP"
        );

        _addMarket(dmmToken, underlyingToken);
    }

    function transferOwnershipToNewController(
        address newController
    )
    onlyOwner
    public {
        require(
            newController.isContract(),
            "NEW_CONTROLLER_IS_NOT_CONTRACT"
        );
        // All of the following contracts are owned by the controller. All other ownable contracts are owned by the
        // same owner as this controller.
        for (uint i = 0; i < dmmTokenIds.length; i++) {
            address dmmToken = dmmTokenIdToDmmTokenAddressMap[dmmTokenIds[i]];
            Ownable(dmmToken).transferOwnership(newController);
        }
        Ownable(address(dmmEtherFactory)).transferOwnership(newController);
        Ownable(address(dmmTokenFactory)).transferOwnership(newController);
    }

    function enableMarket(uint dmmTokenId) public checkTokenExists(dmmTokenId) whenNotPaused onlyOwner {
        require(dmmTokenIdToIsDisabledMap[dmmTokenId], "MARKET_ALREADY_ENABLED");
        dmmTokenIdToIsDisabledMap[dmmTokenId] = false;
        emit EnableMarket(dmmTokenId);
    }

    function disableMarket(uint dmmTokenId) public checkTokenExists(dmmTokenId) whenNotPaused onlyOwner {
        require(!dmmTokenIdToIsDisabledMap[dmmTokenId], "MARKET_ALREADY_DISABLED");
        dmmTokenIdToIsDisabledMap[dmmTokenId] = true;
        emit DisableMarket(dmmTokenId);
    }

    function setGuardian(
        address newGuardian
    )
    whenNotPaused
    onlyOwner
    public {
        address oldGuardian = guardian;
        guardian = newGuardian;
        emit GuardianChanged(oldGuardian, newGuardian);
    }

    function setDmmTokenFactory(address newDmmTokenFactory) public whenNotPaused onlyOwner {
        address oldDmmTokenFactory = address(dmmTokenFactory);
        dmmTokenFactory = IDmmTokenFactory(newDmmTokenFactory);
        emit DmmTokenFactoryChanged(oldDmmTokenFactory, address(dmmTokenFactory));
    }

    function setDmmEtherFactory(address newDmmEtherFactory) public whenNotPaused onlyOwner {
        address oldDmmEtherFactory = address(dmmEtherFactory);
        dmmEtherFactory = IDmmTokenFactory(newDmmEtherFactory);
        emit DmmEtherFactoryChanged(oldDmmEtherFactory, address(dmmEtherFactory));
    }

    function setInterestRateInterface(address newInterestRateInterface) public whenNotPaused onlyOwner {
        address oldInterestRateInterface = address(interestRateInterface);
        interestRateInterface = InterestRateInterface(newInterestRateInterface);
        emit InterestRateInterfaceChanged(oldInterestRateInterface, address(interestRateInterface));
    }

    function setOffChainAssetValuator(address newOffChainAssetValuator) public whenNotPaused onlyOwner {
        address oldOffChainAssetValuator = address(offChainAssetsValuator);
        offChainAssetsValuator = IOffChainAssetValuatorV1(newOffChainAssetValuator);
        emit OffChainAssetValuatorChanged(oldOffChainAssetValuator, address(offChainAssetsValuator));
    }

    function setOffChainCurrencyValuator(address newOffChainCurrencyValuator) public whenNotPaused onlyOwner {
        address oldOffChainCurrencyValuator = address(offChainCurrencyValuator);
        offChainCurrencyValuator = IOffChainCurrencyValuatorV1(newOffChainCurrencyValuator);
        emit OffChainCurrencyValuatorChanged(oldOffChainCurrencyValuator, address(offChainCurrencyValuator));
    }

    function setUnderlyingTokenValuator(address newUnderlyingTokenValuator) public whenNotPaused onlyOwner {
        address oldUnderlyingTokenValuator = address(underlyingTokenValuator);
        underlyingTokenValuator = IUnderlyingTokenValuator(newUnderlyingTokenValuator);
        emit UnderlyingTokenValuatorChanged(oldUnderlyingTokenValuator, address(underlyingTokenValuator));
    }

    function setMinCollateralization(uint newMinCollateralization) public whenNotPaused onlyOwner {
        uint oldMinCollateralization = minCollateralization;
        minCollateralization = newMinCollateralization;
        emit MinCollateralizationChanged(oldMinCollateralization, minCollateralization);
    }

    function setMinReserveRatio(uint newMinReserveRatio) public whenNotPaused onlyOwner {
        uint oldMinReserveRatio = minReserveRatio;
        minReserveRatio = newMinReserveRatio;
        emit MinReserveRatioChanged(oldMinReserveRatio, minReserveRatio);
    }

    function increaseTotalSupply(
        uint dmmTokenId,
        uint amount
    ) public checkTokenExists(dmmTokenId) whenNotPaused onlyOwner {
        IDmmToken(dmmTokenIdToDmmTokenAddressMap[dmmTokenId]).increaseTotalSupply(amount);
        require(getTotalCollateralization() >= minCollateralization, "INSUFFICIENT_COLLATERAL");
    }

    function decreaseTotalSupply(
        uint dmmTokenId,
        uint amount
    ) public checkTokenExists(dmmTokenId) whenNotPaused onlyOwner {
        IDmmToken(dmmTokenIdToDmmTokenAddressMap[dmmTokenId]).decreaseTotalSupply(amount);
    }

    function adminWithdrawFunds(
        uint dmmTokenId,
        uint underlyingAmount
    ) public checkTokenExists(dmmTokenId) whenNotPaused onlyOwner {
        // Attempt to pull from the DMM contract into this contract, then send from this contract to sender.
        IDmmToken token = IDmmToken(dmmTokenIdToDmmTokenAddressMap[dmmTokenId]);
        token.withdrawUnderlying(underlyingAmount);
        IERC20 underlyingToken = IERC20(dmmTokenIdToUnderlyingTokenAddressMap[dmmTokenId]);
        underlyingToken.safeTransfer(_msgSender(), underlyingAmount);

        // This is the amount owed by the system in terms of underlying
        uint totalOwedAmount = token.activeSupply().mul(token.getCurrentExchangeRate()).div(EXCHANGE_RATE_BASE_RATE);
        uint underlyingBalance = IERC20(dmmTokenIdToUnderlyingTokenAddressMap[dmmTokenId]).balanceOf(address(token));

        if (totalOwedAmount > 0) {
            // IE if we owe 100 and have an underlying balance of 10 --> reserve ratio is 0.1
            uint actualReserveRatio = underlyingBalance.mul(MIN_RESERVE_RATIO_BASE_RATE).div(totalOwedAmount);
            require(actualReserveRatio >= minReserveRatio, "INSUFFICIENT_LEFTOVER_RESERVES");
        }

        emit AdminWithdraw(_msgSender(), underlyingAmount);
    }

    function adminDepositFunds(
        uint dmmTokenId,
        uint underlyingAmount
    ) public checkTokenExists(dmmTokenId) whenNotPaused onlyOwnerOrGuardian {
        // Attempt to pull from the sender into this contract, then have the DMM token pull from here.
        IERC20 underlyingToken = IERC20(dmmTokenIdToUnderlyingTokenAddressMap[dmmTokenId]);
        underlyingToken.safeTransferFrom(_msgSender(), address(this), underlyingAmount);

        address dmmTokenAddress = dmmTokenIdToDmmTokenAddressMap[dmmTokenId];
        underlyingToken.approve(dmmTokenAddress, underlyingAmount);
        IDmmToken(dmmTokenAddress).depositUnderlying(underlyingAmount);
        emit AdminDeposit(_msgSender(), underlyingAmount);
    }

    function getTotalCollateralization() public view returns (uint) {
        uint totalLiabilities = 0;
        uint totalAssets = 0;
        for (uint i = 0; i < dmmTokenIds.length; i++) {
            IDmmToken token = IDmmToken(dmmTokenIdToDmmTokenAddressMap[dmmTokenIds[i]]);

            uint currentExchangeRate = token.getCurrentExchangeRate();

            // The interest rate is annualized, so figuring out the exchange rate 1-year from now is as simple as
            // applying the current interest rate to the current exchange rate.
            uint futureExchangeRate = currentExchangeRate.mul(INTEREST_RATE_BASE_RATE.add(getInterestRateByDmmTokenAddress(address(token)))).div(INTEREST_RATE_BASE_RATE);

            uint totalSupply = IERC20(address(token)).totalSupply();

            uint underlyingLiabilitiesForTotalSupply = getDmmSupplyValue(token, totalSupply, futureExchangeRate);
            totalLiabilities = totalLiabilities.add(underlyingLiabilitiesForTotalSupply);

            uint underlyingAssetsForTotalSupply = getDmmSupplyValue(token, totalSupply, currentExchangeRate);
            totalAssets = totalAssets.add(underlyingAssetsForTotalSupply);
        }
        return getCollateralization(totalLiabilities, totalAssets);
    }

    function getActiveCollateralization() public view returns (uint) {
        uint totalLiabilities = 0;
        uint totalAssetsInDmmContract = 0;
        for (uint i = 0; i < dmmTokenIds.length; i++) {
            IDmmToken token = IDmmToken(dmmTokenIdToDmmTokenAddressMap[dmmTokenIds[i]]);
            uint underlyingLiabilitiesValue = getDmmSupplyValue(token, token.activeSupply(), token.getCurrentExchangeRate());
            totalLiabilities = totalLiabilities.add(underlyingLiabilitiesValue);

            IERC20 underlyingToken = IERC20(getUnderlyingTokenForDmm(address(token)));
            uint underlyingAssetsValue = getUnderlyingSupplyValue(underlyingToken, underlyingToken.balanceOf(address(token)), token.decimals());
            totalAssetsInDmmContract = totalAssetsInDmmContract.add(underlyingAssetsValue);
        }
        return getCollateralization(totalLiabilities, totalAssetsInDmmContract);
    }

    function getInterestRateByUnderlyingTokenAddress(address underlyingToken) public view returns (uint) {
        uint dmmTokenId = underlyingTokenAddressToDmmTokenIdMap[underlyingToken];
        return getInterestRateByDmmTokenId(dmmTokenId);
    }

    function getInterestRateByDmmTokenId(uint dmmTokenId) checkTokenExists(dmmTokenId) public view returns (uint) {
        address dmmToken = dmmTokenIdToDmmTokenAddressMap[dmmTokenId];
        uint totalSupply = IERC20(dmmToken).totalSupply();
        uint activeSupply = IDmmToken(dmmToken).activeSupply();
        return interestRateInterface.getInterestRate(dmmTokenId, totalSupply, activeSupply);
    }

    function getInterestRateByDmmTokenAddress(address dmmToken) public view returns (uint) {
        uint dmmTokenId = dmmTokenAddressToDmmTokenIdMap[dmmToken];
        _checkTokenExists(dmmTokenId);

        uint totalSupply = IERC20(dmmToken).totalSupply();
        uint activeSupply = IDmmToken(dmmToken).activeSupply();
        return interestRateInterface.getInterestRate(dmmTokenId, totalSupply, activeSupply);
    }

    function getExchangeRateByUnderlying(address underlyingToken) public view returns (uint) {
        address dmmToken = getDmmTokenForUnderlying(underlyingToken);
        return IDmmToken(dmmToken).getCurrentExchangeRate();
    }

    function getExchangeRate(address dmmToken) public view returns (uint) {
        uint dmmTokenId = dmmTokenAddressToDmmTokenIdMap[dmmToken];
        _checkTokenExists(dmmTokenId);

        return IDmmToken(dmmToken).getCurrentExchangeRate();
    }

    function getDmmTokenForUnderlying(address underlyingToken) public view returns (address) {
        uint dmmTokenId = underlyingTokenAddressToDmmTokenIdMap[underlyingToken];
        _checkTokenExists(dmmTokenId);

        return dmmTokenIdToDmmTokenAddressMap[dmmTokenId];
    }

    function getUnderlyingTokenForDmm(address dmmToken) public view returns (address) {
        uint dmmTokenId = dmmTokenAddressToDmmTokenIdMap[dmmToken];
        _checkTokenExists(dmmTokenId);

        return dmmTokenIdToUnderlyingTokenAddressMap[dmmTokenId];
    }

    function isMarketEnabledByDmmTokenId(uint dmmTokenId) checkTokenExists(dmmTokenId) public view returns (bool) {
        return !dmmTokenIdToIsDisabledMap[dmmTokenId];
    }

    function isMarketEnabledByDmmTokenAddress(address dmmToken) public view returns (bool) {
        uint dmmTokenId = dmmTokenAddressToDmmTokenIdMap[dmmToken];
        _checkTokenExists(dmmTokenId);

        return !dmmTokenIdToIsDisabledMap[dmmTokenId];
    }

    function getTokenIdFromDmmTokenAddress(address dmmToken) public view returns (uint) {
        uint dmmTokenId = dmmTokenAddressToDmmTokenIdMap[dmmToken];
        _checkTokenExists(dmmTokenId);

        return dmmTokenId;
    }

    function getDmmTokenAddressByDmmTokenId(uint dmmTokenId) external view returns (address) {
        address token = dmmTokenIdToDmmTokenAddressMap[dmmTokenId];
        require(token != address(0x0), "TOKEN_DOES_NOT_EXIST");
        return token;
    }

    function getDmmTokenIds() public view returns (uint[] memory) {
        return dmmTokenIds;
    }


    /**********************
     * Private Functions
     */

    function _checkTokenExists(uint dmmTokenId) internal pure returns (bool) {
        require(dmmTokenId != 0, "TOKEN_DOES_NOT_EXIST");
        return true;
    }

    function _addMarket(address dmmToken, address underlyingToken) private {
        // Start the IDs at 1. Zero is reserved for the empty case when it doesn't exist.
        uint dmmTokenId = dmmTokenIds.length + 1;

        // Update the maps
        dmmTokenIdToDmmTokenAddressMap[dmmTokenId] = dmmToken;
        dmmTokenAddressToDmmTokenIdMap[dmmToken] = dmmTokenId;
        underlyingTokenAddressToDmmTokenIdMap[underlyingToken] = dmmTokenId;
        dmmTokenIdToUnderlyingTokenAddressMap[dmmTokenId] = underlyingToken;

        // Misc. Structures
        dmmTokenIdToIsDisabledMap[dmmTokenId] = false;
        dmmTokenIds.push(dmmTokenId);

        emit MarketAdded(dmmTokenId, dmmToken, underlyingToken);
    }

    function getCollateralization(uint totalLiabilities, uint totalAssets) private view returns (uint) {
        if (totalLiabilities == 0) {
            return 0;
        }
        uint collateralValue = offChainAssetsValuator.getOffChainAssetsValue().add(totalAssets).add(offChainCurrencyValuator.getOffChainCurrenciesValue());
        return collateralValue.mul(COLLATERALIZATION_BASE_RATE).div(totalLiabilities);
    }

    function getDmmSupplyValue(IDmmToken dmmToken, uint dmmSupply, uint currentExchangeRate) private view returns (uint) {
        uint underlyingTokenAmount = dmmSupply.mul(currentExchangeRate).div(EXCHANGE_RATE_BASE_RATE);
        // The amount returned must use 18 decimal places, regardless of the # of decimals this token has.
        uint standardizedUnderlyingTokenAmount;
        if (dmmToken.decimals() == 18) {
            standardizedUnderlyingTokenAmount = underlyingTokenAmount;
        } else if (dmmToken.decimals() < 18) {
            standardizedUnderlyingTokenAmount = underlyingTokenAmount.mul((10 ** (18 - uint(dmmToken.decimals()))));
        } else /* decimals > 18 */ {
            standardizedUnderlyingTokenAmount = underlyingTokenAmount.div((10 ** (uint(dmmToken.decimals()) - 18)));
        }
        address underlyingToken = getUnderlyingTokenForDmm(address(dmmToken));
        return underlyingTokenValuator.getTokenValue(underlyingToken, standardizedUnderlyingTokenAmount);
    }

    function getUnderlyingSupplyValue(IERC20 underlyingToken, uint underlyingSupply, uint8 decimals) private view returns (uint) {
        // The amount returned must use 18 decimal places, regardless of the # of decimals this token has.
        uint standardizedUnderlyingTokenAmount;
        if (decimals == 18) {
            standardizedUnderlyingTokenAmount = underlyingSupply;
        } else if (decimals < 18) {
            standardizedUnderlyingTokenAmount = underlyingSupply.mul((10 ** (18 - uint(decimals))));
        } else /* decimals > 18 */ {
            standardizedUnderlyingTokenAmount = underlyingSupply.div((10 ** (uint(decimals) - 18)));
        }
        return underlyingTokenValuator.getTokenValue(address(underlyingToken), standardizedUnderlyingTokenAmount);
    }

}
