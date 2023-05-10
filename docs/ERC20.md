# ERC20



> ERC20

This is a basic implementation of the ERC20 protocol. It includes an ownable feature, which allows for a recovery mechanism for tokens that are accidentally sent to the contract address. Only the owner of the contract can retrieve these tokens to prevent unauthorized access.

*See https://eips.ethereum.org/EIPS/eip-20 for details*

## Methods

### allowance

```solidity
function allowance(address addr, address spender) external view returns (uint256)
```



*See {ERC20-allowance}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| addr | address | The address of the account owning tokens. |
| spender | address | The address of the account spending tokens. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Returns the remaining amount of tokens that `spender` will be allowed to spend on behalf of `addr`. |

### approve

```solidity
function approve(address spender, uint256 amount) external nonpayable returns (bool)
```



*See {ERC20-approve}. Requirements: - `spender` cannot be the zero address.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | The address of the account allowed to spend tokens. |
| amount | uint256 | The amount of tokens the spender is allowed to spend. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns a boolean value indicating whether the operation succeeded. |

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```



*See {ERC20-balanceOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The address of the account to check the balance of. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Returns the amount of tokens owned by `account`. |

### decimals

```solidity
function decimals() external pure returns (uint8)
```



*Returns the token decimals.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | Returns the number of decimals the token uses. |

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) external nonpayable returns (bool)
```



*Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {ERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | The address of the account allowed to spend tokens. |
| subtractedValue | uint256 | The amount of tokens to decrease the allowance by. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns a boolean value indicating whether the operation succeeded. |

### getOwner

```solidity
function getOwner() external view returns (address)
```



*Returns the contract owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | Returns the address of the current owner. |

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) external nonpayable returns (bool)
```



*Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {ERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | The address of the account allowed to spend tokens. |
| addedValue | uint256 | The amount of tokens to increase the allowance by. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns a boolean value indicating whether the operation succeeded. |

### name

```solidity
function name() external view returns (string)
```



*Returns the token name.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | Returns the name of the token. |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### recoverERC20

```solidity
function recoverERC20(address token, address recipient, uint256 amount) external nonpayable returns (bool)
```



*Sends `amount` of ERC20 `token` from contract address to `recipient` Useful if someone sent ERC20 tokens to the contract address by mistake.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | The address of the ERC20 token contract. |
| recipient | address | The address to which the tokens should be transferred. |
| amount | uint256 | The amount of tokens to transfer. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns a boolean value indicating whether the operation succeeded. |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### symbol

```solidity
function symbol() external view returns (string)
```



*Returns the token symbol.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | Returns the symbol of the token. |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*See {ERC20-totalSupply}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Returns the total token supply. |

### transfer

```solidity
function transfer(address recipient, uint256 amount) external nonpayable returns (bool)
```



*See {ERC20-transfer}. Requirements: - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| recipient | address | The address of the recipient to transfer tokens to. |
| amount | uint256 | The amount of tokens to transfer. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns a boolean value indicating whether the operation succeeded. |

### transferFrom

```solidity
function transferFrom(address sender, address recipient, uint256 amount) external nonpayable returns (bool)
```



*See {ERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}; Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`&#39;s tokens of at least `amount`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| sender | address | The address of the account sending tokens. |
| recipient | address | The address of the account receiving tokens. |
| amount | uint256 | The amount of tokens to transfer. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns a boolean value indicating whether the operation succeeded. |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```



*Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| spender `indexed` | address | undefined |
| value  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```



*Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| value  | uint256 | undefined |



