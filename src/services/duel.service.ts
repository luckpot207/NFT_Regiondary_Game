import { Contract } from "web3-eth-contract";
import Axios from "axios";
import { updateDuelState } from "../reducers/duel.reducer";
import { AppDispatch, store } from "../store";
import { getAllDuels } from "../web3hooks/contractFunctions/duel.contract";
import {
  getLegion,
  ownerOfLegion,
} from "../web3hooks/contractFunctions/legion.contract";
import { IDuel, ILegion } from "../types";
import gameConfig from "../config/game.config";
import { apiConfig } from "../config/api.config";

const getAllDuelsAct = async (
  dispatch: AppDispatch,
  web3: any,
  account: any,
  duelContract: Contract,
  legionContract: Contract
) => {
  dispatch(updateDuelState({ getAllDulesLoading: true }));
  const state = store.getState();
  const all_legions: ILegion[] = state.legion.allLegions;
  const blockUserList: String[] = await getBlockUserList(web3, account);
  try {
    const allDuelsRes = await getAllDuels(duelContract);
    console.log("All duels: ", allDuelsRes);
    let allDuelsTemp: IDuel[] = [];
    const { version: gameVersion } = gameConfig;
    const { duelInvitePeriod, duelPeriod } = gameVersion;
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
          Number(allDuelsRes[i].startTime) * 1000 + duelInvitePeriod
        ).toISOString();
        console.log("Status 1 endtime: ", endDateTime);
      } else if (allDuelsRes[i].status == 2) {
        endDateTime = new Date(
          Number(allDuelsRes[i].startTime) * 1000 + duelPeriod
        ).toISOString();
        console.log("Status 2 endtime: ", endDateTime);
      } else {
        const endDateTimeTemp = new Date(
          Number(allDuelsRes[i].startTime) * 1000 + duelPeriod
        );
        endDateTime =
          endDateTimeTemp.toDateString() +
          " at " +
          endDateTimeTemp.getUTCHours() +
          ":" +
          endDateTimeTemp.getUTCMinutes() +
          " UTC";
        console.log("Status 3 endtime: ", endDateTime);
      }
      const ownerAddressOfLegion = (
        (await ownerOfLegion(legionContract, creatorLegion.id)) as String
      ).toLowerCase();
      console.log(ownerAddressOfLegion);
      if (
        allDuelsRes[i].status != 1 ||
        blockUserList.filter((user: String) => user == ownerAddressOfLegion)
          .length == 0
      ) {
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
        console.log("Duel Temp: ", duelTemp);
        allDuelsTemp.push(duelTemp);
      }
    }
    console.log("All Duels Temp: ", allDuelsTemp);
    dispatch(updateDuelState({ allDuels: allDuelsTemp }));
  } catch (error) {}
  dispatch(updateDuelState({ getAllDulesLoading: false }));
};

const confirmUnclaimedWallet = (betAmount: Number) => {
  const state = store.getState();
  if (Number(state.inventory.unclaimedUSD) / 10 ** 18 >= betAmount) {
    return true;
  } else {
    return false;
  }
};

const getBlockUserList = async (web3: any, account: any) => {
  const accountLowerCase = account.toLowerCase();
  try {
    const currentTimeStamp = (await web3.eth.getBlock("latest")).timestamp;
    const comparisionTime =
      currentTimeStamp - gameConfig.displayDuelsBlockPeriod;

    const query = `
      {
        duels (
          where: {
            joinedTime_gt: ${comparisionTime}
          }
          orderBy: joinedTime
          orderDirection: desc
          first: 1000
        ) {
          creator
          joiner
          createdLegionID
        }
      }
    `;
    const graphRes = await Axios.post(apiConfig.subgraphServer, {
      query,
    });
    const data = graphRes.data.data.duels;
    let list: String[] = [];
    let temp: String[] = [];
    data
      .filter(
        (item: any) =>
          item.creator == accountLowerCase || item.joiner == accountLowerCase
      )
      .forEach((item: any) => {
        let otherAccount = "";
        if (item.creator == accountLowerCase) {
          otherAccount = item.joiner;
        } else if (item.joiner == accountLowerCase) {
          otherAccount = item.creator;
        }
        temp.push(otherAccount);
        if (
          temp.filter((user: String) => user === otherAccount).length >=
          gameConfig.maxDuelNumWithSamePlayer
        ) {
          list.push(otherAccount);
        }
      });
    return list;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const DuelService = {
  getAllDuelsAct,
  confirmUnclaimedWallet,
};

export default DuelService;
