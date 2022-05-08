const tx = async (tx) => await (await tx).wait();

const setupDEX = async (kenshi, dex) => {
  await kenshi.setIsExcluded(dex.address, true);
  await kenshi.setIsFineFree(dex.address, true);
  await kenshi.setIsLimitless(dex.address, true);

  const totalSupply = await kenshi.totalSupply();
  await tx(kenshi.transfer(dex.address, totalSupply));
};

const setupTreasury = async (kenshi, treasury) => {
  await kenshi.setIsExcluded(treasury.address, true);
  await kenshi.setIsFineFree(treasury.address, true);
  await kenshi.setIsLimitless(treasury.address, true);
  await kenshi.setTreasuryAddr(treasury.address);
};

module.exports = { tx, setupDEX, setupTreasury };
