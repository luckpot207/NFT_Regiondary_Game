import { AppDispatch } from "../store";
import { Contract } from "web3-eth-contract";
import { updateState } from "../reducers/cryptolegions.reducer";
import {
  execute,
  getAllWarriors,
  getMintRequestId,
  getVRFResult,
  getWalletMintPending,
  getWarriorBalance,
  revealBeastsAndWarrior,
} from "../web3hooks/contractFunctions";
import { I_Warrior } from "../interfaces";
import Constants from "../constants";
import {
  getWarriorMp4,
  getWarriorJpg,
  getWarriorStrength,
} from "../utils/utils";

export const checkWarriorRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateState({ mintWarriorVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMintRequestId(warriorContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateState({ mintWarriorVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

export const checkMintWarriorPending = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  try {
    const mintWarriorPending = await getWalletMintPending(
      warriorContract,
      account
    );
    dispatch(updateState({ mintWarriorPending }));
  } catch (error) {}
};

export const revealWarrior = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  try {
    dispatch(updateState({ revealWarriorLoading: true }));
    await revealBeastsAndWarrior(warriorContract, account);
    await checkMintWarriorPending(dispatch, account, warriorContract);
    getAllWarriorsAct(dispatch, account, warriorContract);
    dispatch(updateState({ revealWarriorLoading: false }));
  } catch (error) {}
  dispatch(updateState({ revealWarriorLoading: false }));
};

export const getAllWarriorsAct = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  dispatch(updateState({ getAllWarriorsLoading: true }));
  try {
    const warriorBalance = await getWarriorBalance(warriorContract, account);
    const allWarriorsRes = await getAllWarriors(
      warriorContract,
      account,
      0,
      Number(warriorBalance)
    );
    const ids = allWarriorsRes[0];
    const attackPowers = allWarriorsRes[1];
    let allWarriors: I_Warrior[] = [];
    ids.forEach((id: string, index: number) => {
      var temp: I_Warrior = {
        id: id,
        type: Constants.warriorTypeInfo[
          getWarriorStrength(parseInt(attackPowers[index])) - 1
        ],
        strength: getWarriorStrength(attackPowers[index]),
        attackPower: parseFloat(attackPowers[index]),
        jpg: getWarriorJpg(
          getWarriorStrength(attackPowers[index]),
          parseInt(attackPowers[index])
        ),
        mp4: getWarriorMp4(
          getWarriorStrength(attackPowers[index]),
          parseInt(attackPowers[index])
        ),
        executeStatus: false,
      };
      allWarriors.push(temp);
    });
    dispatch(updateState({ warriorBalance, allWarriors }));
  } catch (error) {}
  dispatch(updateState({ getAllWarriorsLoading: false }));
};

export const handleExecuteWarriors = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract,
  ids: String[]
) => {
  dispatch(updateState({ executeWarriorsLoading: true }));
  try {
    await execute(warriorContract, account, ids);
    getAllWarriorsAct(dispatch, account, warriorContract);
  } catch (error) {}
  dispatch(updateState({ executeWarriorsLoading: false }));
};
