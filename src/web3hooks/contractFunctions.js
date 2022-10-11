import GameConfig from "../config/game.config";
import Constants from "../constants";
import {
  getLegionMp4ImageUrl,
  getLegionJpgImageUrl,
  getWarriorStrength,
} from "../utils/utils";
import { getBeastAddress } from "./getAddress";

// BloodStone
export const getBloodstoneBalance = async (web3, contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getBuyTotalFees = async (contract) => {
  const res = await contract.methods.buyTotalFees().call();
  return res;
};

export const getSellTotalFees = async (contract) => {
  const res = await contract.methods.sellTotalFees().call();
  return res;
};

// Beast
export const getBeastBalance = async (contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return res;
};

export const getAllBeasts = async (contract, account, start, end) => {
  const res = await contract.methods.getAllBeasts(account, start, end).call();
  return res;
};

export const getBeastToken = async (contract, tokenId) => {
  const res = await contract.methods.getBeast(tokenId).call();
  const beast = {
    type: Constants.beastsTypeInfo[parseInt(res) == 20 ? 5 : parseInt(res) - 1],
    capacity: parseInt(res),
  };
  return beast;
};

// Warrior
export const getWarriorBalance = async (contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return res;
};

export const getAllWarriors = async (contract, account, start, end) => {
  const res = await contract.methods.getAllWarriors(account, start, end).call();
  return res;
};

export const getWarriorToken = async (contract, tokenId) => {
  const res = await contract.methods.getWarrior(tokenId).call();
  const warrior = {
    type: Constants.warriorTypeInfo[getWarriorStrength(parseInt(res)) - 1],
    strength: getWarriorStrength(parseInt(res)),
    attackPower: res,
  };
  return warrior;
};

// Legion
export const getLegion = async (contract, tokenId) => {
  const res = await contract.methods.getLegion(tokenId).call();
  return {
    id: tokenId,
    name: res[0],
    beastIds: res[1],
    warriorIds: res[2],
    supplies: Number(res[3]),
    attackPower: Number(res[4]),
    lastHuntTime: Number(res[5]),
    huntStatus: Boolean(res[6]),
    jpg: getLegionJpgImageUrl(parseFloat(res[4])),
    gif: getLegionMp4ImageUrl(parseFloat(res[4])),
  };
};

export const getLegionBalance = async (contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return res;
};

export const getAllLegions = async (contract, account, start, end) => {
  const res = await contract.methods.getAllLegions(account, start, end).call();
  return res;
};

export const getAvailableLegionsCount = async (contract, account) => {
  const res = await contract.methods.getAvailableLegionsCount(account).call();
  return res;
};

export const getMaxAttackPower = async (contract, account) => {
  const res = await contract.methods.getMaxAttackPower(account).call();
  return res;
};

export const getLegionLastHuntTime = async (contract, tokenId) => {
  const res = await contract.methods.lastHuntTime(tokenId).call();
  return res;
};

export const getWarriorCountForMonster25 = async (contract) => {
  const res = await contract.methods.warriorCountForMonster25().call();
  return res;
};

export const getCanAttackMonster25 = async (contract, account) => {
  const res = await contract.methods.canAttackMonster25(account).call();
  return {
    status: res[0],
    count: res[1],
  };
};

export const getCapacityOfLegion = async (contract, tokenId) => {
  const res = await contract.methods.getCapacityOfLegion(tokenId).call();
  return res;
};

export const mintLegion = async (
  contract,
  account,
  legionName,
  beastIds,
  warriorIds,
  fromWhichWallet
) => {
  const res = await contract.methods
    .mint(legionName, beastIds, warriorIds, fromWhichWallet)
    .send({ from: account });
  return res;
};

export const updateLegion = async (
  contract,
  account,
  legionId,
  beastIds,
  warriorIds,
  fromWhichWallet
) => {
  const res = await contract.methods
    .updateLegion(legionId, beastIds, warriorIds, fromWhichWallet)
    .send({ from: account });
  return res;
};

export const addSupply = async (
  contract,
  account,
  tokenId,
  supply,
  fromWallet
) => {
  const res = await contract.methods
    .addSupply(tokenId, supply, fromWallet)
    .send({ from: account });
  return res;
};

// Monster
export const getAllMonsters = async (contract) => {
  const res = await contract.methods.getAllMonsters().call();
  return res;
};

// Hunt
export const initiateHunt = async (contract, account, legionID, monsterID) => {
  const res = await contract.methods
    .initiateHunt(legionID, monsterID)
    .send({ from: account });
  return res;
};

export const revealHunt = async (contract, account) => {
  const res = await contract.methods.hunt().send({ from: account });
  return res;
};

export const initiateMassHunt = async (contract, account) => {
  const res = await contract.methods.initiateMassHunt().send({ from: account });
  return res;
};

export const revealMassHunt = async (contract, account) => {
  return await contract.methods.massHunt().send({ from: account });
};

export const getWalletHuntPendingLegionId = async (contract, account) => {
  const res = await contract.methods.walletHuntPendingTokenId(account).call();
  return res;
};

export const getWalletHuntPendingMonsterId = async (contract, account) => {
  const res = await contract.methods.walletHuntPendingMonsterId(account).call();
  return res;
};

// Reward Pool
export const getUnclaimedWallet = async (web3, contract, account) => {
  const res = await contract.methods.getUnclaimedWallet(account).call();
  return {busd: res[0] / 10**18, blst: res[1] / 10**18 };
};

export const getTaxLeftDays = async (contract, account) => {
  const res = await contract.methods.getTaxLeftDays(account).call();
  return res;
};

export const getReinvestedWalletBalanceInUSD = async (
  web3,
  contract,
  account
) => {
  const res = await contract.methods.reinvestedWallet(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getReinvestedTotalUSD = async (web3, contract, account) => {
  const res = await contract.methods.reinvestedTotalUSD(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getTotalClaimedUSD = async (web3, contract, account) => {
  const res = await contract.methods.totalClaimedUSD(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getAdditionalInvestmentUSD = async (web3, contract, account) => {
  const res = await contract.methods.additionalInvestmentUSD(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getStartupInvestment = async (web3, contract, account) => {
  const res = await contract.methods.startupInvestment(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getClaimMaxTaxPercent = async (contract, samaritanStars) => {
  const res = await contract.methods.claimMaxTaxPercent(samaritanStars).call();
  return res;
};

export const getClaimMinTaxPercent = async (contract, samaritanStars) => {
  const res = await contract.methods.claimMinTaxPercent(samaritanStars).call();
  return res;
};

export const getReinvestTaxPercent = async (contract, samaritanStars) => {
  const res = await contract.methods.reinvestTaxPercent(samaritanStars).call();
  return res;
};

export const getReinvestTimesInTaxCycle = async (contract, account) => {
  const res = await contract.methods.reinvestTimesInTaxCycle(account).call();
  return res;
};

export const getCurrentReinvestPercent = async (contract, account) => {
  const res = await contract.methods.getCurrentReinvestPercent(account).call();
  return res;
};

export const getCurrentTaxCycleStars = async (contract, account) => {
  const res = await contract.methods.getCurrentTaxCycleStars(account).call();
  return res;
};

export const getReinvestPercent = async (
  web3,
  contract,
  account,
  reinvest,
  reinvestingTotalUSD
) => {
  const res = await contract.methods
    .getReinvestPercent(
      account,
      reinvest,
      reinvestingTotalUSD
      // web3.utils.toWei(Number(reinvestingTotalUSD).toString(), "ether")
    )
    .call();
  return res;
};

export const getSamaritanStars = async (contract, account, reinvestPercent) => {
  const res = await contract.methods
    .getSamaritanStars(account, reinvestPercent)
    .call();
  return res;
};

export const getFirstHuntTime = async (contract, account) => {
  const res = await contract.methods.firstHuntTime(account).call();
  return res;
};

export const getAmountsForClaimingAndReinvesting = async (
  web3,
  contract,
  account,
  reinvest,
  reinvestingUSD
) => {
  const res = await contract.methods
    .getAmountsForClaimingAndReinvesting(
      account,
      reinvest,
      reinvestingUSD
      // web3.utils.toWei(reinvestingUSD + "", "ether")
    )
    .call();
  return res;
};

export const claimAndReinvest = async (
  web3,
  contract,
  account,
  reinvest,
  reinvestingInputUSD
) => {
  const res = await contract.methods
    .claimAndReinvest(
      reinvest,
      reinvestingInputUSD
      // web3.utils.toWei(Number(reinvestingInputUSD).toString(), "ether")
    )
    .send({ from: account });
  return res;
};

export const getVoucherWalletUSDBalance = async (web3, contract, account) => {
  const res = await contract.methods.voucherWallet(account).call();
  return web3.utils.fromWei(res, "ether");
};

/**
 * @dev Test Voucher Adding
 */
export const addVoucherWallet = async (
  web3,
  contract,
  account,
  address,
  amount
) => {
  const res = await contract.methods
    .addVoucherWallet(address, web3.utils.toWei(amount, "ether"))
    .send({ from: account });
  return res;
};

// Fee Handler
export const getBLSTAmount = async (web3, contract, amount) => {
  const res = await contract.methods
    .getBLSTAmount(web3.utils.toWei(amount + "", "ether"))
    .call();
  return web3.utils.fromWei(res, "ether");
};

export const getUSDAmount = async (web3, contract, amount) => {
  const res = await contract.methods
    .getUSDAmount(web3.utils.toWei(amount + "", "ether"))
    .call();
  return web3.utils.fromWei(res, "ether");
};

export const getFee = async (contract, index) => {
  const res = await contract.methods.getFee(index).call();
  return res;
};

export const getSummoningPrice = async (web3, contract, amount) => {
  const res = await contract.methods.getSummoningPrice(amount).call();
  return {
    blst: web3.utils.fromWei(res.blstAmount, "ether"),
    busd: web3.utils.fromWei(res.usdAmount, "ether"),
  };
};

export const getTrainingCost = async (web3, contract, amount) => {
  const res = await contract.methods.getTrainingCost(amount).call();
  return {
    busd: web3.utils.fromWei(res[0], "ether"),
    blst: web3.utils.fromWei(res[1], "ether"),
  };
};

export const getCostForAddingWarrior = async (
  web3,
  contract,
  warriorCount,
  supplies
) => {
  const res = await contract.methods
    .getCostForAddingWarrior(warriorCount, supplies)
    .call();
  return {
    busd: web3.utils.fromWei(res[0], "ether"),
    blst: web3.utils.fromWei(res[1], "ether"),
  };
};

export const getSupplyCost = async (web3, contract, warriorCnt, supplyDate) => {
  const res = await contract.methods
    .getSupplyCost(warriorCnt, supplyDate)
    .call();
  return {
    busd: web3.utils.fromWei(res[0], "ether"),
    blst: web3.utils.fromWei(res[1], "ether"),
  };
};

// VRF
export const getVRFResult = async (contract, requestId) => {
  return await contract.methods.getResult(requestId).call();
};

// Common (Warrior & Beast ... )
export const getBloodstoneAllowance = async (
  web3,
  contract,
  approveContract,
  account
) => {
  const res = await contract.methods.allowance(account, approveContract).call();
  return web3.utils.fromWei(res, "ether");
};

export const setBloodstoneApprove = async (
  web3,
  contract,
  approveContract,
  account
) => {
  const res = await contract.methods
    .approve(
      approveContract,
      web3.utils.toWei(GameConfig.approveBLSTForBeast, "ether").toString()
    )
    .send({ from: account });
  return res;
};

export const initialMintBeastAndWarrior = async (
  contract,
  account,
  amount,
  fromWhichWallet
) => {
  const response = await contract.methods
    .initializeMint(amount, fromWhichWallet)
    .send({ from: account });
  return response;
};

export const revealBeastsAndWarrior = async (contract, account) => {
  return await contract.methods.mint().send({ from: account });
};

export const execute = async (contract, account, ids) => {
  const res = await contract.methods.execute(ids).send({ from: account });
  return res;
};

export const isApprovedForAll = async (contract, account, approvalContract) => {
  const res = await contract.methods
    .isApprovedForAll(account, approvalContract)
    .call();
  return res;
};

export const setApprovalForAll = async (
  account,
  contract,
  approvalContract,
  status
) => {
  const res = await contract.methods
    .setApprovalForAll(approvalContract, status)
    .send({ from: account });
  return res;
};

export const getWalletMintPending = async (contract, account) => {
  return await contract.methods.walletMintPending(account).call();
};

export const getMintRequestId = async (contract, account) => {
  return await contract.methods.walletLastRequestId(account).call();
};

export const getWalletHuntPending = async (contract, account) => {
  return await contract.methods.walletHuntPending(account).call();
};

export const getHuntRequestId = async (contract, account) => {
  return await contract.methods.walletLastHuntRequestId(account).call();
};

export const getWalletMassHuntPending = async (contract, account) => {
  return await contract.methods.walletMassHuntPending(account).call();
};

export const getMassHuntRequestId = async (contract, account) => {
  return await contract.methods.walletLastMassHuntRequestId(account).call();
};

// BUSD
export const getBUSDBalance = async (web3, contract, account) => {
  const res = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(res, "ether");
};

export const getLegionBUSDAllowance = async (
  web3,
  contract,
  approvalContract,
  account
) => {
  const response = await contract.methods
    .allowance(account, approvalContract)
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const setBUSDApprove = async (
  web3,
  contract,
  approvalContract,
  account
) => {
  const res = await contract.methods
    .approve(
      approvalContract,
      web3.utils.toWei(GameConfig.approveBUSDForLegion, "ether").toString()
    )
    .send({ from: account });
  return res;
};

// Marketplace
export const sellToken = async (web3, contract, account, type, id, price) => {
  const res = await contract.methods
    .sellToken(type, id, web3.utils.toWei(price, "ether"))
    .send({ from: account });
  return res;
};

export const getAllBeastMarketItems = async (contract, start, end) => {
  const res = await contract.methods.getAllBeastItems(start, end).call();
  return res;
};

export const getAllWarriorMarketItems = async (contract, start, end) => {
  const res = await contract.methods.getAllWarriorItems(start, end).call();
  return res;
};

export const getAllLegionMarketItems = async (contract, start, end) => {
  const res = await contract.methods.getAllLegionItems(start, end).call();
  return res;
};

export const cancelMarketplace = async (contract, account, type, id) => {
  const res = await contract.methods
    .cancelSelling(type, id)
    .send({ from: account });
  return res;
};

export const buyToken = async (web3, contract, account, type, id, price) => {
  console.log(
    account,
    type,
    id,
    price,
    web3.utils.toWei(price.toString(), "ether")
  );
  const res = await contract.methods
    .buyToken(type, id, web3.utils.toWei(price.toString(), "ether"))
    .send({ from: account });
  return res;
};

export const updatePrice = async (web3, contract, account, type, id, price) => {
  console.log(account, type, id, price);
  const res = await contract.methods
    .updatePrice(type, id, web3.utils.toWei(price, "ether"))
    .send({ from: account });
  return res;
};

//Referral
export const getReferrals = async (contract, account) => {
  const res = await contract.methods.getReferrals(account).call();
  return res;
};

export const getComissions = async (contract, account) => {
  const res = await contract.methods.getComissions(account).call();
  return res;
};

export const refer = async (contract, account, referrer) => {
  const res = await contract.methods
    .affiliate(referrer)
    .send({ from: account });
  return res;
};

export const getSummonWarriorsOnFirstDay = async (contract, account) => {
  const res = await contract.methods
    .getSummonedWarriorsOnFirstDay(account)
    .call();
  return res;
};

export const getFreeMintInfo = async (contract, account) => {
  const res = await contract.methods.addressToFreeMintInfo(account).call();
  return res;
};

export const initializeFreeMint = async (contract, account) => {
  const res = await contract.methods
    .initializeFreeMint()
    .send({ from: account });
  return res;
};

export const getAddressToFreeMintGiven = async (contract, account) => {
  const res = await contract.methods.addressToFreeMintGiven(account).call();
  return res;
};


// Duel

export const createDuel = async (contract, account, legionId, tokenPrice, standard) => {
  console.log("===="+legionId);
  const res = await contract.methods.createDuel(legionId, tokenPrice, standard).send({ from: account });
  return res;
}

export const cancelDuel = async (contract, account, duelId) => {
  const res = await contract.methods.cancelDuel(duelId).send({ from: account });
  return res;
}

export const joinDuel = async (contract, account, duelId, legionId, tokenPrice) => {
  const res = await contract.methods.joinDuel(duelId, legionId, tokenPrice).send({ from: account });
  return res;
}

export const updatePrediction = async (contract, account, duelId, price) => {
  const res = await contract.methods.updatePrediction(duelId, price).send({ from: account });
}