const { expect } = require("chai");
const { ethers } = require("hardhat");
const { tx, setupDEX, setupTreasury } = require("./common");

describe("Kenshi (Long)", function () {
  it("The big friction test!", async function () {
    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, ...rest] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await kenshi.setIsExcluded(rest[4].address, true);

    for (const addr of rest) {
      await tx(
        kenshi.connect(dex).transfer(addr.address, "10000000000000000000000000")
      );
    }

    let times = 24;
    const amount = "100000000000000000000000";

    while (times--) {
      const senders = rest
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      const recipients = rest
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      for (const index in senders) {
        const sender = senders[index];
        const recipient = recipients[index];
        if (sender.address === recipient.address) continue;
        if ((await kenshi.balanceOf(sender.address)).lt(amount)) continue;
        await tx(kenshi.connect(sender).transfer(recipient.address, amount));
      }
    }

    const balances = await Promise.all(
      rest.map((addr) => kenshi.balanceOf(addr.address))
    );
    const addrBalances = balances.reduce((a, b) => a.add(b));
    const dexBalance = await kenshi.balanceOf(dex.address);
    const burned = await kenshi.getTotalBurned();
    const total = addrBalances.add(dexBalance).add(burned);

    /* Note: rounding errors are negligible */
    expect(total.gt("9999999999999999999999999999990")).to.be.true;
  });

  it("Coeff shouldn't get lower than the minimum defined", async function () {
    this.timeout(600000);

    const Kenshi = await ethers.getContractFactory("Kenshi");
    const kenshi = await Kenshi.deploy();
    await kenshi.deployed();
    await kenshi.openTrades();

    const [_owner, dex, addr1, addr2] = await ethers.getSigners();

    await setupDEX(kenshi, dex);

    await kenshi.setIsLimitless(addr1.address, true);
    await kenshi.setIsLimitless(addr2.address, true);

    const notEmpty = async (addr) =>
      (await kenshi.balanceOf(addr.address)).gt("0");

    let isNotEmpty = true;

    while (isNotEmpty) {
      await tx(
        kenshi
          .connect(dex)
          .transfer(addr1.address, "10000000000000000000000000000")
      );
      await tx(
        kenshi
          .connect(dex)
          .transfer(addr2.address, "10000000000000000000000000000")
      );
      isNotEmpty = await notEmpty(dex);
    }

    let maxLoops = 10000;
    const amount = "100000000000000000000000000000";

    while (maxLoops-- && ((await notEmpty(addr1)) || (await notEmpty(addr2)))) {
      const [sender, recipient] =
        Math.random() > 0.5 ? [addr1, addr2] : [addr2, addr1];

      const senderBalance = await kenshi.balanceOf(sender.address);
      if (senderBalance.lt(amount)) continue;
      await tx(kenshi.connect(sender).transfer(recipient.address, amount));
    }

    const coeff = await kenshi.getCurrentCoeff();

    expect(coeff.gt("1000000000000000000")).to.be.true;

    /* Check for friction */

    const balance1 = await kenshi.balanceOf(addr1.address);
    const balance2 = await kenshi.balanceOf(addr2.address);
    const dexBalance = await kenshi.balanceOf(dex.address);
    const burned = await kenshi.getTotalBurned();
    const total = balance1.add(balance2).add(dexBalance).add(burned);

    /* Note: allowing 0.0000000000001% friction */
    expect(total.gt("9999999999999900000000000000000")).to.be.true;
  });
});
