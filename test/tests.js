const { expect } = require("chai");
const { ethers } = require("hardhat");

const tx = async (tx) => await (await tx).wait();

describe("Kenshi", function () {
  it("Should set minMaxBalance to 1 percent of the total supply", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    expect(await kenshi.getMaxBalance()).to.equal(
      "100000000000000000000000000000"
    );
  });

  it("Is whitelisted? should return false when Presale addr not set", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    const [_owner, addr1] = await ethers.getSigners();

    expect(await kenshi.isWhitelisted(addr1.address)).to.equal(false);
  });

  it("Trading should not work before it's set to open", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    const Presale = await ethers.getContractFactory("Presale");
    const presale = await Presale.deploy();
    await presale.deployed();

    const [_owner, _addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.setPresaleContractAddr(presale.address);
    await kenshi.renounceOwnership();

    const transfer = tx(
      kenshi.transfer(addr2.address, "1000000000000000000000000000")
    );

    await expect(transfer).to.be.revertedWith(
      "Kenshi: trading is not open yet"
    );
  });

  it("Whitelisting should work (Presale Contract)", async function () {
    const Presale = await ethers.getContractFactory("Presale");
    const presale = await Presale.deploy();
    await presale.deployed();

    const [_owner, _addr1, addr2] = await ethers.getSigners();

    await presale.whitelist(addr2.address);
    await expect(await presale.isWhitelisted(addr2.address)).to.be.equal(true);
  });

  it("Presale trading should work for whitelisted addresses", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    const Presale = await ethers.getContractFactory("Presale");
    const presale = await Presale.deploy();
    await presale.deployed();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.setPresaleContractAddr(presale.address);
    await kenshi.renounceOwnership();

    const transfer = tx(
      kenshi.transfer(addr1.address, "1000000000000000000000000000")
    );

    await expect(transfer).to.be.not.reverted;
  });

  it("Reflections should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "9895833333333333333333333"
    );

    await tx(kenshi.transfer(addr2.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "10097789115646258503401360"
    );
  });

  it("Recovering Kenshi should not work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2, newOwner] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.transferOwnership(newOwner.address);

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    await tx(kenshi.connect(addr1).transfer(kenshi.address, "1000000000000"));

    expect(
      kenshi
        .connect(newOwner)
        .recoverBEP20(kenshi.address, addr2.address, "100000000000")
    ).to.be.revertedWith("Kenshi: Cannot recover Kenshi from the contract");
  });

  it("Delivering profits should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2, addr3, addr4, newOwner] =
      await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.transferOwnership(newOwner.address);

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    await tx(kenshi.transfer(addr2.address, "10000000000000000000000000"));
    await tx(kenshi.transfer(addr3.address, "10000000000000000000000000"));

    await tx(kenshi.connect(newOwner).setTreasuryAddr(addr4.address));
    await tx(kenshi.transfer(addr4.address, "10000000000000000000000000"));
    await tx(
      kenshi.connect(addr4).deliver(await kenshi.balanceOf(addr4.address))
    );

    expect(await kenshi.balanceOf(addr4.address)).to.equal("0");
    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "13600326545271965300441807"
    );
  });

  it("Early sales should have a fine", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "485744456177402323125659"
    );
  });

  it("Later sales should not have a fine", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    const time = 86400 * 32;
    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine");

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "953815261044176706827309"
    );
  });

  it("Purchasing should weight the tax timestamp on the heavy side", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "1000000000000000000000000"));

    const time = 86400 * 31;
    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine");

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "641580432737535277516462"
    );
  });

  it("Untouched address balances should always increase due reflections", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "1000000000000000000000000"));
    const b1 = await kenshi.balanceOf(addr1.address);

    await tx(kenshi.transfer(addr2.address, "10000000000000000000"));
    const b2 = await kenshi.balanceOf(addr1.address);

    await tx(kenshi.transfer(addr2.address, "100000000000000000000"));
    const b3 = await kenshi.balanceOf(addr1.address);

    await tx(kenshi.transfer(addr2.address, "1000000000000000000000"));
    const b4 = await kenshi.balanceOf(addr1.address);

    await tx(kenshi.transfer(addr2.address, "10000000000000000000000"));
    const b5 = await kenshi.balanceOf(addr1.address);

    await tx(kenshi.transfer(addr2.address, "100000000000000000000000"));
    const b6 = await kenshi.balanceOf(addr1.address);

    expect(parseInt(b6)).to.be.greaterThan(parseInt(b5));
    expect(parseInt(b5)).to.be.greaterThan(parseInt(b4));
    expect(parseInt(b4)).to.be.greaterThan(parseInt(b3));
    expect(parseInt(b3)).to.be.greaterThan(parseInt(b2));
    expect(parseInt(b2)).to.be.greaterThan(parseInt(b1));
  });

  it("Max balance should increase as circulation is increased", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, ...signers] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    const maxBalance = await kenshi.getMaxBalance();

    for (const { address } of signers) {
      await tx(kenshi.transfer(address, "1000000000000000000000000000"));
    }

    const newMaxBalance = await kenshi.getMaxBalance();

    expect(parseInt(newMaxBalance)).to.be.greaterThan(parseInt(maxBalance));
  });

  it("Transfering to DEX should be tax-free", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "10000000000000000000000000"
    );
  });

  it("50% of total tax should go to the treasury", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.setTreasuryAddr(addr1.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr2.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "200000000000000000000000"
    );
  });

  it("Should be able to set invest percentage", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setInvestPercentage(10);
    const investPercentage = await kenshi.getInvestPercentage();

    expect(investPercentage).to.equal(10);
  });

  it("Should be able to set base tax percentage", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setBaseTaxPercentage(10);
    const baseTax = await kenshi.getBaseTaxPercentage();

    expect(baseTax).to.equal(10);
  });

  it("Should be able to set burn threshold", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setBurnThreshold("100");
    const burnThreshold = await kenshi.getBurnThreshold();

    expect(burnThreshold).to.equal("100");

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    expect(await kenshi.getTotalBurned()).to.equal("100");

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    expect(await kenshi.getTotalBurned()).to.equal("100");
  });

  it("Should burn 1% of the tx amount", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    expect(await kenshi.getTotalBurned()).to.equal("100000000000000000000000");
  });

  it("Get tax percentage at should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = block.timestamp + 86400;

    const taxPercentage = await kenshi.getTaxPercentageAt(
      addr1.address,
      timestamp
    );

    expect(taxPercentage).to.equal(44);
  });

  it("Get tax percentage at should work (+30 days)", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = block.timestamp + 86400 * 31;

    const taxPercentage = await kenshi.getTaxPercentageAt(
      addr1.address,
      timestamp
    );

    expect(taxPercentage).to.equal(5);
  });

  it("Get tax percentage at should work (excluded)", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(addr1.address);
    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = block.timestamp + 86400;

    const taxPercentage = await kenshi.getTaxPercentageAt(
      addr1.address,
      timestamp
    );

    expect(taxPercentage).to.equal(5);
  });

  it("Transfers equal to min transfer rate should pass", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    const transfer = tx(
      kenshi.transfer(addr1.address, "1000000000000000000000000000")
    );

    await expect(transfer).to.not.be.reverted;
  });

  it("DEX transfers should not use the balance coeff", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.renounceOwnership();

    const dexBalance = await kenshi.balanceOf(_owner.address);
    await tx(kenshi.transfer(addr1.address, "1000000000000000000000000000"));
    const newDexBalance = await kenshi.balanceOf(_owner.address);

    expect(BigInt(dexBalance)).to.be.equal(
      BigInt(newDexBalance) + BigInt("1000000000000000000000000000")
    );
  });

  it("Base info should be set correctly on deploy", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner] = await ethers.getSigners();

    expect(await kenshi.getOwner()).to.be.equal(_owner.address);
    expect(await kenshi.decimals()).to.be.equal(18);
    expect(await kenshi.symbol()).to.be.equal("KENSHI");
    expect(await kenshi.name()).to.be.equal("Kenshi");
    expect(await kenshi.getCirculation()).to.be.equal(0);
    expect(await kenshi.totalSupply()).to.be.equal(
      "10000000000000000000000000000000"
    );
  });

  it("Ownership transfer should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.transferOwnership(addr1.address);
    expect(await kenshi.getOwner()).to.be.equal(addr1.address);

    await kenshi.connect(addr1).renounceOwnership();
    expect(await kenshi.getOwner()).to.be.equal(
      "0x0000000000000000000000000000000000000000"
    );
  });

  it("Transfer from should fail without allowance", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    expect(
      tx(kenshi.connect(addr1).transferFrom(_owner.address, addr1.address, "1"))
    ).to.be.revertedWith("BEP20: transfer amount exceeds allowance");
  });

  it("Transfer from should pass with correct allowance", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.approve(addr1.address, "100000000000");

    expect(
      kenshi.connect(addr1).transferFrom(_owner.address, addr1.address, "1")
    ).to.not.be.reverted;
  });

  it("Set DEX addr should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    expect(await kenshi.getDexAddr()).to.be.equal(_owner.address);
  });

  it("Set DEX router addr should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner] = await ethers.getSigners();

    await kenshi.setDexRouterAddr(_owner.address);
    expect(await kenshi.getDexRouterAddr()).to.be.equal(_owner.address);
  });

  it("Transfers from router should be tax-free", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);
    await kenshi.setDexRouterAddr(addr1.address);
    await kenshi.renounceOwnership();

    await tx(kenshi.transfer(addr1.address, "1000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.be.equal("1000000000000");
  });

  it("Approval and allowance should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.approve(addr1.address, "100000000000");
    expect(await kenshi.allowance(_owner.address, addr1.address)).to.be.equal(
      "100000000000"
    );

    await kenshi.increaseAllowance(addr1.address, "100000000000");
    expect(await kenshi.allowance(_owner.address, addr1.address)).to.be.equal(
      "200000000000"
    );

    await kenshi.decreaseAllowance(addr1.address, "100000000000");
    expect(await kenshi.allowance(_owner.address, addr1.address)).to.be.equal(
      "100000000000"
    );
  });

  it("Sending BNB to the contract should fail", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner] = await ethers.getSigners();

    const tx = _owner.sendTransaction({
      to: kenshi.address,
      value: ethers.utils.parseEther("1.0"),
    });

    expect(tx).to.be.reverted;
  });
});
