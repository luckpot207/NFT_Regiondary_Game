import Axios from "axios";
import { apiConfig } from "../config/api.config";

const serverLink = apiConfig.devServer;
const localLink = apiConfig.localServer;

const getAllLanguageTexts = async () => {
  return Axios.get(`${serverLink}/language/getAllLanguageTexts`);
};

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

const getAllItemnames = async () => {
  return Axios.get(`${serverLink}/itemname/getAllItemnames`);
};

const getPresentItem = async () => {
  return Axios.get(`${serverLink}/presentitem/getPresentItem`);
};

// Vote
const vote = async (address: string, vote: boolean) => {
  return Axios.post(`${serverLink}vote/addVote`, {
    address: address,
    vote: vote,
  });
};

const getVoteByAddress = async (address: string) => {
  return Axios.post(`${serverLink}vote/getVoteByAddress`, {
    address: address,
  });
};

const getVoteStatus = async () => {
  return Axios.get(`${serverLink}vote/getVoteCnt`);
};

const confirmSamaritanStarHolder = async (account: string) => {
  return Axios.post(`${serverLink}samaritan/confirmSamaritanStarHolder`, {
    address: account,
  });
};

const addSamaritanStarHolder = async (account: string) => {
  return Axios.post(`${serverLink}samaritan/addSamaritanStarHolder`, {
    address: account,
  });
};

const getReincarnation = async (version: number) => {
  return Axios.post(`${serverLink}reincarnation/getReincarnation`, {
    version: version,
  });
};

const addReincarnationValue = async (address: string, value: number) => {
  return Axios.post(`${serverLink}reincarnation/addReincarnationValue`, {
    address: address,
    value: value,
  });
};

const getEconomyStatus = async () => {
  return Axios.get(`${serverLink}economy/getEconomyStatus`);
};

const getLeaderboardInfo = async (address: string) => {
  return Axios.get(`${serverLink}leaderboard/getLeaderboardInfo/${address}`);
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

const ApiService = {
  getAllLanguageTexts,
  getContactInfo,
  addContactInfo,
  editContactInfo,
  getAllItemnames,
  getPresentItem,
  vote,
  getVoteStatus,
  getVoteByAddress,
  confirmSamaritanStarHolder,
  addSamaritanStarHolder,
  getReincarnation,
  addReincarnationValue,
  getEconomyStatus,
  getLeaderboardInfo,
  addToLeaderboard,
  removeFromLeaderboard,
};

export default ApiService;
