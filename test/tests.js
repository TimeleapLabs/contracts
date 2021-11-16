const { expect } = require("chai");
const { ethers } = require("hardhat");

const tx = async (tx) => await (await tx).wait();

describe("Kenshi", function () {
  it("Should set minMaxBalance to 0.01 percent of the total supply", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    expect(await kenshi.getMaxBalance()).to.equal(
      "10000000000000000000000000000"
    );
  });

  it("Trading should not work before it's set to open", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();

    const [_owner, addr1] = await ethers.getSigners();

    await kenshi.setDexAddr(_owner.address);

    const transfer = tx(
      kenshi.transfer(addr1.address, "1000000000000000000000000000")
    );

    await expect(transfer).to.be.revertedWith(
      "Kenshi: trading is not open yet"
    );
  });

  it("Reflections should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "9797938144329896907216494"
    );

    await tx(kenshi.transfer(addr2.address, "10000000000000000000000000"));

    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "9897917104986324426677887"
    );
  });

  it("Recover BEP20 should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    await tx(kenshi.connect(addr1).transfer(kenshi.address, "1000000000000"));

    await tx(
      kenshi.recoverBEP20(kenshi.address, addr2.address, "100000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal("96000000000");
  });

  it("Delivering profits should work", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    await tx(kenshi.transfer(addr2.address, "10000000000000000000000000"));
    await tx(kenshi.transfer(addr3.address, "10000000000000000000000000"));

    await tx(kenshi.setTreasuryAddr(addr4.address));
    await tx(kenshi.transfer(addr4.address, "10000000000000000000000000"));
    await tx(
      kenshi.connect(addr4).deliver(await kenshi.balanceOf(addr4.address))
    );

    expect(await kenshi.balanceOf(addr4.address)).to.equal("0");
    expect(await kenshi.balanceOf(addr1.address)).to.equal(
      "13331582988452262808868984"
    );
  });

  it("Early sales should have a fine", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "482926829268292682926829"
    );
  });

  it("Later sales should not have a fine", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    const time = 86400 * 31;
    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine");

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "961943319838056680161943"
    );
  });

  it("Purchasing should weight the tax timestamp on the heavy side", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await tx(kenshi.transfer(addr1.address, "1000000000000000000000000"));

    const time = 86400 * 31;
    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine");

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    await tx(
      kenshi.connect(addr1).transfer(addr2.address, "1000000000000000000000000")
    );

    expect(await kenshi.balanceOf(addr2.address)).to.equal(
      "640887435777673984119570"
    );
  });

  it("Untouched address balances should always increase due reflections", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1, addr2] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));

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

    await tx(kenshi.setDexAddr(_owner.address));

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

    await tx(kenshi.setDexAddr(_owner.address));

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    expect(await kenshi.getTotalBurned()).to.equal("100");

    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));
    expect(await kenshi.getTotalBurned()).to.equal("100");
  });

  it("Should be able to set treasury threshold", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    await kenshi.setTreasuryThreshold("100000000000000000000000");
    const treasuryThreshold = await kenshi.getTreasuryThreshold();

    expect(treasuryThreshold).to.equal("100000000000000000000000");
  });

  it("Should burn 1% of the tx amount", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await tx(kenshi.transfer(addr1.address, "10000000000000000000000000"));

    expect(await kenshi.getTotalBurned()).to.equal("100000000000000000000000");
  });

  it("Transfers equal to min transfer rate should pass", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));

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

    await tx(kenshi.setDexAddr(_owner.address));
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

  it("Transfer from should pass with correct allowance", async function () {
    const Kenshi = await ethers.getContractFactory("BEP20Token");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, addr1] = await ethers.getSigners();

    await tx(kenshi.setDexAddr(_owner.address));
    await kenshi.approve(addr1.address, "100000000000");

    expect(
      tx(kenshi.connect(addr1).transferFrom(_owner.address, addr1.address, "1"))
    ).to.not.be.reverted;
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
});
