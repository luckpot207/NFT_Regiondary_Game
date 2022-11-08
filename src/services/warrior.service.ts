import { Contract } from "web3-eth-contract";
import constants from "../constants";
import { updateWarriorState } from "../reducers/warrior.reducer";
import { updateInventoryState } from "../reducers/inventory.reducer";
import { AppDispatch } from "../store";
import { IWarrior } from "../types";
import {
  getWarriorJpg,
  getWarriorMp4,
  getWarriorStrength,
} from "../utils/utils";
import {
  execute,
  getMintRequestId,
  getWalletMintPending,
  revealBeastsAndWarrior,
} from "../web3hooks/contractFunctions/common.contract";
import { getVRFResult } from "../web3hooks/contractFunctions/vrf.contract";
import {
  getAllWarriors,
  getWarriorBalance,
} from "../web3hooks/contractFunctions/warrior.contract";

const checkWarriorRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateWarriorState({ mintWarriorVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMintRequestId(warriorContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateWarriorState({ mintWarriorVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

const checkMintWarriorPending = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  try {
    const mintWarriorPending = await getWalletMintPending(
      warriorContract,
      account
    );
    dispatch(updateWarriorState({ mintWarriorPending }));
  } catch (error) {}
};

const revealWarrior = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  try {
    dispatch(updateWarriorState({ revealWarriorLoading: true }));
    await revealBeastsAndWarrior(warriorContract, account);
    await checkMintWarriorPending(dispatch, account, warriorContract);
    getAllWarriorsAct(dispatch, account, warriorContract);
    dispatch(updateWarriorState({ revealWarriorLoading: false }));
  } catch (error) {}
  dispatch(updateWarriorState({ revealWarriorLoading: false }));
};

const getAllWarriorsAct = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  dispatch(updateWarriorState({ getAllWarriorsLoading: true }));
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
    let allWarriors: IWarrior[] = [];
    ids.forEach((id: string, index: number) => {
      var temp: IWarrior = {
        id: id,
        type: constants.itemNames.warriors[
          getWarriorStrength(parseInt(attackPowers[index]))
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
    dispatch(updateWarriorState({ allWarriors }));
    dispatch(updateInventoryState({ warriorBalance }));
  } catch (error) {}
  dispatch(updateWarriorState({ getAllWarriorsLoading: false }));
};

const handleExecuteWarriors = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract,
  ids: String[]
) => {
  dispatch(updateWarriorState({ executeWarriorsLoading: true }));
  try {
    await execute(warriorContract, account, ids);
    getAllWarriorsAct(dispatch, account, warriorContract);
  } catch (error) {}
  dispatch(updateWarriorState({ executeWarriorsLoading: false }));
};

const WarriorService = {
  checkWarriorRevealStatus,
  checkMintWarriorPending,
  revealWarrior,
  getAllWarriorsAct,
  handleExecuteWarriors,
};

export default WarriorService;
