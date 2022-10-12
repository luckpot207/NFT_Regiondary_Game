import { AppDispatch, store } from "../store";
import { Contract } from "web3-eth-contract";
import { updateState } from "../reducers/cryptolegions.reducer";
import {
  getAllDuels,
  getLegion,
} from "../web3hooks/contractFunctions";
import { I_Legion, I_Duel } from "../interfaces";


export const getAllDuelsAct = async (
  dispatch: AppDispatch,
  account: any,
  duelContract: Contract,
  legionContract: Contract
) => {
  dispatch(updateState({ getAllDulesLoading: true }));
  const state = store.getState();
  const all_legions: I_Legion[] = state.cryptolegions.allLegions;
  try {
    const allDuelsRes = await getAllDuels(duelContract);
    let allDuelsTemp: I_Duel[] = [];
    for (let i = 0; i < allDuelsRes.length; i++) {
      if (allDuelsRes[i].status == 0) continue;
      var isMine: Boolean = false;
      all_legions.forEach((legion: I_Legion) => {
        if (legion.id == allDuelsRes[i].legion1) {
            isMine = true;
        } 
      });
      const creatorLegionTemp: any = await getLegion(
        legionContract,
        allDuelsRes[i].legion1
      );
      const creatorLegion: I_Legion = {
        id: creatorLegionTemp.id,
        name: creatorLegionTemp.name,
        beastIds: creatorLegionTemp.beastIds,
        warriorIds: creatorLegionTemp.warriorIds,
        attackPower: creatorLegionTemp.attackPower,
        supplies: 0,
        huntStatus: creatorLegionTemp.huntStatus,
        jpg: creatorLegionTemp.jpg,
        mp4: creatorLegionTemp.gif,
        executeStatus: false,
      };
      const joinerLegionTemp: any = await getLegion(
        legionContract,
        allDuelsRes[i].legion2
      );
      const joinerLegion: I_Legion = {
        id: i.toString(),
        name: joinerLegionTemp.name,
        beastIds: joinerLegionTemp.beastIds,
        warriorIds: joinerLegionTemp.warriorIds,
        attackPower: joinerLegionTemp.attackPower,
        supplies: 0,
        huntStatus: joinerLegionTemp.huntStatus,
        jpg: joinerLegionTemp.jpg,
        mp4: joinerLegionTemp.gif,
        executeStatus: false,
      };
      var endDateTime: String = "";
      if (allDuelsRes[i].status == 1) {
        endDateTime = new Date(
          Number(allDuelsRes[i].startTime) * 1000 + 6 * 3600 * 1000
        ).toISOString();
      } else {
        endDateTime = new Date(
          Number(allDuelsRes[i].startTime) * 1000 + 24 * 3600 * 1000
        ).toISOString();
      }
      var duelTemp: I_Duel = {
        duelId: i.toString(),
        isMine: isMine,
        creatorEstmatePrice: Math.round(allDuelsRes[i].price1/(10 ** 14))/(10 ** 4),
        creatorLegion: creatorLegion,
        joinerEstmatePrice: Math.round(allDuelsRes[i].price1/(10 ** 14))/(10 ** 4),
        joinerLegion: joinerLegion,
        betPrice: allDuelsRes[i].betAmount,
        endDateTime: endDateTime,
        status: allDuelsRes[i].status,
        type: allDuelsRes[i].standard,
        result: 0,
      };
      allDuelsTemp.push(duelTemp);
    }
    dispatch(updateState({ allDuels: allDuelsTemp }));
  } catch (error) {}
  dispatch(updateState({ getAllDulesLoading: false }));
};
