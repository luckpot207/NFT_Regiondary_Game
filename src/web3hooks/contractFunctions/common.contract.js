import gameConfig from "../../config/game.config";

export const getBloodstoneAllowance = async (
  web3,
  contract,
  approveContract,
  account
) => {
  const res = await contract.methods.allowance(account, approveContract).call();
  return web3.utils.fromWei(res, "ether");
};

export const setBloodstoneApprove = async (
  web3,
  contract,
  approveContract,
  account
) => {
  const res = await contract.methods
    .approve(
      approveContract,
      web3.utils.toWei(gameConfig.approveBLSTForBeast, "ether").toString()
    )
    .send({ from: account });
  return res;
};

export const initialMintBeastAndWarrior = async (
  contract,
  account,
  amount,
  fromWhichWallet
) => {
  const response = await contract.methods
    .initializeMint(amount, fromWhichWallet)
    .send({ from: account });
  return response;
};

export const revealBeastsAndWarrior = async (contract, account) => {
  return await contract.methods.mint().send({ from: account });
};

export const execute = async (contract, account, ids) => {
  const res = await contract.methods.execute(ids).send({ from: account });
  return res;
};

export const isApprovedForAll = async (contract, account, approvalContract) => {
  const res = await contract.methods
    .isApprovedForAll(account, approvalContract)
    .call();
  return res;
};

export const setApprovalForAll = async (
  account,
  contract,
  approvalContract,
  status
) => {
  const res = await contract.methods
    .setApprovalForAll(approvalContract, status)
    .send({ from: account });
  return res;
};

export const getWalletMintPending = async (contract, account) => {
  return await contract.methods.walletMintPending(account).call();
};

export const getMintRequestId = async (contract, account) => {
  return await contract.methods.walletLastRequestId(account).call();
};

export const getWalletHuntPending = async (contract, account) => {
  return await contract.methods.walletHuntPending(account).call();
};

export const getHuntRequestId = async (contract, account) => {
  return await contract.methods.walletLastHuntRequestId(account).call();
};

export const getWalletMassHuntPending = async (contract, account) => {
  return await contract.methods.walletMassHuntPending(account).call();
};

export const getMassHuntRequestId = async (contract, account) => {
  return await contract.methods.walletLastMassHuntRequestId(account).call();
};
