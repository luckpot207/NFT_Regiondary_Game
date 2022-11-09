import { Contract } from "web3-eth-contract";
import constants from "../constants";
import { updateBeastState } from "../reducers/beast.reducer";
import { updateInventoryState } from "../reducers/inventory.reducer";
import { AppDispatch } from "../store";
import { IBeast } from "../types";
import { ICapacity } from "../types/beast.type";
import { getBeastJPG, getBeastMp4 } from "../utils/utils";
import {
  getAllBeasts,
  getBeastBalance,
} from "../web3hooks/contractFunctions/beast.contract";
import {
  execute,
  getMintRequestId,
  getWalletMintPending,
  revealBeastsAndWarrior,
} from "../web3hooks/contractFunctions/common.contract";
import { getVRFResult } from "../web3hooks/contractFunctions/vrf.contract";

const checkBeastRevealStatus = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract,
  vrfContract: Contract
) => {
  try {
    dispatch(updateBeastState({ mintBeastVRFPending: true }));
    const revealChecker = setInterval(async () => {
      const requestId = await getMintRequestId(beastContract, account);
      const returnVal = await getVRFResult(vrfContract, requestId);
      if (returnVal != 0) {
        dispatch(updateBeastState({ mintBeastVRFPending: false }));
        clearInterval(revealChecker);
      }
    }, 1000);
  } catch (error) {}
};

const checkMintBeastPending = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  try {
    const mintBeastPending = await getWalletMintPending(beastContract, account);
    dispatch(updateBeastState({ mintBeastPending }));
  } catch (error) {}
};

const revealBeast = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  try {
    dispatch(updateBeastState({ revealBeastLoading: true }));
    await revealBeastsAndWarrior(beastContract, account);
    await checkMintBeastPending(dispatch, account, beastContract);
    getAllBeastsAct(dispatch, account, beastContract);
    dispatch(updateBeastState({ revealBeastLoading: false }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateBeastState({ revealBeastLoading: false }));
};

const getAllBeastsAct = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  dispatch(updateBeastState({ getAllBeastsLoading: true }));
  try {
    const beastBalance = await getBeastBalance(beastContract, account);
    const allBeastsRes = await getAllBeasts(
      beastContract,
      account,
      0,
      Number(beastBalance)
    );

    const ids = allBeastsRes[0];
    const capacities: ICapacity[] = allBeastsRes[1];
    let allBeasts: IBeast[] = [];
    ids.forEach((id: string, index: number) => {
      var temp: IBeast = {
        id: id,
        type: constants.itemNames.beasts[capacities[index]],
        capacity: capacities[index],
        jpg: getBeastJPG(Number(capacities[index])),
        mp4: getBeastMp4(Number(capacities[index])),
        executeStatus: false,
      };
      allBeasts.push(temp);
    });
    dispatch(updateBeastState({ allBeasts }));
    dispatch(updateInventoryState({ beastBalance }));
  } catch (error) {}
  dispatch(updateBeastState({ getAllBeastsLoading: false }));
};

const handleExecuteBeasts = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract,
  ids: String[]
) => {
  dispatch(updateBeastState({ executeBeastsLoading: true }));
  try {
    await execute(beastContract, account, ids);
    getAllBeastsAct(dispatch, account, beastContract);
  } catch (error) {}
  dispatch(updateBeastState({ executeBeastsLoading: false }));
};

const BeastService = {
  checkBeastRevealStatus,
  checkMintBeastPending,
  revealBeast,
  getAllBeastsAct,
  handleExecuteBeasts,
};

export default BeastService;
