# Kenshi Token Smart Contract

This repository contains the source code for the Kenshi token smart contract.

- [x] Fully documented and commented
- [x] Unit tests
- [x] 100% coverage

## Specification

The ERC20 token is a standard interface for tokens used in the Ethereum
ecosystem. It defines a definitive list of rules an Ethereum token must
implement, allowing developers to program how new tokens will function within
the Ethereum ecosystem.

The ERC20 token standard provides basic functionality to transfer tokens and
allows tokens to be approved so another on-chain third party can spend them.

This standard is widely adopted and supported by many wallets and exchanges,
enabling interoperability between tokens that follow the norm.

For a complete and detailed specification of the ERC20 token, please refer to
the official Ethereum Improvement Proposal (EIP) document at
[EIP-20](https://eips.ethereum.org/EIPS/eip-20).

## Documentation

- See [docs/usage.md](docs/usage.md) for basic usage instructions.
- See [docs/ERC20.md](docs/ERC20.md) or
  [contracts/ERC20.sol](contracts/ERC20.sol) for developer documentation.

## Available Commands

| Command           | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `test`            | Executes the contract tests in the Hardhat environment.                                      |
| `coverage`        | Generates a code coverage report for your smart contracts.                                   |
| `compile`         | Compiles your smart contracts in the Hardhat environment.                                    |
| `size`            | Cleans the build artifacts and recompiles the contracts, allowing you to analyze their size. |
| `scan:myth`       | Analyzes your smart contracts using the MythX tool for security vulnerabilities.             |
| `prescan:myth`    | Compiles your smart contracts in preparation for MythX analysis.                             |
| `scan:slither`    | Analyzes your smart contracts using the Slither tool for security vulnerabilities.           |
| `prescan:slither` | Cleans the build artifacts in preparation for Slither analysis.                              |
| `clean`           | Removes the build artifacts and cache.                                                       |
| `scan`            | Runs both MythX and Slither security analyses on your smart contracts.                       |
| `docgen`          | Generates documentation for your smart contracts using the Hardhat dodoc plugin.             |

## Libraries Used

- `hardhat`: Hardhat is an Ethereum development environment. It helps
  developers manage and automate recurring tasks like compilation, testing,
  and deploying smart contracts.
- `@nomiclabs/hardhat-ethers`: This is a Hardhat plugin that brings Ethers.js
  into the Hardhat environment, making it easy to interact with Ethereum during
  development and testing.
- `@nomiclabs/hardhat-waffle`: This is a Hardhat plugin for the Ethereum Waffle
  testing library. Waffle simplifies writing and executing tests against smart
  contracts.
- `chai`: Chai is a popular assertion library for JavaScript and Node.js, often
  used with testing frameworks like Mocha, Jest, or Waffle.
- `ethereum-waffle`: Ethereum Waffle is a library for writing and testing smart
  contracts. It provides a set of matchers for Chai, making writing assertions
  about contract states easy.
- `ethers`: Ethers.js is a complete and compact library for interacting with
  the Ethereum blockchain and its ecosystem. It allows you to generate wallets,
  interact with smart contracts, and more.
- `hardhat-contract-sizer`: This is a Hardhat plugin used for checking the size
  of your contracts. This property is important because Ethereum contracts have
  a maximum size limit.
- `solidity-coverage`: Solidity-coverage is a tool for generating code coverage
  reports for Solidity testing. It helps to ensure that your tests are
  thorough.
