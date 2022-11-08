export const sellToken = async (web3, contract, account, type, id, price) => {
  const res = await contract.methods
    .sellToken(type, id, web3.utils.toWei(price, "ether"))
    .send({ from: account });
  return res;
};

export const getAllBeastMarketItems = async (contract, start, end) => {
  const res = await contract.methods.getAllBeastItems(start, end).call();
  return res;
};

export const getAllWarriorMarketItems = async (contract, start, end) => {
  const res = await contract.methods.getAllWarriorItems(start, end).call();
  return res;
};

export const getAllLegionMarketItems = async (contract, start, end) => {
  const res = await contract.methods.getAllLegionItems(start, end).call();
  return res;
};

export const cancelMarketplace = async (contract, account, type, id) => {
  const res = await contract.methods
    .cancelSelling(type, id)
    .send({ from: account });
  return res;
};

export const buyToken = async (web3, contract, account, type, id, price) => {
  console.log(
    account,
    type,
    id,
    price,
    web3.utils.toWei(price.toString(), "ether")
  );
  const res = await contract.methods
    .buyToken(type, id, web3.utils.toWei(price.toString(), "ether"))
    .send({ from: account });
  return res;
};

export const updatePrice = async (web3, contract, account, type, id, price) => {
  console.log(account, type, id, price);
  const res = await contract.methods
    .updatePrice(type, id, web3.utils.toWei(price, "ether"))
    .send({ from: account });
  return res;
};
