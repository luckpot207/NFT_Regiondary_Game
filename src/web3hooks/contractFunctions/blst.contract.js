export const getBloodstoneBalance = async (web3, contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getBuyTotalFees = async (contract) => {
  const res = await contract.methods.buyTotalFees().call();
  return res;
};

export const getSellTotalFees = async (contract) => {
  const res = await contract.methods.sellTotalFees().call();
  return res;
};
