import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { updateInventoryState } from "../reducers/inventory.reducer";

import { AppDispatch } from "../store";
import { getBeastBalance } from "../web3hooks/contractFunctions/beast.contract";
import { getWarriorBalance } from "../web3hooks/contractFunctions/warrior.contract";
import { getBloodstoneBalance } from "../web3hooks/contractFunctions/blst.contract";
import {
  getBLSTAmount,
  getUSDAmount,
} from "../web3hooks/contractFunctions/feehandler.contract";
import {
  getAvailableLegionsCount,
  getLegionBalance,
  getMaxAttackPower,
} from "../web3hooks/contractFunctions/legion.contract";
import {
  getAdditionalInvestmentUSD,
  getClaimMinTaxPercent,
  getCurrentReinvestPercent,
  getCurrentTaxCycleStars,
  getFirstHuntTime,
  getReinvestedTotalUSD,
  getReinvestedWalletBalanceInUSD,
  getSamaritanStars,
  getStartupInvestment,
  getTaxLeftDays,
  getTotalClaimedUSD,
  getUnclaimedWallet,
  getVoucherWalletUSDBalance,
  getClaimedUSD,
} from "../web3hooks/contractFunctions/rewardpool.contract";

const getInventory = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  beastContract: Contract,
  warriorContract: Contract,
  legionContract: Contract,
  feehandlerContract: Contract
) => {
  try {
    const beastBalance = await getBeastBalance(beastContract, account);
    const warriorBalance = await getWarriorBalance(warriorContract, account);
    const legionBalance = await getLegionBalance(legionContract, account);
    const availableLegionsCount = await getAvailableLegionsCount(
      legionContract,
      account
    );
    const maxAttackPower = await getMaxAttackPower(legionContract, account);
    const USDToBLST = await getBLSTAmount(web3, feehandlerContract, 1);
    const BLSTToUSD = await getUSDAmount(web3, feehandlerContract, 1);
    dispatch(
      updateInventoryState({
        beastBalance,
        warriorBalance,
        legionBalance,
        availableLegionsCount,
        maxAttackPower,
        USDToBLST,
        BLSTToUSD,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const getWalletAndUnclaimedBalance = async (
  dispatch: AppDispatch,
  web3: Web3,
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
    const BUSDForTotalBLST = await getUSDAmount(
      web3,
      feehandlerContract,
      BLSTBalance
    );
    const { unclaimedUSD, unclaimedBLST } = await getUnclaimedWallet(
      rewardpoolContract,
      account
    );
    const claimedUSD = await getClaimedUSD(rewardpoolContract, account);
    const claimedBLST = await getBLSTAmount(
      web3,
      feehandlerContract,
      claimedUSD
    );
    dispatch(
      updateInventoryState({
        BLSTBalance,
        BUSDForTotalBLST,
        unclaimedBLST,
        unclaimedUSD,
        claimedUSD,
        claimedBLST,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
const getClaimAndReinvestInfo = async (
  dispatch: AppDispatch,
  account: any,
  rewardpoolContract: Contract
) => {
  try {
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
    const currentTaxCycleStars = await getCurrentTaxCycleStars(
      rewardpoolContract,
      account
    );
    const claimMinTaxPercent = await getClaimMinTaxPercent(
      rewardpoolContract,
      currentTaxCycleStars
    );
    dispatch(
      updateInventoryState({
        taxLeftDaysForClaim,
        taxLeftDaysForReinvest,
        currentReinvestPercent,
        currentSamaritanStars,
        currentTaxCycleStars,
        claimMinTaxPercent,
      })
    );
  } catch (error) {}
};

const getSamaritanInfo = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  rewardpoolContract: Contract
) => {
  try {
    const startupInvestment = await getStartupInvestment(
      web3,
      rewardpoolContract,
      account
    );
    const reinvestedTotalUSD = await getReinvestedTotalUSD(
      web3,
      rewardpoolContract,
      account
    );
    const totalClaimedUSD = await getTotalClaimedUSD(
      web3,
      rewardpoolContract,
      account
    );
    const additionalInvestment = await getAdditionalInvestmentUSD(
      web3,
      rewardpoolContract,
      account
    );
    const firstHuntTime = await getFirstHuntTime(rewardpoolContract, account);
    const daysLeftUntilAbove3Stars =
      firstHuntTime == 0
        ? 30
        : 30 -
            Math.ceil(
              (new Date().getTime() - firstHuntTime * 1000) / (1000 * 120)
            ) >
          0
        ? 30 -
          Math.ceil(
            (new Date().getTime() - firstHuntTime * 1000) / (1000 * 120)
          )
        : 0;
    dispatch(
      updateInventoryState({
        startupInvestment,
        reinvestedTotalUSD,
        totalClaimedUSD,
        additionalInvestment,
        daysLeftUntilAbove3Stars,
      })
    );
  } catch (error) {}
};

const getReinvestedAndVoucherBalance = async (
  dispatch: AppDispatch,
  web3: Web3,
  account: any,
  rewardpoolContract: Contract,
  feehandlerContract: Contract
) => {
  try {
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
    const voucherWalletUSD = await getVoucherWalletUSDBalance(
      web3,
      rewardpoolContract,
      account
    );
    dispatch(
      updateInventoryState({
        reinvestedWalletUSD,
        reinvestedWalletBLST,
        voucherWalletUSD,
      })
    );
  } catch (error) {}
};
const InventoryService = {
  getInventory,
  getWalletAndUnclaimedBalance,
  getClaimAndReinvestInfo,
  getSamaritanInfo,
  getReinvestedAndVoucherBalance,
};

export default InventoryService;
