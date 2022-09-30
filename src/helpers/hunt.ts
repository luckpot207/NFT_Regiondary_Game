import { AppDispatch } from "../store";
import { Contract } from "web3-eth-contract";
import { updateState } from "../reducers/cryptolegions.reducer";
import {
  getAllMonsters,
  getHuntRequestId,
  getMassHuntRequestId,
  getVRFResult,
  getWalletHuntPending,
  getWalletMassHuntPending,
} from "../web3hooks/contractFunctions";
import { I_Monster } from "../interfaces";
import Constants from "../constants";

export const getAllMonstersAct = async (
  dispatch: AppDispatch,
  monsterContract: Contract
) => {
  dispatch(updateState({ getAllMonsterLoading: true }));
  try {
    const allMonstersRes = await getAllMonsters(monsterContract);
    console.log("all monsters: ", allMonstersRes);
    const monsterInfos = allMonstersRes[0];
    const blstRewards = allMonstersRes[1];
    let allMonsters: I_Monster[] = [];
    monsterInfos.forEach((item: any, index: number) => {
      let temp: I_Monster = {
        id: index + 1,
        name: "",
        percent: parseInt(item.percent),
        BUSDReward: item.reward / Math.pow(10, 18),
        BLSTReward: blstRewards[index] / Math.pow(10, 18),
        attackPower: parseInt(item.attack_power),
      };
      allMonsters.push(temp);
    });
    dispatch(updateState({ allMonsters }));
  } catch (error) {
    console.log("get all monster error: ", error);
  }
  dispatch(updateState({ getAllMonsterLoading: false }));
};

export const checkHuntRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateState({ huntVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateState({ huntVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

export const checkHuntPending = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  try {
    const huntPending = await getWalletHuntPending(legionContract, account);
    dispatch(updateState({ huntPending }));
  } catch (error) {}
};

export const checkMassHuntRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateState({ massHuntVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMassHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateState({ massHuntVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

export const checkMassHuntPending = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  try {
    const massHuntPending = await getWalletMassHuntPending(
      legionContract,
      account
    );
    dispatch(updateState({ massHuntPending }));
  } catch (error) {}
};
