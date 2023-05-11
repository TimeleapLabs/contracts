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

| Command                   | Description                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run test`            | Executes the contract tests in the Hardhat environment.                                      |
| `npm run coverage`        | Generates a code coverage report for the smart contracts.                                    |
| `npm run compile`         | Compiles the smart contracts in the Hardhat environment.                                     |
| `npm run size`            | Cleans the build artifacts and recompiles the contracts, allowing you to analyze their size. |
| `npm run scan:myth`       | Analyzes the smart contracts using the MythX tool for security vulnerabilities.              |
| `npm run prescan:myth`    | Compiles the smart contracts in preparation for MythX analysis.                              |
| `npm run scan:slither`    | Analyzes the smart contracts using the Slither tool for security vulnerabilities.            |
| `npm run prescan:slither` | Cleans the build artifacts in preparation for Slither analysis.                              |
| `npm run clean`           | Removes the build artifacts and cache.                                                       |
| `npm run scan`            | Runs both MythX and Slither security analyses on the smart contracts.                        |
| `npm run docgen`          | Generates documentation for the smart contracts using the Hardhat dodoc plugin.              |
| `prettier:check`          | Check if the contracts are formatted according to Prettier.                                  |
| `prettier:fix`            | Automatically format the contracts using Prettier.                                           |

In this project, we use Prettier to enforce a consistent coding style.
Prettier helps keep the code clean and easy to read.

## Development Dependencies

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
  of the contracts. This property is important because Ethereum contracts have
  a maximum size limit.
- `solidity-coverage`: Solidity-coverage is a tool for generating code coverage
  reports for Solidity testing. It helps to ensure that the tests are
  thorough.
- `@nomicfoundation/hardhat-verify`: A Hardhat plugin that allows developers to
  verify their smart contracts on Etherscan. This plugin makes the smart
  contract code available and readable to the public on the Etherscan
  blockchain explorer.
- `solhint`: A linter for Solidity that helps enforce style and security for
  the smart contracts.
- `prettier`: An opinionated code formatter that enforces a consistent style
  by parsing the code and re-printing it. It's used in this project to ensure
  a consistent code style for all Solidity contracts.
