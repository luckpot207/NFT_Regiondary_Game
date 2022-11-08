import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import gameConfig from "../config/game.config";
import {
  getBloodstoneAddress,
  getBeastAddress,
  getWarriorAddress,
  getLegionAddress,
  getRewardPoolAddress,
  getMonsterAddress,
  getMarketplaceAddress,
  getFeeHandlerAddress,
  getBUSDAddress,
  getVRFAddress,
  getReferralSystemAddress,
  getDuelSystemAddress
} from "./getAddress";

import {
  getBloodstoneAbi,
  getBeastAbi,
  getWarriorAbi,
  getLegionAbi,
  getRewardPoolAbi,
  getMonsterAbi,
  getMarketplaceAbi,
  getFeeHandlerAbi,
  getBUSDAbi,
  getVRFAbi,
  getReferralSystemAbi,
  getDuelSystemAbi,
} from "./getAbi";

const gameVersion = gameConfig.version;
const RPC_URL = gameVersion.rpcUrl;
const RPC_WS_URL = gameVersion.rpcWsUrl;

const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000,
});

const eventProvider = new Web3.providers.WebsocketProvider(RPC_WS_URL, {
  timeout: 10000,
});

export const useWeb3 = () => {
  const { library } = useWeb3React();
  return new Web3(library?.currentProvider || httpProvider);
};

const useContract = (abi, address) => {
  const { library } = useWeb3React();
  const web3 = new Web3(library.currentProvider || httpProvider);
  return new web3.eth.Contract(abi, address);
};

const useContractForEvent = (abi, address) => {
  const web3 = new Web3(eventProvider);
  return new web3.eth.Contract(abi, address);
};

export const useBloodstone = () => {
  return useContract(getBloodstoneAbi(), getBloodstoneAddress());
};

export const useBeast = () => {
  return useContract(getBeastAbi(), getBeastAddress());
};

export const useWarrior = () => {
  return useContract(getWarriorAbi(), getWarriorAddress());
};

export const useLegion = () => {
  return useContract(getLegionAbi(), getLegionAddress());
};

export const useMonster = () => {
  return useContract(getMonsterAbi(), getMonsterAddress());
};

export const useRewardPool = () => {
  return useContract(getRewardPoolAbi(), getRewardPoolAddress());
};

export const useMarketplace = () => {
  return useContract(getMarketplaceAbi(), getMarketplaceAddress());
};

export const useFeeHandler = () => {
  return useContract(getFeeHandlerAbi(), getFeeHandlerAddress());
};

export const useBUSD = () => {
  return useContract(getBUSDAbi(), getBUSDAddress());
};

export const useVRF = () => {
  return useContract(getVRFAbi(), getVRFAddress());
};

export const useLegionEvent = () => {
  return useContractForEvent(getLegionAbi(), getLegionAddress());
};

export const useMarketplaceEvent = () => {
  return useContractForEvent(getMarketplaceAbi(), getMarketplaceAddress());
};

export const useRewardPoolEvent = () => {
  return useContractForEvent(getRewardPoolAbi(), getRewardPoolAddress());
};

export const useReferralSystem = () => {
  return useContract(getReferralSystemAbi(), getReferralSystemAddress());
};

export const useDuelSystem = () => {
  return useContract(getDuelSystemAbi(), getDuelSystemAddress());
}