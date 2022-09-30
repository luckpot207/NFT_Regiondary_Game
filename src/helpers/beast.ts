import { AppDispatch } from "../store";
import { Contract } from "web3-eth-contract";
import {
  execute,
  getAllBeasts,
  getBeastBalance,
  getMintRequestId,
  getVRFResult,
  getWalletMintPending,
  revealBeastsAndWarrior,
} from "../web3hooks/contractFunctions";
import { updateState } from "../reducers/cryptolegions.reducer";
import { I_Beast } from "../interfaces";
import Constants from "../constants";
import { getBeastMp4, getBeastJPG } from "../utils/utils";

export const checkBeastRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateState({ mintBeastVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMintRequestId(beastContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateState({ mintBeastVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

export const checkMintBeastPending = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  try {
    const mintBeastPending = await getWalletMintPending(beastContract, account);
    dispatch(updateState({ mintBeastPending }));
  } catch (error) {}
};

export const revealBeast = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  try {
    dispatch(updateState({ revealBeastLoading: true }));
    await revealBeastsAndWarrior(beastContract, account);
    await checkMintBeastPending(dispatch, account, beastContract);
    getAllBeastsAct(dispatch, account, beastContract);
    dispatch(updateState({ revealBeastLoading: false }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateState({ revealBeastLoading: false }));
};

export const getAllBeastsAct = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  dispatch(updateState({ getAllBeastsLoading: true }));
  try {
    const beastBalance = await getBeastBalance(beastContract, account);
    const allBeastsRes = await getAllBeasts(
      beastContract,
      account,
      0,
      Number(beastBalance)
    );
    const ids = allBeastsRes[0];
    const capacities = allBeastsRes[1];
    let allBeasts: I_Beast[] = [];
    ids.forEach((id: string, index: number) => {
      var temp: I_Beast = {
        id: id,
        type: Constants.beastsTypeInfo[
          capacities[index] === "20" ? 5 : parseInt(capacities[index]) - 1
        ],
        capacity: parseInt(capacities[index]),
        jpg: getBeastJPG(parseInt(capacities[index])),
        mp4: getBeastMp4(parseInt(capacities[index])),
        executeStatus: false,
      };
      allBeasts.push(temp);
    });
    dispatch(updateState({ beastBalance, allBeasts }));
  } catch (error) {}
  dispatch(updateState({ getAllBeastsLoading: false }));
};

export const handleExecuteBeasts = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract,
  ids: String[]
) => {
  dispatch(updateState({ executeBeastsLoading: true }));
  try {
    await execute(beastContract, account, ids);
    getAllBeastsAct(dispatch, account, beastContract);
  } catch (error) {}
  dispatch(updateState({ executeBeastsLoading: false }));
};
