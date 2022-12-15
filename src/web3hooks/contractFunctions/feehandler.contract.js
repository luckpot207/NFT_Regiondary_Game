export const getBLSTAmount = async (web3, contract, amount) => {
  /* eslint-disable */
  const res = await contract.methods
    .getBLSTAmount(Math.floor(Number(amount) * 10 ** 18))
    .call();
  return web3.utils.fromWei(res, "ether");
};

export const getUSDAmount = async (web3, contract, amount) => {
  /* eslint-disable */
  const res = await contract.methods
    .getUSDAmount(Math.floor(Number(amount) * 10 ** 18))
    .call();
  return web3.utils.fromWei(res, "ether");
};

export const getFee = async (contract, index) => {
  const res = await contract.methods.getFee(index).call();
  return res;
};

export const getSummoningPrice = async (web3, contract, amount) => {
  const res = await contract.methods.getSummoningPrice(amount).call();
  return {
    blst: web3.utils.fromWei(res.blstAmount, "ether"),
    busd: web3.utils.fromWei(res.usdAmount, "ether"),
  };
};

export const getTrainingCost = async (web3, contract, amount) => {
  const res = await contract.methods.getTrainingCost(amount).call();
  return {
    busd: web3.utils.fromWei(res[0], "ether"),
    blst: web3.utils.fromWei(res[1], "ether"),
  };
};

export const getCostForAddingWarrior = async (
  web3,
  contract,
  warriorCount,
  supplies
) => {
  const res = await contract.methods
    .getCostForAddingWarrior(warriorCount, supplies)
    .call();
  return {
    busd: web3.utils.fromWei(res[0], "ether"),
    blst: web3.utils.fromWei(res[1], "ether"),
  };
};

export const getSupplyCost = async (web3, contract, warriorCnt, supplyDate) => {
  const res = await contract.methods
    .getSupplyCost(warriorCnt, supplyDate)
    .call();
  return {
    busd: web3.utils.fromWei(res[0], "ether"),
    blst: web3.utils.fromWei(res[1], "ether"),
  };
};
