//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/*
 * @dev Provides presale and white-listing functionality.
 */
contract Presale {
    mapping(address => bool) private _whitelist;
    address private _owner;

    constructor() {
        _whitelist[address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8)] = true;
        _owner = msg.sender;
    }

    /**
     * @dev Adds `addr` to whitelisted IDO presale addresses.
     */
    function whitelist(address addr) external {
        require(msg.sender == _owner);
        require(addr != address(0), "Kenshi: cannot whitelist 0x0");
        _whitelist[addr] = true;
    }

    /**
     * @dev Checks if `addr` is whitelisted for IDO presale.
     */
    function isWhitelisted(address addr) external view returns (bool) {
        return _whitelist[addr];
    }
}
