const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const ERC20 = await ethers.getContractFactory("ERC20");
  const erc20 = await ERC20.deploy(
    process.env.TOKEN_SYMBOL,
    process.env.TOKEN_NAME,
    process.env.TOKEN_SUPPLY
  );

  await erc20.deployed();

  console.log("ERC20 token deployed to:", erc20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
