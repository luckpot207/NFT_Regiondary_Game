export const createDuel = async (
  contract,
  account,
  legionId,
  tokenPrice,
  standard
) => {
  const res = await contract.methods
    .createDuel(legionId, tokenPrice.toString(), standard)
    .send({ from: account });
  return res;
};

export const cancelDuel = async (contract, account, duelId) => {
  const res = await contract.methods.cancelDuel(duelId).send({ from: account });
  return res;
};

export const joinDuel = async (
  contract,
  account,
  duelId,
  legionId,
  tokenPrice
) => {
  const res = await contract.methods
    .joinDuel(duelId, legionId, tokenPrice.toString())
    .send({ from: account });
  return res;
};

export const updatePrediction = async (contract, account, duelId, price) => {
  const res = await contract.methods
    .updatePrediction(duelId, price.toString())
    .send({ from: account });
};

export const duels = async (contract, count) => {
  const res = await contract.methods.duels(count).call();
  return res;
};

export const duelCounter = async (contract) => {
  const res = await contract.methods.duelCounter().call();
  return res;
};

export const doingDuels = async (contract, duelId) => {
  const res = await contract.methods.doingDuels(duelId).call();
  return res;
};

export const getAllDuels = async (contract) => {
  const res = await contract.methods.getAllDuels().call();
  return res;
};
