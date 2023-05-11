require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-contract-sizer");
require("@primitivefi/hardhat-dodoc");
require("@nomicfoundation/hardhat-verify");

const networks = {};

if (process.env.ETHEREUM_RPC_URL) {
  networks.mainnet = { url: process.env.ETHEREUM_RPC_URL };
} else if (process.env.ETHEREUM_GOERLI_RPC_URL) {
  networks.testnet = { url: process.env.ETHEREUM_GOERLI_RPC_URL };
} else if (process.env.ARBITRUM_RPC_URL) {
  networks.mainnet = { url: process.env.ARBITRUM_RPC_URL };
} else if (process.env.ARBITRUM_GOERLI_RPC_URL) {
  networks.testnet = { url: process.env.ARBITRUM_GOERLI_RPC_URL };
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1200,
      },
    },
  },
  ...(Object.keys(networks).length ? { networks } : {}),
  contractSizer: {
    runOnCompile: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
