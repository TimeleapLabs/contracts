//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/**
 * Note: no need to import the entire IBEP20 when these are the only
 * functions we need.
 */
interface IToken {
    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

/*
 * @dev Migrate from BEP20 Kenshi v1 to BEP1363 Kenshi v2.
 */
contract Migrate {
    address private _v1Recipient;
    address private _v2Provider;
    address private _v1Addr;
    address private _v2Addr;
    address private _owner;
    bool private _enabled;

    IToken private _v1Token;
    IToken private _v2Token;

    constructor() {
        _owner = msg.sender;
    }

    /**
     * @dev Sets the recipient of the v1 tokens.
     */
    function setV1Recipient(address addr) external {
        require(msg.sender == _owner, "Kenshi: Only owner");
        require(addr != address(0), "Kenshi: Cannot set recipient to 0x0");
        _v1Recipient = addr;
    }

    /**
     * @dev Sets the provider of the v2 tokens.
     */
    function setV2Provider(address addr) external {
        require(msg.sender == _owner, "Kenshi: Only owner");
        require(addr != address(0), "Kenshi: Cannot set provider to 0x0");
        _v2Provider = addr;
    }

    /**
     * @dev Sets the address of the v1 token.
     */
    function setV1Addr(address addr) external {
        require(msg.sender == _owner, "Kenshi: Only owner");
        require(addr != address(0), "Kenshi: Cannot set v1 addr to 0x0");
        _v1Addr = addr;
        _v1Token = IToken(_v1Addr);
    }

    /**
     * @dev Sets the address of the v2 token.
     */
    function setV2Addr(address addr) external {
        require(msg.sender == _owner, "Kenshi: Only owner");
        require(addr != address(0), "Kenshi: Cannot set v2 addr to 0x0");
        _v2Addr = addr;
        _v2Token = IToken(_v2Addr);
    }

    /**
     * @dev Sets if the migrations are enabled.
     */
    function setIsEnabled(bool enabled) external {
        require(msg.sender == _owner, "Kenshi: Only owner");
        _enabled = enabled;
    }

    /**
     * @dev Migrate Kenshi tokens from v1 to v2.
     */
    function migrate() external {
        require(_enabled, "Kenshi: Migrations are disabled");
        address account = msg.sender;
        uint256 v1Balance = _v1Token.balanceOf(account);
        bool v1Transfer = _v1Token.transferFrom(
            account,
            _v1Recipient,
            v1Balance
        );
        require(v1Transfer, "Kenshi: V1 transferFrom failed");
        bool v2Transfer = _v2Token.transferFrom(
            _v2Provider,
            account,
            v1Balance
        );
        require(v2Transfer, "Kenshi: V2 transferFrom failed");
        uint256 v2Balance = _v2Token.balanceOf(account);
        require(
            v1Balance == v2Balance,
            "Kenshi: Failed to transfer exact amount"
        );
    }
}
