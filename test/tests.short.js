const { expect } = require("chai");
const { ethers } = require("hardhat");
const { tx, setupDEX, setupTreasury } = require("./common");

describe("Kenshi (Short)", function () {
  it("Should set minMaxBalance to 1 percent of the total supply", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    expect(await kenshi.getMaxBalance()).to.equal(
      "100000000000000000000000000000"
    );
  });

  it("Trading should not work before it's set to open", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.transfer(addr1.address, "1000000000000000000000000000"));
    const transfer = tx(
      kenshi
        .connect(addr1)
        .transfer(addr2.address, "1000000000000000000000000000")
    );

    await expect(transfer).to.be.revertedWith(
      "Kenshi: Trading is not open yet"
    );
  });

  it("Reflections should work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "9899999999999999999999999"
    );

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "10104123711340206185567010"
    );
  });

  it("Reflections should be friction-less", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, treasury, addr1, addr2, addr3, addr4] =
      await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await setupTreasury(kenshi, treasury);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000000")
    );

    const balance1 = await kenshi.balanceOf(addr1.address);
    const balance2 = await kenshi.balanceOf(addr2.address);
    const treasuryBalance = await kenshi.balanceOf(treasury.address);
    const dexBalance = await kenshi.balanceOf(dex.address);
    const burned = await kenshi.getTotalBurned();
    const total = balance1
      .add(balance2)
      .add(treasuryBalance)
      .add(dexBalance)
      .add(burned);

    /* Note: rounding errors are negligible */
    expect(total).to.equal("9999999999999999999999999999999");
  });

  it("Burning should be tax-free", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    const dead = "0x000000000000000000000000000000000000dead";

    await kenshi.setIsFineFree(dead, true);
    await kenshi.setIsTaxless(dead, true);
    await tx(kenshi.connect(addr1).transfer(dead, "1000000000000000000000000"));

    expect(await kenshi.balanceOf(dead)).to.equal("1100000000000000000000000");
  });

  it("Recovering Kenshi should not work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );
    await tx(kenshi.connect(addr1).transfer(kenshi.address, "1000000000000"));

    expect(
      kenshi.recoverBEP20(kenshi.address, addr2.address, "100000000000")
    ).to.be.revertedWith("Kenshi: Cannot recover Kenshi from the contract");
  });

  it("Delivering profits should work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );
    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000000")
    );
    await tx(
      kenshi.connect(dex).transfer(addr3.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(dex).transfer(addr4.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(addr4).deliver(await kenshi.balanceOf(addr4.address))
    );

    expect(await kenshi.balanceOf(addr4.address)).to.equal("0");
    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "13656085289046831568206607"
    );
  });

  it("Delivering profits should be friction-less", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );
    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000000")
    );
    await tx(
      kenshi.connect(dex).transfer(addr3.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(dex).transfer(addr4.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(addr4).deliver(await kenshi.balanceOf(addr4.address))
    );

    const balance1 = await kenshi.balanceOf(addr1.address);
    const balance2 = await kenshi.balanceOf(addr2.address);
    const balance3 = await kenshi.balanceOf(addr3.address);
    const balance4 = await kenshi.balanceOf(addr4.address);
    const dexBalance = await kenshi.balanceOf(dex.address);
    const burned = await kenshi.getTotalBurned();
    const total = balance1
      .add(balance2)
      .add(balance3)
      .add(balance4)
      .add(dexBalance)
      .add(burned);

    /* Note: rounding errors are negligible */
    expect(total).to.equal("9999999999999999999999999999998");
  });

  it("Max balance should be respected", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    const maxBalance = await kenshi.getMaxBalance();

    expect(
      tx(kenshi.connect(dex).transfer(addr.address, maxBalance.add(1)))
    ).to.be.revertedWith(
      "Kenshi: Resulting balance more than the maximum allowed"
    );
  });

  it("Limitless accounts should not be reverted on more than max balance transfer", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await kenshi.setIsLimitless(addr.address, true);
    const maxBalance = await kenshi.getMaxBalance();

    expect(tx(kenshi.connect(dex).transfer(addr.address, maxBalance.add(1)))).to
      .not.be.reverted;
  });

  it("Shouldn't be able to transfer more than owned", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await tx(kenshi.connect(dex).transfer(addr1.address, "10000000000000000"));

    expect(
      tx(kenshi.connect(addr1).transfer(addr2.address, "10000000000000000"))
    ).to.be.revertedWith("Kenshi: Balance is lower than the requested amount");
  });

  it("Early sales should have a fine", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "486047008547008547008547"
    );
  });

  it("Later sales should not have a fine", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    const time = 86400 * 32;
    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine");

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "953857868020304568527918"
    );
  });

  it("Purchasing should weight the tax timestamp on the heavy side", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "1000000000000000000000000")
    );

    const time = 86400 * 31;
    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine");

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "641826831588962892483349"
    );
  });

  it("Untouched address balances should always increase due to reflections", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "1000000000000000000000000")
    );
    const b1 = await kenshi.balanceOf(addr1.address);

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000")
    );
    const b2 = await kenshi.balanceOf(addr1.address);

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "100000000000000000000")
    );
    const b3 = await kenshi.balanceOf(addr1.address);

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "1000000000000000000000")
    );
    const b4 = await kenshi.balanceOf(addr1.address);

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000")
    );
    const b5 = await kenshi.balanceOf(addr1.address);

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "100000000000000000000000")
    );
    const b6 = await kenshi.balanceOf(addr1.address);

    expect(parseInt(b6)).to.be.greaterThan(parseInt(b5));
    expect(parseInt(b5)).to.be.greaterThan(parseInt(b4));
    expect(parseInt(b4)).to.be.greaterThan(parseInt(b3));
    expect(parseInt(b3)).to.be.greaterThan(parseInt(b2));
    expect(parseInt(b2)).to.be.greaterThan(parseInt(b1));
  });

  it("Max balance should increase as circulation is increased", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, ...signers] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    const maxBalance = await kenshi.getMaxBalance();

    for (const { address } of signers) {
      await tx(
        kenshi.connect(dex).transfer(address, "1000000000000000000000000000")
      );
    }

    const newMaxBalance = await kenshi.getMaxBalance();

    expect(parseInt(newMaxBalance)).to.be.greaterThan(parseInt(maxBalance));
  });

  it("Transfering to DEX should be tax-free", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex] = await ethers.getSigners();

    await tx(kenshi.transfer(dex.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(dex.address)).to.equal(
      "10000000000000000000000000"
    );
  });

  it("50% of total tax should go to the treasury", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, treasury, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await setupTreasury(kenshi, treasury);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    expect(await kenshi.balanceOf(treasury.address)).to.equal(
      "200000000000000000000000"
    );
  });

  it("Should be able to set invest percentage", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setInvestPercentage(10);
    const investPercentage = await kenshi.getInvestPercentage();

    expect(investPercentage).to.equal(10);
  });

  it("Should be able to set base tax percentage", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setBaseTaxPercentage(10);
    const baseTax = await kenshi.getBaseTaxPercentage();

    expect(baseTax).to.equal(10);
  });

  it("Should be able to set burn threshold", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setBurnThreshold("100");
    const burnThreshold = await kenshi.getBurnThreshold();

    expect(burnThreshold).to.equal("100");

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    expect(await kenshi.getTotalBurned()).to.equal("100");

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    expect(await kenshi.getTotalBurned()).to.equal("100");
  });

  it("Should burn 1% of the tx amount", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();
    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    expect(await kenshi.getTotalBurned()).to.equal("100000000000000000000000");
  });

  it("Set excluded should exclude addresses from reflections", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();
    await setupDEX(kenshi, dex);

    await kenshi.setIsExcluded(addr1.address, true);
    const isExcluded = await kenshi.isExcluded(addr1.address);
    expect(isExcluded).to.be.true;

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "9500000000000000000000000"
    );
  });

  it("Get total excluded should work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();
    await setupDEX(kenshi, dex);

    await kenshi.setIsExcluded(addr1.address, true);
    await tx(kenshi.connect(dex).transfer(addr1.address, "10000000000000"));

    const excludedPreTransfer = await kenshi.getTotalExcluded();
    await tx(kenshi.connect(dex).transfer(addr2.address, "1000000000000"));
    const excludedPostTransfer = await kenshi.getTotalExcluded();

    expect(excludedPreTransfer.sub(excludedPostTransfer).toString()).to.equal(
      "990000000000"
    );
  });

  it("Set excluded should not reduce reflections of others", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2, addr3] = await ethers.getSigners();
    await setupDEX(kenshi, dex);

    await kenshi.setIsExcluded(addr1.address, true);

    await tx(
      kenshi.connect(dex).transfer(addr2.address, "10000000000000000000000000")
    );

    await tx(
      kenshi.connect(dex).transfer(addr3.address, "10000000000000000000000000")
    );

    const balance1before = await kenshi.balanceOf(addr1.address);
    const balance2before = await kenshi.balanceOf(addr2.address);
    const balance3before = await kenshi.balanceOf(addr3.address);

    await kenshi.setIsExcluded(addr1.address, false);

    const balance1after = await kenshi.balanceOf(addr1.address);
    const balance2after = await kenshi.balanceOf(addr2.address);
    const balance3after = await kenshi.balanceOf(addr3.address);

    expect(balance1before).to.be.equal(balance1after);
    expect(balance2before).to.be.equal(balance2after);
    expect(balance3before).to.be.equal(balance3after);
  });

  it("Get tax percentage at should work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

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
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await tx(
      kenshi.connect(dex).transfer(addr1.address, "10000000000000000000000000")
    );

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = block.timestamp + 86400 * 31;

    const taxPercentage = await kenshi.getTaxPercentageAt(
      addr1.address,
      timestamp
    );

    expect(taxPercentage).to.equal(5);
  });

  it("Get tax percentage at should work (fine-free)", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await kenshi.setIsFineFree(addr1.address, true);
    await tx(kenshi.connect(dex).transfer(addr1.address, "10000000"));

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = block.timestamp + 86400;

    const taxPercentage = await kenshi.getTaxPercentageAt(
      addr1.address,
      timestamp
    );

    expect(taxPercentage).to.equal(5);
  });

  it("Get tax percentage at should work (tax-free)", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await kenshi.setIsTaxless(addr1.address, true);
    await tx(kenshi.connect(dex).transfer(addr1.address, "10000000"));

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = block.timestamp + 86400;

    const taxPercentage = await kenshi.getTaxPercentageAt(
      addr1.address,
      timestamp
    );

    expect(taxPercentage).to.equal(39);
  });

  it("Transfers equal to min transfer rate should pass", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    const transfer = tx(
      kenshi
        .connect(dex)
        .transfer(addr1.address, "1000000000000000000000000000")
    );

    await expect(transfer).to.not.be.reverted;
  });

  it("DEX transfers should not use the balance coeff", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    const dexBalance = await kenshi.balanceOf(dex.address);
    await tx(
      kenshi
        .connect(dex)
        .transfer(addr1.address, "1000000000000000000000000000")
    );
    const newDexBalance = await kenshi.balanceOf(dex.address);

    expect(BigInt(dexBalance)).to.be.equal(
      BigInt(newDexBalance) + BigInt("1000000000000000000000000000")
    );
  });

  it("Base info should be set correctly on deploy", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
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

  it("Sending BNB to the contract should fail", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
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

  it("Ownership transfer should work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
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
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    expect(
      tx(kenshi.connect(addr1).transferFrom(_owner.address, addr1.address, "1"))
    ).to.be.revertedWith("BEP20: transfer amount exceeds allowance");
  });

  it("Approval and allowance should work", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
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

  it("Transfer from should pass with correct allowance", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1] = await ethers.getSigners();

    await setupDEX(kenshi, dex);
    await kenshi.approve(addr1.address, "100000000000");

    expect(
      kenshi.connect(addr1).transferFrom(_owner.address, addr1.address, "1")
    ).to.not.be.reverted;
  });
});
