export const getBeastBalance = async (contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return res;
};

export const getAllBeasts = async (contract, account, start, end) => {
  const res = await contract.methods.getAllBeasts(account, start, end).call();
  return res;
};
