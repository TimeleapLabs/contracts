![Contracts CI](https://github.com/KenshiTech/contracts/actions/workflows/main.yml/badge.svg)
![Snyk](https://snyk.io/test/github/KenshiTech/contracts/badge.svg)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a1d35b2f9c6f4388b355e5b4a765495a)](https://app.codacy.com/gh/KenshiTech/contracts/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/a1d35b2f9c6f4388b355e5b4a765495a)](https://app.codacy.com/gh/KenshiTech/contracts/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

# Kenshi ERC20 Token Implementation

<img src="https://kenshi.io/images/logo/logo.svg" alt="Kenshi" width="128">

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

- See [docs/requirements.md](docs/requirements.md) for functional and technical requirements.
- See [docs/usage.md](docs/usage.md) for basic usage instructions.
- See [docs/Kenshi.md](docs/Kenshi.md) or
  [contracts/Kenshi.sol](contracts/Kenshi.sol) for developer documentation.

## Available Commands

| Command                   | Description                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `npm install`             | Installs the project dependencies.                                                           |
| `npm run test`            | Executes the contract tests in the Hardhat environment.                                      |
| `npm run coverage`        | Generates a code coverage report for the smart contracts.                                    |
| `npm run compile`         | Compiles the smart contracts in the Hardhat environment.                                     |
| `npm run size`            | Cleans the build artifacts and recompiles the contracts, allowing you to analyze their size. |
| `npm run scan:slither`    | Analyzes the smart contracts using the Slither tool for security vulnerabilities.            |
| `npm run prescan:slither` | Cleans the build artifacts in preparation for Slither analysis.                              |
| `npm run clean`           | Removes the build artifacts and cache.                                                       |
| `npm run scan`            | Runs the `scan:slither` command.                                                             |
| `npm run docgen`          | Generates documentation for the smart contracts using the Hardhat dodoc plugin.              |
| `npm run deploy`          | Deploys the token to the selected network.                                                   |
| `npm run prettier:check`  | Check if the contracts are formatted according to Prettier.                                  |
| `npm run prettier:fix`    | Automatically format the contracts using Prettier.                                           |

In this project, we use Prettier to enforce a consistent coding style.
Prettier helps keep the code clean and easy to read.

### Deploying Instructions

Duplicate the `.env.example` file and rename it to `.env`, then fill in the
missing values based on the following table:

| Variable            | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `PRIVATE_KEY`       | Private key to use for deployment, in hex format. Must have enough gas. |
| `ETHERSCAN_API_KEY` | Etherscan API key (to verify the contracts)                             |
| `RPC_URL`           | RPC URL of the network you are deploying to                             |
| `TOKEN_SUPPLY`      | Total supply of the token to deploy                                     |

Then run the `deploy` and, optionally the `verify` command:

```
npm run deploy
npm run verify
```

## Project Structure

This repository is a Hardhat JavaScript project with the following structure:

| Directory                 | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| [.github](./.github/)     | GitHub Actions workflow to run tests on push and pull request.    |
| [contracts](./contracts/) | The Kenshi ERC20 token contract in Solidity.                      |
| [docs](./docs/)           | Technical and practical guides and documentation.                 |
| [scripts](./scripts/)     | Scripts to help with development and deployment of the contracts. |
| [test](./test/)           | Unit tests for the Kesnhi ERC20 token contract.                   |

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

## Security Scans

To run the security scans, you need to have Python installed. Install the
dependencies with the following commands:

```bash
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

Then run the `npm run scan` command. Once done, you can deactivate the Python venv:

```bash
deactivate
```
