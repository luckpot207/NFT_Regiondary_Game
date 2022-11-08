import gameConfig from "../../config/game.config";

const { approveBUSDForLegion } = gameConfig;
export const getBUSDBalance = async (web3, contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getLegionBUSDAllowance = async (
  web3,
  contract,
  approvalContract,
  account
) => {
  const response = await contract.methods
    .allowance(account, approvalContract)
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const setBUSDApprove = async (
  web3,
  contract,
  approvalContract,
  account
) => {
  const res = await contract.methods
    .approve(
      approvalContract,
      web3.utils.toWei(approveBUSDForLegion, "ether").toString()
    )
    .send({ from: account });
  return res;
};
