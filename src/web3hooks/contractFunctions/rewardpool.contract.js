export const getUnclaimedWallet = async (contract, account) => {
  const res = await contract.methods.getUnclaimedWallet(account).call();
  return { unclaimedUSD: res[0], unclaimedBLST: res[1] };
};

export const getClaimedUSD = async (contract, account) => {
  const res = await contract.methods.claimedUSD(account).call();
  return res;
};

export const claimToWallet = async (web3, contract, account, usdAmount) => {
  const res = await contract.methods
    .claimToWallet(usdAmount)
    .send({ from: account });
  return res;
};

export const lastClaimedTime = async (contract, account) => {
  const res = await contract.methods.lastClaimedTime(account).call();
  return res;
};

export const getTaxLeftDays = async (contract, account) => {
  const res = await contract.methods.getTaxLeftDays(account).call();
  return res;
};

export const getReinvestedWalletBalanceInUSD = async (
  web3,
  contract,
  account
) => {
  const res = await contract.methods.reinvestedWallet(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getReinvestedTotalUSD = async (web3, contract, account) => {
  const res = await contract.methods.reinvestedTotalUSD(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getTotalClaimedUSD = async (web3, contract, account) => {
  const res = await contract.methods.totalClaimedUSD(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getAdditionalInvestmentUSD = async (web3, contract, account) => {
  const res = await contract.methods.additionalInvestmentUSD(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getStartupInvestment = async (web3, contract, account) => {
  const res = await contract.methods.startupInvestment(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getClaimMaxTaxPercent = async (contract, samaritanStars) => {
  const res = await contract.methods.claimMaxTaxPercent(samaritanStars).call();
  return res;
};

export const getClaimMinTaxPercent = async (contract, samaritanStars) => {
  const res = await contract.methods.claimMinTaxPercent(samaritanStars).call();
  return res;
};

export const getReinvestTaxPercent = async (contract, samaritanStars) => {
  const res = await contract.methods.reinvestTaxPercent(samaritanStars).call();
  return res;
};

export const getReinvestTimesInTaxCycle = async (contract, account) => {
  const res = await contract.methods.reinvestTimesInTaxCycle(account).call();
  return res;
};

export const getCurrentReinvestPercent = async (contract, account) => {
  const res = await contract.methods.getCurrentReinvestPercent(account).call();
  return res;
};

export const getCurrentTaxCycleStars = async (contract, account) => {
  const res = await contract.methods.getCurrentTaxCycleStars(account).call();
  return res;
};

export const getReinvestPercent = async (
  contract,
  account,
  reinvest,
  reinvestingTotalUSD
) => {
  const res = await contract.methods
    .getReinvestPercent(account, reinvest, reinvestingTotalUSD)
    .call();
  return res;
};

export const getSamaritanStars = async (contract, account, reinvestPercent) => {
  const res = await contract.methods
    .getSamaritanStars(account, reinvestPercent)
    .call();
  return res;
};

export const getFirstHuntTime = async (contract, account) => {
  const res = await contract.methods.firstHuntTime(account).call();
  return res;
};

export const getAmountsForClaimingAndReinvesting = async (
  web3,
  contract,
  account,
  reinvest,
  reinvestingUSD
) => {
  const res = await contract.methods
    .getAmountsForClaimingAndReinvesting(account, reinvest, reinvestingUSD)
    .call();
  return res;
};

export const claimAndReinvest = async (
  web3,
  contract,
  account,
  reinvest,
  reinvestingInputUSD
) => {
  console.log(
    "reinvesting input usd: ",
    reinvestingInputUSD,
    typeof reinvestingInputUSD,
    reinvest
  );
  const res = await contract.methods
    .claimAndReinvest(reinvest, reinvestingInputUSD)
    .send({ from: account });
  return res;
};

export const getVoucherWalletUSDBalance = async (web3, contract, account) => {
  const res = await contract.methods.voucherWallet(account).call();
  return web3.utils.fromWei(res, "ether");
};
