import { getLegionJpgImageUrl, getLegionMp4ImageUrl } from "../../utils/utils";

export const getLegion = async (contract, tokenId) => {
  const res = await contract.methods.getLegion(tokenId).call();
  return {
    id: tokenId,
    name: res[0],
    beastIds: res[1],
    warriorIds: res[2],
    supplies: Number(res[3]),
    attackPower: Number(res[4]),
    lastHuntTime: Number(res[5]),
    huntStatus: Boolean(res[6]),
    jpg: getLegionJpgImageUrl(parseFloat(res[4])),
    gif: getLegionMp4ImageUrl(parseFloat(res[4])),
  };
};

export const getLegionBalance = async (contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return res;
};

export const getAllLegions = async (contract, account, start, end) => {
  const res = await contract.methods.getAllLegions(account, start, end).call();
  return res;
};

export const getAvailableLegionsCount = async (contract, account) => {
  const res = await contract.methods.getAvailableLegionsCount(account).call();
  return res;
};

export const getMaxAttackPower = async (contract, account) => {
  const res = await contract.methods.getMaxAttackPower(account).call();
  return res;
};

export const getLegionLastHuntTime = async (contract, tokenId) => {
  const res = await contract.methods.lastHuntTime(tokenId).call();
  return res;
};

export const getWarriorCountForMonster25 = async (contract) => {
  const res = await contract.methods.warriorCountForMonster25().call();
  return res;
};

export const getCanAttackMonster25 = async (contract, account) => {
  const res = await contract.methods.canAttackMonster25(account).call();
  return {
    status: res[0],
    count: res[1],
  };
};

export const getCapacityOfLegion = async (contract, tokenId) => {
  const res = await contract.methods.getCapacityOfLegion(tokenId).call();
  return res;
};

export const mintLegion = async (
  contract,
  account,
  legionName,
  beastIds,
  warriorIds,
  fromWhichWallet
) => {
  const res = await contract.methods
    .mint(legionName, beastIds, warriorIds, fromWhichWallet)
    .send({ from: account });
  return res;
};

export const updateLegion = async (
  contract,
  account,
  legionId,
  beastIds,
  warriorIds,
  fromWhichWallet
) => {
  const res = await contract.methods
    .updateLegion(legionId, beastIds, warriorIds, fromWhichWallet)
    .send({ from: account });
  return res;
};

export const addSupply = async (
  contract,
  account,
  tokenId,
  supply,
  fromWallet
) => {
  const res = await contract.methods
    .addSupply(tokenId, supply, fromWallet)
    .send({ from: account });
  return res;
};

// Hunt
export const initiateHunt = async (contract, account, legionID, monsterID) => {
  const res = await contract.methods
    .initiateHunt(legionID, monsterID)
    .send({ from: account });
  return res;
};

export const revealHunt = async (contract, account) => {
  const res = await contract.methods.hunt().send({ from: account });
  return res;
};

export const initiateMassHunt = async (contract, account) => {
  const res = await contract.methods.initiateMassHunt().send({ from: account });
  return res;
};

export const revealMassHunt = async (contract, account) => {
  return await contract.methods.massHunt().send({ from: account });
};

export const getWalletHuntPendingLegionId = async (contract, account) => {
  const res = await contract.methods.walletHuntPendingTokenId(account).call();
  return res;
};

export const getWalletHuntPendingMonsterId = async (contract, account) => {
  const res = await contract.methods.walletHuntPendingMonsterId(account).call();
  return res;
};

export const ownerOfLegion = async (contract, tokenId) => {
  const res = await contract.methods.ownerOf(tokenId).call();
  return res;
};
