import { gameState, updateState } from "../reducers/cryptolegions.reducer";
import { AppDispatch, AppSelector } from "../store";
import { Contract } from "web3-eth-contract";
import {
  getAvailableLegionsCount,
  getBeastBalance,
  getBloodstoneBalance,
  getBLSTAmount,
  getBuyTotalFees,
  getClaimMinTaxPercent,
  getCurrentReinvestPercent,
  getFee,
  getFirstHuntTime,
  getLegionBalance,
  getMaxAttackPower,
  getReinvestedWalletBalanceInUSD,
  getSamaritanStars,
  getSellTotalFees,
  getSummoningPrice,
  getTaxLeftDays,
  getUnclaimedWallet,
  getUSDAmount,
  getVoucherWalletUSDBalance,
  getWarriorBalance,
  getClaimedUSD,
} from "../web3hooks/contractFunctions";
import { getSamaritanStarsWithPercentAndFirstHuntTime } from "../utils/utils";
import { addSamaritanStarHolder } from "../reducers/cryptolegions.reducer";

export const getUserInfo = async (
  dispatch: AppDispatch,
  web3: any,
  account: any,
  bloodstoneContract: Contract,
  rewardpoolContract: Contract,
  feehandlerContract: Contract
) => {
  try {
    const BLSTBalance = await getBloodstoneBalance(
      web3,
      bloodstoneContract,
      account
    );
    
    const { busd, blst } = await getUnclaimedWallet(web3, rewardpoolContract, account);
    const claimedUSD = await getClaimedUSD(rewardpoolContract, account);
    const claimedBLST = await getBLSTAmount(
      web3,
      feehandlerContract,
      claimedUSD
    );
    const taxLeftDaysForClaim = (
      await getTaxLeftDays(rewardpoolContract, account)
    )[0];
    const taxLeftDaysForReinvest = (
      await getTaxLeftDays(rewardpoolContract, account)
    )[1];
    const currentReinvestPercent = await getCurrentReinvestPercent(
      rewardpoolContract,
      account
    );
    const currentSamaritanStars = await getSamaritanStars(
      rewardpoolContract,
      account,
      currentReinvestPercent
    );
    const claimMinTaxPercent = await getClaimMinTaxPercent(
      rewardpoolContract,
      currentSamaritanStars
    );
    const reinvestedWalletUSD = await getReinvestedWalletBalanceInUSD(
      web3,
      rewardpoolContract,
      account
    );
    const reinvestedWalletBLST = await getBLSTAmount(
      web3,
      feehandlerContract,
      reinvestedWalletUSD
    );
    const firstHuntTime = await getFirstHuntTime(rewardpoolContract, account);
    const daysLeftUntilAbove3Stars =
      firstHuntTime == 0
        ? 30
        : 30 -
            Math.ceil(
              (new Date().getTime() - firstHuntTime * 1000) /
                (1000 * 60 * 3600 * 24)
            ) >
          0
        ? 30 -
          Math.ceil(
            (new Date().getTime() - firstHuntTime * 1000) /
              (1000 * 60 * 3600 * 24)
          )
        : 0;
    const voucherWalletUSD = await getVoucherWalletUSDBalance(
      web3,
      rewardpoolContract,
      account
    );
    dispatch(
      updateState({
        BLSTBalance,
        unclaimedUSD: busd,
        unclaimedBLST: blst,
        claimedUSD: claimedUSD,
        claimedBLST: claimedBLST,
        currentSamaritanStars,
        reinvestedWalletBLST,
        reinvestedWalletUSD,
        taxLeftDaysForClaim,
        taxLeftDaysForReinvest,
        claimMinTaxPercent,
        currentReinvestPercent,
        firstHuntTime,
        daysLeftUntilAbove3Stars,
        voucherWalletUSD,
      })
    );
  } catch (error) {
    console.log("user info : ", error);
  }
};

export const getInventory = async (
  dispatch: AppDispatch,
  web3: any,
  account: any,
  bloodstoneContract: Contract,
  beastContract: Contract,
  warriorContract: Contract,
  legionContract: Contract,
  rewardpoolContract: Contract,
  feehandlerContract: Contract
) => {
  dispatch(updateState({ inventoryLoading: true }));
  try {
    const BLSTBalance = await getBloodstoneBalance(
      web3,
      bloodstoneContract,
      account
    );
    const beastBalance = await getBeastBalance(beastContract, account);
    const warriorBalance = await getWarriorBalance(warriorContract, account);
    const legionBalance = await getLegionBalance(legionContract, account);
    const availableLegionsCount = await getAvailableLegionsCount(
      legionContract,
      account
    );
    const {busd, blst} = await getUnclaimedWallet(
      web3,
      rewardpoolContract,
      account
    );
    const claimedUSD = await getClaimedUSD(rewardpoolContract, account);
    const claimedBLST = await getBLSTAmount(
      web3,
      feehandlerContract,
      claimedUSD
    );
    const maxAttackPower = await getMaxAttackPower(legionContract, account);
    const USDToBLST = await getBLSTAmount(web3, feehandlerContract, 1);
    const BLSTToUSD = await getUSDAmount(web3, feehandlerContract, 1);
    const BUSDForTotalBLST = await getUSDAmount(
      web3,
      feehandlerContract,
      BLSTBalance
    );
    dispatch(
      updateState({
        BLSTBalance,
        beastBalance,
        warriorBalance,
        legionBalance,
        availableLegionsCount,
        unclaimedBLST: blst,
        claimedUSD: claimedUSD,
        claimedBLST: claimedBLST,
        maxAttackPower,
        USDToBLST,
        BLSTToUSD,
        BUSDForTotalBLST,
      })
    );
  } catch (error) {
    console.log(error);
  }
  dispatch(updateState({ inventoryLoading: false }));
};

export const getSummonPrices = async (
  dispatch: AppDispatch,
  web3: any,
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
    dispatch(updateState({ summonPrice }));
  } catch (error) {
    console.log(error);
  }
};

export const getNadodoWatch = async (
  dispatch: AppDispatch,
  feehandlerContract: Contract,
  bloodstoneContract: Contract
) => {
  dispatch(updateState({ nadodoWatchLoading: true }));
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
      updateState({
        marketplaceTax,
        huntTax,
        damageReduction,
        summonFee,
        suppliesFee14,
        suppliesFee28,
        buyTax,
        sellTax,
      })
    );
  } catch (error) {}
  dispatch(updateState({ nadodoWatchLoading: false }));
};
