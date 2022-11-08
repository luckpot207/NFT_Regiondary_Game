import Web3 from "web3";
import { Contract } from "web3-eth-contract";

import { updateCommonState } from "../reducers/common.reduer";
import { AppDispatch } from "../store";
import {
  getBuyTotalFees,
  getSellTotalFees,
} from "../web3hooks/contractFunctions/blst.contract";
import {
  getFee,
  getSummoningPrice,
} from "../web3hooks/contractFunctions/feehandler.contract";

const getSummonPrices = async (
  dispatch: AppDispatch,
  web3: Web3,
  feehandlerContract: Contract
) => {
  try {
    let price1 = await getSummoningPrice(web3, feehandlerContract, "1");
    let price10 = await getSummoningPrice(web3, feehandlerContract, "10");
    let price50 = await getSummoningPrice(web3, feehandlerContract, "50");
    let price100 = await getSummoningPrice(web3, feehandlerContract, "100");
    let price150 = await getSummoningPrice(web3, feehandlerContract, "150");
    let summonPrice = {
      p1: { usd: price1.busd, blst: price1.blst },
      p10: { usd: price10.busd, blst: price10.blst },
      p50: { usd: price50.busd, blst: price50.blst },
      p100: { usd: price100.busd, blst: price100.blst },
      p150: { usd: price150.busd, blst: price150.blst },
    };
    dispatch(updateCommonState({ summonPrice }));
  } catch (error) {
    console.log(error);
  }
};

const getNadodoWatch = async (
  dispatch: AppDispatch,
  feehandlerContract: Contract,
  bloodstoneContract: Contract
) => {
  try {
    const marketplaceTax = (await getFee(feehandlerContract, 0)) / 100;
    const huntTax = (await getFee(feehandlerContract, 1)) / 100;
    const damageReduction = (await getFee(feehandlerContract, 2)) / 100;
    const summonFee = await getFee(feehandlerContract, 3);
    const suppliesFee14 = await getFee(feehandlerContract, 4);
    const suppliesFee28 = await getFee(feehandlerContract, 5);
    const buyTax = await getBuyTotalFees(bloodstoneContract);
    const sellTax = await getSellTotalFees(bloodstoneContract);

    dispatch(
      updateCommonState({
        marketplaceTax: Number(marketplaceTax),
        huntTax: Number(huntTax),
        damageReduction: Number(damageReduction),
        summonFee: Number(summonFee),
        suppliesFee14: Number(suppliesFee14),
        suppliesFee28: Number(suppliesFee28),
        buyTax: Number(buyTax),
        sellTax: Number(sellTax),
      })
    );
  } catch (error) {}
};

const CommonService = {
  getSummonPrices,
  getNadodoWatch,
};

export default CommonService;
