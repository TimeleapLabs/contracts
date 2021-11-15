const hre = require("hardhat");

async function main() {
  const Kenshi = await hre.ethers.getContractFactory("BEP20Token");
  const kenshi = await Kenshi.deploy();

  await kenshi.deployed();

  console.log("Kenshi deployed to:", kenshi.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
