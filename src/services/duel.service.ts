import { Contract } from "web3-eth-contract";
import { updateDuelState } from "../reducers/duel.reducer";
import { AppDispatch, store } from "../store";
import { getAllDuels } from "../web3hooks/contractFunctions/duel.contract";
import { getLegion } from "../web3hooks/contractFunctions/legion.contract";
import { IDuel, ILegion } from "../types";

export const getAllDuelsAct = async (
  dispatch: AppDispatch,
  duelContract: Contract,
  legionContract: Contract
) => {
  dispatch(updateDuelState({ getAllDulesLoading: true }));
  const state = store.getState();
  const all_legions: ILegion[] = state.legion.allLegions;
  try {
    const allDuelsRes = await getAllDuels(duelContract);
    let allDuelsTemp: IDuel[] = [];
    for (let i = 0; i < allDuelsRes.length; i++) {
      if (allDuelsRes[i].status == 0) continue;
      var isMine: boolean = false;
      all_legions.forEach((legion: ILegion) => {
        if (allDuelsRes[i].status == 1) {
          if (legion.id == allDuelsRes[i].legion1) {
            isMine = true;
          }
        } else if (allDuelsRes[i].status == 2 || allDuelsRes[i].status == 3) {
          if (
            legion.id == allDuelsRes[i].legion1 ||
            legion.id == allDuelsRes[i].legion2
          ) {
            isMine = true;
          }
        }
      });
      const creatorLegionTemp: any = await getLegion(
        legionContract,
        allDuelsRes[i].legion1
      );
      const creatorLegion: ILegion = {
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
      const joinerLegion: ILegion = {
        id: joinerLegionTemp.id,
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
      } else if (allDuelsRes[i].status == 2) {
        endDateTime = new Date(
          Number(allDuelsRes[i].startTime) * 1000 + 24 * 3600 * 1000
        ).toISOString();
      } else {
        const endDateTimeTemp = new Date(
          Number(allDuelsRes[i].startTime) * 1000 + 24 * 3600 * 1000
        );
        endDateTime =
          endDateTimeTemp.toDateString() +
          " at " +
          endDateTimeTemp.getUTCHours() +
          ":" +
          endDateTimeTemp.getUTCMinutes() +
          " UTC";
      }
      var duelTemp: IDuel = {
        duelId: i.toString(),
        isMine: isMine,
        creatorEstmatePrice:
          Math.round(allDuelsRes[i].price1 / 10 ** 14) / 10 ** 4,
        creatorLegion: creatorLegion,
        joinerEstmatePrice:
          Math.round(allDuelsRes[i].price2 / 10 ** 14) / 10 ** 4,
        joinerLegion: joinerLegion,
        betPrice: allDuelsRes[i].betAmount / 10 ** 18,
        endDateTime: endDateTime,
        status: allDuelsRes[i].status,
        type: allDuelsRes[i].standard,
        result: Math.round(allDuelsRes[i].resultPrice / 10 ** 14) / 10 ** 4,
      };
      allDuelsTemp.push(duelTemp);
    }
    dispatch(updateDuelState({ allDuels: allDuelsTemp }));
  } catch (error) {}
  dispatch(updateDuelState({ getAllDulesLoading: false }));
};

export const confirmUnclaimedWallet = (betAmount: Number) => {
  const state = store.getState();
  if (Number(state.inventory.unclaimedUSD) / 10 ** 18 >= betAmount) {
    return true;
  } else {
    return false;
  }
};
