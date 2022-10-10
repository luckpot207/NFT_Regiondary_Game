// import beast from "../config/abis/beast.json";
import bloodstone from "../config/abis/bloodstone.json";
import busd from "../config/abis/busd.json";

import beast from "../config/abis/BeastNFT.json";
import feehandler from "../config/abis/FeeHandler.json";
import legion from "../config/abis/LegionNFT.json";
import marketplace from "../config/abis/Marketplace.json";
import monster from "../config/abis/Monster.json";
import vrfv2consumer from "../config/abis/VRFv2Consumer.json";
import warrior from "../config/abis/WarriorNFT.json";
import rewardpool from "../config/abis/RewardPool.json";
import referralsystem from "../config/abis/ReferralSystem.json";
import duelsystem from "../config/abis/DuelSystem.json";

export const getBloodstoneAbi = () => {
  return bloodstone;
};

export const getBeastAbi = () => {
  return beast;
};

export const getWarriorAbi = () => {
  return warrior;
};

export const getLegionAbi = () => {
  return legion;
};

export const getMonsterAbi = () => {
  return monster;
};

export const getRewardPoolAbi = () => {
  return rewardpool;
};

export const getMarketplaceAbi = () => {
  return marketplace;
};

export const getFeeHandlerAbi = () => {
  return feehandler;
};

export const getBUSDAbi = () => {
  return busd;
};

export const getVRFAbi = () => {
  return vrfv2consumer;
};

export const getReferralSystemAbi = () => {
  return referralsystem;
};

export const getDuelSystemAbi = () => {
  return duelsystem;
}