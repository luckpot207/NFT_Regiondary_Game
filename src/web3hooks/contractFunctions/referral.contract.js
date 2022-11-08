export const getReferrals = async (contract, account) => {
  const res = await contract.methods.getReferrals(account).call();
  return res;
};

export const getComissions = async (contract, account) => {
  const res = await contract.methods.getComissions(account).call();
  return res;
};

export const refer = async (contract, account, referrer) => {
  const res = await contract.methods
    .affiliate(referrer)
    .send({ from: account });
  return res;
};

export const getSummonWarriorsOnFirstDay = async (contract, account) => {
  const res = await contract.methods
    .getSummonedWarriorsOnFirstDay(account)
    .call();
  return res;
};

export const getFreeMintInfo = async (contract, account) => {
  const res = await contract.methods.addressToFreeMintInfo(account).call();
  return res;
};

export const initializeFreeMint = async (contract, account) => {
  const res = await contract.methods
    .initializeFreeMint()
    .send({ from: account });
  return res;
};

export const getAddressToFreeMintGiven = async (contract, account) => {
  const res = await contract.methods.addressToFreeMintGiven(account).call();
  return res;
};
