require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-contract-sizer");
require("@primitivefi/hardhat-dodoc");
require("@nomicfoundation/hardhat-verify");

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
  networks: {
    ethereum_mainnet: {
      url: process.env.ETHEREUM_RPC_URL,
    },
    ethereum_goerli: {
      url: process.env.ETHEREUM_GOERLI_RPC_URL,
    },
    arbitrum_mainnet: {
      url: process.env.ARBITRUM_RPC_URL,
    },
    arbitrum_goerli: {
      url: process.env.ARBITRUM_GOERLI_RPC_URL,
    },
  },
  contractSizer: {
    runOnCompile: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
