//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERC20
 * @notice This is a basic implementation of the ERC20 protocol.
 * It includes an ownable feature, which allows for a recovery mechanism
 * for tokens that are accidentally sent to the contract address.
 * Only the owner of the contract can retrieve these tokens to prevent
 * unauthorized access.
 * @dev See https://eips.ethereum.org/EIPS/eip-20 for details
 */
contract ERC20 is Context, IERC20, Ownable {
    /* ERC20 related */

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string private _symbol;
    string private _name;

    uint8 private constant _DECIMALS = 18;
    uint256 private immutable _TOTAL_SUPPLY;

    /**
     * @notice Constructor to set the initial state of the contract.
     * @dev Set the name, symbol, and total supply of the token.
     * Also assigns total supply to the contract creator.
     * @param symbol_ The symbol of the token.
     * @param name_ The name of the token.
     * @param supply_ The initial supply of the token.
     */
    constructor(string memory symbol_, string memory name_, uint256 supply_) {
        _name = name_;
        _symbol = symbol_;
        _TOTAL_SUPPLY = supply_ * 10 ** _DECIMALS;
        _balances[msg.sender] = _TOTAL_SUPPLY;
        emit Transfer(address(0), msg.sender, _TOTAL_SUPPLY);
    }

    /**
     * @dev Returns the contract owner.
     * @return Returns the address of the current owner.
     */
    function getOwner() external view returns (address) {
        return owner();
    }

    /**
     * @dev Returns the token decimals.
     * @return Returns the number of decimals the token uses.
     */
    function decimals() external pure returns (uint8) {
        return _DECIMALS;
    }

    /**
     * @dev Returns the token symbol.
     * @return Returns the symbol of the token.
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the token name.
     * @return Returns the name of the token.
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * @dev See {ERC20-totalSupply}.
     * @return Returns the total token supply.
     */
    function totalSupply() external view returns (uint256) {
        return _TOTAL_SUPPLY;
    }

    /**
     * @dev See {ERC20-balanceOf}.
     * @param account The address of the account to check the balance of.
     * @return Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {ERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     *
     * @param recipient The address of the recipient to transfer tokens to.
     * @param amount The amount of tokens to transfer.
     * @return Returns a boolean value indicating whether the operation
     * succeeded.
     */
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {ERC20-allowance}.
     * @param addr The address of the account owning tokens.
     * @param spender The address of the account spending tokens.
     * @return Returns the remaining amount of tokens that `spender` will
     * be allowed to spend on behalf of `addr`.
     */
    function allowance(
        address addr,
        address spender
    ) external view returns (uint256) {
        return _allowances[addr][spender];
    }

    /**
     * @dev See {ERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     *
     * @param spender The address of the account allowed to spend tokens.
     * @param amount The amount of tokens the spender is allowed to spend.
     * @return Returns a boolean value indicating whether the operation
     * succeeded.
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {ERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20};
     *
     * Requirements:
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for `sender`'s tokens of at least
     * `amount`.
     *
     * @param sender The address of the account sending tokens.
     * @param recipient The address of the account receiving tokens.
     * @param amount The amount of tokens to transfer.
     * @return Returns a boolean value indicating whether the operation
     * succeeded.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        require(
            _allowances[sender][_msgSender()] >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            _allowances[sender][_msgSender()] - amount
        );
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {ERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     *
     * @param spender The address of the account allowed to spend tokens.
     * @param addedValue The amount of tokens to increase the allowance by.
     * @return Returns a boolean value indicating whether the operation
     * succeeded.
     */
    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) external returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender] + addedValue
        );
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the
     * caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {ERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     *
     * @param spender The address of the account allowed to spend tokens.
     * @param subtractedValue The amount of tokens to decrease the
     * allowance by.
     * @return Returns a boolean value indicating whether the operation
     * succeeded.
     */
    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) external returns (bool) {
        require(
            _allowances[_msgSender()][spender] > subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender] - subtractedValue
        );
        return true;
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     *
     * @param sender The address of the account sending tokens.
     * @param recipient The address of the account receiving tokens.
     * @param amount The amount of tokens to transfer.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(
            _balances[sender] >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        unchecked {
            _balances[sender] -= amount;
            _balances[recipient] += amount;
        }

        emit Transfer(sender, recipient, amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `addr`s tokens.
     *
     * This is internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     *
     * @param addr The address of the account owning tokens.
     * @param spender The address of the account allowed to spend tokens.
     * @param amount The amount of tokens the spender is allowed to spend.
     */
    function _approve(address addr, address spender, uint256 amount) internal {
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[addr][spender] = amount;
        emit Approval(addr, spender, amount);
    }

    /**
     * @dev Sends `amount` of ERC20 `token` from contract address
     * to `recipient`
     *
     * Useful if someone sent ERC20 tokens to the contract address by mistake.
     *
     * @param token The address of the ERC20 token contract.
     * @param recipient The address to which the tokens should be transferred.
     * @param amount The amount of tokens to transfer.
     * @return Returns a boolean value indicating whether the operation
     * succeeded.
     */
    function recoverERC20(
        address token,
        address recipient,
        uint256 amount
    ) external onlyOwner returns (bool) {
        return IERC20(token).transfer(recipient, amount);
    }
}
