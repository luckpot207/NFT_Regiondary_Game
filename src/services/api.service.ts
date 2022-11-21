import Axios from "axios";
import { apiConfig } from "../config/api.config";

const devLink = apiConfig.devServer;
const proLink = apiConfig.proServer;
const serverLink = devLink;

const getContactInfo = async (wallet: string | undefined) => {
  return Axios.get(`${serverLink}/contact/getContactInfo/${wallet}`);
};

const addContactInfo = async (wallet: string, tgname: string) => {
  return Axios.post(`${serverLink}/contact/addContactInfo`, {
    wallet,
    tgname,
  });
};

const editContactInfo = async (wallet: string, tgname: string) => {
  return Axios.post(`${serverLink}/contact/editContactInfo`, {
    wallet,
    tgname,
  });
};

const getPresentItem = async () => {
  return Axios.get(`${serverLink}/presentitem/getPresentItem`);
};

const vote = async (address: string, vote: boolean, is_auto: boolean) => {
  return Axios.post(`${serverLink}/vote/addVote`, {
    address: address,
    vote: vote,
    is_auto: is_auto,
  });
};

const getVoteByAddress = async (address: string) => {
  return Axios.post(`${serverLink}/vote/getVoteByAddress`, {
    address: address,
  });
};

const getVoteStatus = async () => {
  return Axios.get(`${serverLink}/vote/getVoteCnt`);
};

const confirmSamaritanStarHolder = async (account: string) => {
  return Axios.post(`${serverLink}/samaritan/confirmSamaritanStarHolder`, {
    address: account,
  });
};

const addSamaritanStarHolder = async (account: string) => {
  return Axios.post(`${serverLink}/samaritan/addSamaritanStarHolder`, {
    address: account,
  });
};

const getReincarnation = async (version: number) => {
  return Axios.post(`${serverLink}/reincarnation/getReincarnation`, {
    version: version,
  });
};

const addReincarnationValue = async (address: string, value: number) => {
  return Axios.post(`${serverLink}/reincarnation/addReincarnationValue`, {
    address: address,
    value: value,
  });
};

const getReincarnationValueByAddress = async (address: string) => {
  return Axios.post(
    `${serverLink}/reincarnation/getReincarnationValueByAddress`,
    {
      address: address,
    }
  );
};

const getLeaderboardInfo = async (address: string) => {
  return Axios.get(`${serverLink}/leaderboard/getLeaderboardInfo/${address}`);
};

const addToLeaderboard = async (address: string) => {
  return Axios.post(`${serverLink}/leaderboard/addToLeaderboard`, {
    address: address,
  });
};

const removeFromLeaderboard = async (address: string) => {
  return Axios.post(`${serverLink}/leaderboard/removeFromLeaderboard`, {
    address: address,
  });
};

const getAllTips = async () => {
  return Axios.get(`${serverLink}/tipsandtricks/getAll`);
};

const getClaimedBUSDAlertAmount = async (address: string) => {
  return Axios.post(`${serverLink}/claimedBUSD/getClaimedBUSDAlertAmount`, {
    address: address,
  });
};
const setClaimedBUSDAlertAmount = async (address: string, amount: number) => {
  return Axios.post(`${serverLink}/claimedBUSD/setClaimedBUSDAlertAmount`, {
    address: address,
    amount: amount,
  });
};

const getAllPoolStatus = async () => {
  return Axios.get(`${serverLink}/poolstatus/getAll`);
};

const ApiService = {
  getContactInfo,
  addContactInfo,
  editContactInfo,
  getPresentItem,
  vote,
  getVoteStatus,
  getVoteByAddress,
  confirmSamaritanStarHolder,
  addSamaritanStarHolder,
  getReincarnation,
  addReincarnationValue,
  getReincarnationValueByAddress,
  getLeaderboardInfo,
  addToLeaderboard,
  removeFromLeaderboard,
  getAllTips,
  getClaimedBUSDAlertAmount,
  setClaimedBUSDAlertAmount,
  getAllPoolStatus,
};

export default ApiService;
