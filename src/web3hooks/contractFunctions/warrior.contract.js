export const getWarriorBalance = async (contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return res;
};

export const getAllWarriors = async (contract, account, start, end) => {
  const res = await contract.methods.getAllWarriors(account, start, end).call();
  return res;
};
