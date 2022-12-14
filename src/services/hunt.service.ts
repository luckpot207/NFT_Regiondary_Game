import { Contract } from "web3-eth-contract";
import constants from "../constants";
import { updateLegionState } from "../reducers/legion.reducer";
import { updateMonsterState } from "../reducers/monster.reducer";
import { AppDispatch } from "../store";
import { IMonster } from "../types";
import { IMonsterId } from "../types/monster.type";
import {
  getHuntRequestId,
  getMassHuntRequestId,
  getWalletHuntPending,
  getWalletMassHuntPending,
} from "../web3hooks/contractFunctions/common.contract";
import { getAllMonsters } from "../web3hooks/contractFunctions/monster.contract";
import { getVRFResult } from "../web3hooks/contractFunctions/vrf.contract";

const getAllMonstersAct = async (
  dispatch: AppDispatch,
  monsterContract: Contract
) => {
  dispatch(updateMonsterState({ getAllMonsterLoading: true }));
  try {
    const allMonstersRes = await getAllMonsters(monsterContract);
    const monsterInfos = allMonstersRes[0];
    const blstRewards = allMonstersRes[1];
    let allMonsters: IMonster[] = [];
    monsterInfos.forEach((item: any, index: number) => {
      let temp: IMonster = {
        id: (index + 1) as IMonsterId,
        name: constants.itemNames.monsters[(index + 1) as IMonsterId],
        percent: parseInt(item.percent),
        BUSDReward: item.reward / Math.pow(10, 18),
        BLSTReward: blstRewards[index] / Math.pow(10, 18),
        attackPower: parseInt(item.attack_power),
      };
      allMonsters.push(temp);
    });
    dispatch(updateMonsterState({ allMonsters }));
  } catch (error) {
    console.log("get all monster error: ", error);
  }
  dispatch(updateMonsterState({ getAllMonsterLoading: false }));
};

const checkHuntRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateLegionState({ huntVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateLegionState({ huntVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

const checkHuntPending = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  try {
    const huntPending = await getWalletHuntPending(legionContract, account);
    dispatch(updateLegionState({ huntPending }));
  } catch (error) {}
};

const checkMassHuntRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateLegionState({ massHuntVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMassHuntRequestId(legionContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateLegionState({ massHuntVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

const checkMassHuntPending = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  try {
    const massHuntPending = await getWalletMassHuntPending(
      legionContract,
      account
    );
    dispatch(updateLegionState({ massHuntPending }));
  } catch (error) {}
};

const HuntService = {
  getAllMonstersAct,
  checkHuntRevealStatus,
  checkHuntPending,
  checkMassHuntRevealStatus,
  checkMassHuntPending,
};

export default HuntService;
