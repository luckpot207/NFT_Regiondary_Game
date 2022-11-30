import { Contract } from "web3-eth-contract";
import Axios from "axios";
import constants from "../constants";
import { updateMarketplaceState } from "../reducers/marketplace.reducer";
import { AppDispatch } from "../store";
import { IBeastMarket, ILegionMarket, IWarriorMarket } from "../types";
import { ICapacity } from "../types/beast.type";
import {
  getBeastJPG,
  getBeastMp4,
  getLegionJpgImageUrl,
  getLegionMp4ImageUrl,
  getWarriorJpg,
  getWarriorMp4,
  getWarriorStrength,
} from "../utils/utils";
import { getBeastBalance } from "../web3hooks/contractFunctions/beast.contract";
import { getLegionBalance } from "../web3hooks/contractFunctions/legion.contract";
import {
  getAllBeastMarketItems,
  getAllLegionMarketItems,
  getAllWarriorMarketItems,
} from "../web3hooks/contractFunctions/marketplace.contract";
import { getWarriorBalance } from "../web3hooks/contractFunctions/warrior.contract";
import { getMarketplaceAddress } from "../web3hooks/getAddress";
import { apiConfig } from "../config/api.config";
import gameConfig from "../config/game.config";

const getAllLegionsMarketItemsAct = async (
  dispatch: AppDispatch,
  web3: any,
  account: any,
  legionContract: Contract,
  marketplaceContract: Contract
) => {
  dispatch(updateMarketplaceState({ getAllLegionsMarketItemsLoading: true }));
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
    const legionInfos = allLegionsRes[0];
    const ids = allLegionsRes[1];
    const huntStatus = allLegionsRes[2];
    const marketItems = allLegionsRes[3];
    let allLegionsMarketItems: ILegionMarket[] = [];
    let blockPeriodSellerList = await getLegionBlockPeriodSellerList(
      account,
      currentTimeStamp
    );
    ids.forEach((id: String, index: number) => {
      if (
        blockPeriodSellerList.filter(
          (seller: string) =>
            seller === (marketItems[index].seller as String).toLowerCase()
        ).length < gameConfig.maxBuyingLegionItemNum
      ) {
        var temp: ILegionMarket = {
          id: id,
          name: legionInfos[index].name,
          beastIds: legionInfos[index].beast_ids,
          warriorIds: legionInfos[index].warrior_ids,
          attackPower: parseFloat(legionInfos[index].attack_power),
          jpg: getLegionJpgImageUrl(
            parseFloat(legionInfos[index].attack_power)
          ),
          mp4: getLegionMp4ImageUrl(
            parseFloat(legionInfos[index].attack_power)
          ),
          supplies: parseFloat(legionInfos[index].supplies),
          huntStatus: huntStatus[index],
          price: Number(web3.utils.fromWei(marketItems[index].price, "ether")),
          seller: marketItems[index].seller,
          listingTime: marketItems[index].listingTime,
          newItem:
            currentTimeStamp - Number(marketItems[index].listingTime) <
            24 * 3600,
        };
        allLegionsMarketItems.push(temp);
      }
    });
    dispatch(updateMarketplaceState({ allLegionsMarketItems }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateMarketplaceState({ getAllLegionsMarketItemsLoading: false }));
};

const getAllWarriorMarketItemsAct = async (
  dispatch: AppDispatch,
  web3: any,
  warriorContract: Contract,
  marketplaceContract: Contract
) => {
  dispatch(updateMarketplaceState({ getAllWarriorsMarketItemsLoading: true }));
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
    const ids = allWarriorsRes[0];
    const attackPowers = allWarriorsRes[1];
    const marketItems = allWarriorsRes[2];
    let allWarriorsMarketItems: IWarriorMarket[] = [];
    ids.forEach((id: String, index: number) => {
      var temp: IWarriorMarket = {
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
        price: Number(web3.utils.fromWei(marketItems[index].price, "ether")),
        seller: marketItems[index].seller,
        listingTime: marketItems[index].listingTime,
        newItem:
          currentTimeStamp - Number(marketItems[index].listingTime) < 24 * 3600,
      };
      allWarriorsMarketItems.push(temp);
    });
    dispatch(updateMarketplaceState({ allWarriorsMarketItems }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateMarketplaceState({ getAllWarriorsMarketItemsLoading: false }));
};

const getAllBeastMarketItemsAct = async (
  dispatch: AppDispatch,
  web3: any,
  beastContract: Contract,
  marketplaceContract: Contract
) => {
  dispatch(updateMarketplaceState({ getAllBeastsMarketItemsLoading: true }));
  try {
    const currentTimeStamp = (await web3.eth.getBlock("latest")).timestamp;
    const balanceOfBeast = await getBeastBalance(
      beastContract,
      getMarketplaceAddress()
    );
    const allBeastsRes = await getAllBeastMarketItems(
      marketplaceContract,
      0,
      balanceOfBeast
    );
    const ids = allBeastsRes[0];
    const capacities: ICapacity[] = allBeastsRes[1];
    const marketItems = allBeastsRes[2];
    let allBeastsMarketItems: IBeastMarket[] = [];
    ids.forEach((id: String, index: number) => {
      var temp: IBeastMarket = {
        id: id,
        type: constants.itemNames.beasts[capacities[index]],
        capacity: capacities[index],
        jpg: getBeastJPG(Number(capacities[index])),
        mp4: getBeastMp4(Number(capacities[index])),
        seller: marketItems[index].seller,
        price: Number(web3.utils.fromWei(marketItems[index].price, "ether")),
        listingTime: marketItems[index].listingTime,
        newItem:
          currentTimeStamp - Number(marketItems[index].listingTime) < 24 * 3600,
      };
      allBeastsMarketItems.push(temp);
    });
    dispatch(updateMarketplaceState({ allBeastsMarketItems }));
  } catch (error) {
    console.log(error);
  }
  dispatch(updateMarketplaceState({ getAllBeastsMarketItemsLoading: false }));
};

const getLegionBlockPeriodSellerList = async (
  account: any,
  currentTimeStamp: any
) => {
  try {
    const aWeekAgoTime = currentTimeStamp - gameConfig.buyingLegionBlockPeriod;
    const query = `
      {
        marketTransactions (
          where: {
            itemType: 3,
            timestamp_gt: ${aWeekAgoTime}
            buyer: ${`"` + account?.toLowerCase() + `"`}
          }
          orderBy: timestamp
          orderDirection: desc
          first: 1000
        ) {
          seller
        }
      }
    `;
    const graphRes = await Axios.post(apiConfig.subgraphServer, {
      query,
    });
    const data = graphRes.data.data.marketTransactions;
    const sellers: string[] = data.map((item: any) => item.seller);
    return sellers;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const MarketplaceService = {
  getAllBeastMarketItemsAct,
  getAllWarriorMarketItemsAct,
  getAllLegionsMarketItemsAct,
};

export default MarketplaceService;
