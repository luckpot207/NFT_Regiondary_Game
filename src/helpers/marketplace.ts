import { AppDispatch } from "../store";
import { Contract } from "web3-eth-contract";
import { updateState } from "../reducers/cryptolegions.reducer";
import {
  getAllBeastMarketItems,
  getAllLegionMarketItems,
  getAllWarriorMarketItems,
  getBeastBalance,
  getLegionBalance,
  getWarriorBalance,
} from "../web3hooks/contractFunctions";
import { getMarketplaceAddress } from "../web3hooks/getAddress";
import {
  I_Beast_Market,
  I_Legion_Market,
  I_Warrior_Market,
} from "../interfaces";
import {
  getBeastMp4,
  getBeastJPG,
  getLegionMp4ImageUrl,
  getLegionJpgImageUrl,
  getWarriorMp4,
  getWarriorJpg,
  getWarriorStrength,
} from "../utils/utils";
import Constants from "../constants";

export const getAllLegionsMarketItemsAct = async (
  dispatch: AppDispatch,
  web3: any,
  legionContract: Contract,
  marketplaceContract: Contract
) => {
  dispatch(updateState({ getAllLegionsMarketItemsLoading: true }));
  try {
    const currentTimeStamp = (await web3.eth.getBlock("latest")).timestamp;
    const balanceOfLegion = await getLegionBalance(
      legionContract,
      getMarketplaceAddress()
    );
    const allLegionsRes = await getAllLegionMarketItems(
      marketplaceContract,
      0,
      balanceOfLegion
    );
    console.log(allLegionsRes);
    const legionInfos = allLegionsRes[0];
    const ids = allLegionsRes[1];
    const huntStatus = allLegionsRes[2];
    const marketItems = allLegionsRes[3];
    let allLegionsMarketItems: I_Legion_Market[] = [];
    ids.forEach((id: String, index: number) => {
      var temp: I_Legion_Market = {
        id: id,
        name: legionInfos[index].name,
        beastIds: legionInfos[index].beast_ids,
        warriorIds: legionInfos[index].warrior_ids,
        attackPower: parseFloat(legionInfos[index].attack_power),
        jpg: getLegionJpgImageUrl(parseFloat(legionInfos[index].attack_power)),
        mp4: getLegionMp4ImageUrl(parseFloat(legionInfos[index].attack_power)),
        supplies: parseFloat(legionInfos[index].supplies),
        huntStatus: huntStatus[index],
        price: Number(web3.utils.fromWei(marketItems[index].price, "ether")),
        seller: marketItems[index].seller,
        listingTime: marketItems[index].listingTime,
        newItem:
          currentTimeStamp - Number(marketItems[index].listingTime) < 24 * 3600,
      };
      allLegionsMarketItems.push(temp);
    });
    dispatch(updateState({ allLegionsMarketItems }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateState({ getAllLegionsMarketItemsLoading: false }));
};

export const getAllWarriorMarketItemsAct = async (
  dispatch: AppDispatch,
  web3: any,
  warriorContract: Contract,
  marketplaceContract: Contract
) => {
  dispatch(updateState({ getAllWarriorsMarketItemsLoading: true }));
  try {
    const currentTimeStamp = (await web3.eth.getBlock("latest")).timestamp;
    const balanceOfWarrior = await getWarriorBalance(
      warriorContract,
      getMarketplaceAddress()
    );
    const allWarriorsRes = await getAllWarriorMarketItems(
      marketplaceContract,
      0,
      balanceOfWarrior
    );
    console.log(allWarriorsRes);
    const ids = allWarriorsRes[0];
    const attackPowers = allWarriorsRes[1];
    const marketItems = allWarriorsRes[2];
    let allWarriorsMarketItems: I_Warrior_Market[] = [];
    ids.forEach((id: String, index: number) => {
      var temp: I_Warrior_Market = {
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
        price: Number(web3.utils.fromWei(marketItems[index].price, "ether")),
        seller: marketItems[index].seller,
        listingTime: marketItems[index].listingTime,
        newItem:
          currentTimeStamp - Number(marketItems[index].listingTime) < 24 * 3600,
      };
      allWarriorsMarketItems.push(temp);
    });
    console.log(allWarriorsMarketItems);
    dispatch(updateState({ allWarriorsMarketItems }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateState({ getAllWarriorsMarketItemsLoading: false }));
};

export const getAllBeastMarketItemsAct = async (
  dispatch: AppDispatch,
  web3: any,
  beastContract: Contract,
  marketplaceContract: Contract
) => {
  dispatch(updateState({ getAllBeastsMarketItemsLoading: true }));
  try {
    const currentTimeStamp = (await web3.eth.getBlock("latest")).timestamp;
    const balanceOfBeast = await getBeastBalance(
      beastContract,
      getMarketplaceAddress()
    );
    console.log(balanceOfBeast);
    const allBeastsRes = await getAllBeastMarketItems(
      marketplaceContract,
      0,
      balanceOfBeast
    );
    console.log(allBeastsRes);
    const ids = allBeastsRes[0];
    const capacities = allBeastsRes[1];
    const marketItems = allBeastsRes[2];
    let allBeastsMarketItems: I_Beast_Market[] = [];
    ids.forEach((id: String, index: number) => {
      var temp: I_Beast_Market = {
        id: id,
        type: Constants.beastsTypeInfo[
          capacities[index] === "20" ? 5 : parseInt(capacities[index]) - 1
        ],
        capacity: parseInt(capacities[index]),
        jpg: getBeastJPG(parseInt(capacities[index])),
        mp4: getBeastMp4(parseInt(capacities[index])),
        seller: marketItems[index].seller,
        price: Number(web3.utils.fromWei(marketItems[index].price, "ether")),
        listingTime: marketItems[index].listingTime,
        newItem:
          currentTimeStamp - Number(marketItems[index].listingTime) < 24 * 3600,
      };
      allBeastsMarketItems.push(temp);
    });
    dispatch(updateState({ allBeastsMarketItems }));
    console.log(allBeastsMarketItems);
  } catch (error) {
    console.log(error);
  }
  dispatch(updateState({ getAllBeastsMarketItemsLoading: false }));
};
