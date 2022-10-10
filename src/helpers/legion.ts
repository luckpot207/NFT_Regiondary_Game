import { AppDispatch } from "../store";
import { Contract } from "web3-eth-contract";
import { updateState } from "../reducers/cryptolegions.reducer";
import {
  execute,
  getAllLegions,
  getLegionBalance,
  isApprovedForAll,
  setApprovalForAll,
  setBloodstoneApprove,
} from "../web3hooks/contractFunctions";
import { I_Legion } from "../interfaces";
import { getLegionMp4ImageUrl, getLegionJpgImageUrl } from "../utils/utils";
import {
  getLegionAddress,
  getRewardPoolAddress,
} from "../web3hooks/getAddress";

export const getAllLegionsAct = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract
) => {
  dispatch(updateState({ getAllLegionsLoading: true }));
  try {
    const legionBalance = await getLegionBalance(legionContract, account);
    const allLegionsRes = await getAllLegions(
      legionContract,
      account,
      0,
      Number(legionBalance)
    );
    const legionInfos = allLegionsRes[0];
    const ids = allLegionsRes[1];
    const huntStatus = allLegionsRes[2];
    const duelStatus = allLegionsRes[3];
    let allLegions: I_Legion[] = [];
    ids.forEach((id: string, index: number) => {
      var temp: I_Legion = {
        id: id,
        name: legionInfos[index].name,
        beastIds: legionInfos[index].beast_ids,
        warriorIds: legionInfos[index].warrior_ids,
        attackPower: parseFloat(legionInfos[index].attack_power),
        jpg: getLegionJpgImageUrl(parseFloat(legionInfos[index].attack_power)),
        mp4: getLegionMp4ImageUrl(parseFloat(legionInfos[index].attack_power)),
        supplies: parseFloat(legionInfos[index].supplies),
        huntStatus: huntStatus[index],
        duelStatus: true,
        executeStatus: false,
      };
      allLegions.push(temp);
    });
    dispatch(updateState({ allLegions, legionBalance }));
  } catch (error) {}
  dispatch(updateState({ getAllLegionsLoading: false }));
};

export const checkAndApproveBeastForLegion = async (
  dispatch: AppDispatch,
  account: any,
  beastContract: Contract
) => {
  try {
    let isApproved = await isApprovedForAll(
      beastContract,
      account,
      getLegionAddress()
    );
    dispatch(updateState({ isApprovedBeastForLegion: isApproved }));
    if (!isApproved) {
      await setApprovalForAll(account, beastContract, getLegionAddress(), true);
    }
    isApproved = await isApprovedForAll(
      beastContract,
      account,
      getLegionAddress()
    );
    dispatch(updateState({ isApprovedBeastForLegion: isApproved }));
  } catch (error) {}
};

export const checkAndApproveWarriorForLegion = async (
  dispatch: AppDispatch,
  account: any,
  warriorContract: Contract
) => {
  try {
    let isApproved = await isApprovedForAll(
      warriorContract,
      account,
      getLegionAddress()
    );
    dispatch(updateState({ isApprovedWarriorForLegion: isApproved }));
    if (!isApproved) {
      await setApprovalForAll(
        account,
        warriorContract,
        getLegionAddress(),
        true
      );
    }
    isApproved = await isApprovedForAll(
      warriorContract,
      account,
      getLegionAddress()
    );
    dispatch(updateState({ isApprovedWarriorForLegion: isApproved }));
  } catch (error) {}
};

export const handleExecuteLegions = async (
  dispatch: AppDispatch,
  account: any,
  legionContract: Contract,
  ids: String[]
) => {
  dispatch(updateState({ executeLegionsLoading: true }));
  try {
    await execute(legionContract, account, ids);
    getAllLegionsAct(dispatch, account, legionContract);
  } catch (error) {}
  dispatch(updateState({ executeLegionsLoading: false }));
};
