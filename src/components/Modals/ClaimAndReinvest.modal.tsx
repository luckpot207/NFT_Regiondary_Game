import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { Box, Checkbox, Dialog, Input, Typography } from "@mui/material";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Axios from "axios";

import { AppDispatch, AppSelector } from "../../store";
import {
  claimAndReinvest,
  getAmountsForClaimingAndReinvesting,
  getClaimMaxTaxPercent,
  getClaimMinTaxPercent,
  getCurrentReinvestPercent,
  getReinvestPercent,
  getReinvestTaxPercent,
  getReinvestTimesInTaxCycle,
  getSamaritanStars,
  getUnclaimedWallet,
} from "../../web3hooks/contractFunctions/rewardpool.contract";
import { getUSDAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import {
  useFeeHandler,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { formatNumber, getTranslation } from "../../utils/utils";
import {
  inventoryState,
  updateInventoryState,
} from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { updateCommonState } from "../../reducers/common.reduer";
import { legionState } from "../../reducers/legion.reducer";
import {
  getVoteByAddress,
  getVoteStatus,
  vote,
  voteState,
} from "../../reducers/vote.reducer";
import { apiConfig } from "../../config/api.config";

const ClaimAndReinvestModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    currentSamaritanStars,
    unclaimedBLST,
    taxLeftDaysForClaim,
    taxLeftDaysForReinvest,
    claimMinTaxPercent,
    futureSamaritanStarsWhenClaim,
    futureSamaritanStarsWhenReinvest,
    futureReinvestPercentWhenReinvest,
    futureReinvestPercentWhenClaim,
    claimedUSD,
  } = AppSelector(inventoryState);

  const unclaimedBLSTFromWei = Number(unclaimedBLST) / 10 ** 18;

  const { claimAndReinvestModalOpen } = AppSelector(modalState);
  const { allLegions } = AppSelector(legionState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const feehandlerContract = useFeeHandler();
  const rewardpoolContract = useRewardPool();

  const claimAmount =
    ((100 - Number(claimMinTaxPercent) - 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLSTFromWei)) /
    100;
  const claimTaxAmount =
    ((Number(claimMinTaxPercent) + 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLSTFromWei)) /
    100;

  const [unclaimedUSD, setUnclaimedUSD] = useState(0);
  const [showOrder, setShowOrder] = useState(0);
  const [reinvestBLSTAmount, setReinvestBLSTAmount] = useState("0");
  const [reinvestUSDAmount, setReinvestUSDAmount] = useState("0");
  const [reinvestAll, setReinvestAll] = useState(false);
  const [claimAndReinvestLoading, setClaimAndReinvestLoading] = useState(false);

  const [futureClaimMaxTaxPercent, setFutureClaimMaxTaxPercent] = useState(0);
  const [futureClaimMinTaxPercent, setFutureClaimMinTaxPercent] = useState(0);
  const [futureReinvestTaxPercent, setFutureReinvestTaxPercent] = useState(0);

  const [isCalculated, setIsCalculated] = useState(false);

  const getBalance = async () => {
    setShowOrder(-2);
    setReinvestBLSTAmount("0");
    setReinvestUSDAmount("0");
    setReinvestAll(false);
    try {
      const { unclaimedUSD, unclaimedBLST } = await getUnclaimedWallet(
        rewardpoolContract,
        account
      );
      setUnclaimedUSD(unclaimedUSD);
      let amountsForClaiming = await getAmountsForClaimingAndReinvesting(
        web3,
        rewardpoolContract,
        account,
        false,
        0
      );
      let futureReinvestPercentWhenClaim = await getReinvestPercent(
        rewardpoolContract,
        account,
        false,
        0
      );
      let futureSamaritanStarsWhenClaim = await getSamaritanStars(
        rewardpoolContract,
        account,
        futureReinvestPercentWhenClaim
      );
      let futureClaimMaxTaxPercent = await getClaimMaxTaxPercent(
        rewardpoolContract,
        futureSamaritanStarsWhenClaim
      );
      let futureReinvestTaxPercent = await getReinvestTaxPercent(
        rewardpoolContract,
        futureSamaritanStarsWhenClaim
      );
      setFutureClaimMaxTaxPercent(futureClaimMaxTaxPercent);
      setFutureReinvestTaxPercent(futureReinvestTaxPercent);
      let amountsForReinvesting = await getAmountsForClaimingAndReinvesting(
        web3,
        rewardpoolContract,
        account,
        true,
        unclaimedUSD
      );
      let futureReinvestPercentWhenReinvest = await getReinvestPercent(
        rewardpoolContract,
        account,
        true,
        unclaimedUSD
      );
      let futureSamaritanStarsWhenReinvest = await getSamaritanStars(
        rewardpoolContract,
        account,
        futureReinvestPercentWhenReinvest
      );

      dispatch(
        updateInventoryState({
          futureReinvestPercentWhenClaim,
          futureSamaritanStarsWhenClaim,
          futureReinvestPercentWhenReinvest,
          futureSamaritanStarsWhenReinvest,
          claimingUSDWithoutTax: web3.utils.fromWei(
            amountsForClaiming[0][0],
            "ether"
          ),
          reinvestingUSDWithoutTax: web3.utils.fromWei(
            amountsForReinvesting[1][0],
            "ether"
          ),
        })
      );
      if (Number(unclaimedBLSTFromWei) === 0) {
        setShowOrder(-1);
      } else {
        setShowOrder(0);
      }
    } catch (error) {
      console.log("claim modal error", error);
    }
  };

  const handleClose = () => {
    dispatch(updateModalState({ claimAndReinvestModalOpen: false }));
  };

  const canVote = async () => {
    const totalAP = allLegions
      .map((legion) => legion.attackPower)
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    if (totalAP < 10000) {
      return false;
    }

    const timestamp = new Date().getTime() - 3 * 24 * 60 * 60 * 1000;
    const query = `
      {
        user(id: ${`"` + account?.toLowerCase() + `"`}){
          huntHistory(
            timestamp_gt: ${timestamp}
            orderBy: timestamp
          ) {
            name
            legionId
            timestamp
          }
        }
      }
      `;
    let graphRes = await Axios.post(apiConfig.subgraphServer, {
      query: query,
    });
    const data = graphRes.data.data.user.huntHistory;
    if (data.length == 0) {
      return false;
    }
  };

  const handleClaimAndReinvestReward = async (reinvested: boolean) => {
    const pastReinvestPercent = getCurrentReinvestPercent(
      rewardpoolContract,
      account
    );
    if (Number(claimedUSD) != 0) {
      toast.error(
        getTranslation("youNeedToEmptyYourClaimWalletFirstBeforeClaimingAgain")
      );
      return;
    }
    setClaimAndReinvestLoading(true);
    try {
      await claimAndReinvest(
        web3,
        rewardpoolContract,
        account,
        reinvested,
        reinvestUSDAmount
      );
      dispatch(updateCommonState({ reloadStatusTime: new Date().getTime() }));
      dispatch(updateModalState({ claimAndReinvestModalOpen: false }));
      const currentReinvestPercent = getCurrentReinvestPercent(
        rewardpoolContract,
        account
      );
      const votePermission = await canVote();
      if (votePermission) {
        if (
          Number(pastReinvestPercent) > 50 &&
          Number(currentReinvestPercent) <= 50
        ) {
          autoVote(false);
        } else if (
          Number(pastReinvestPercent) < 65 &&
          Number(currentReinvestPercent) >= 65
        ) {
          autoVote(true);
        }
      }
    } catch (error) {
      console.log("handleClaimAndReinvestReward error", error);
    }
    setClaimAndReinvestLoading(false);
  };

  const autoVote = async (voteRes: boolean) => {
    dispatch(
      vote({
        address: account as string,
        vote: voteRes as boolean,
      })
    ).then(() => {
      dispatch(getVoteStatus());
      dispatch(getVoteByAddress({ address: account as string }));
    });
  };

  const handleToReinvestShow = async () => {
    try {
      const reinvestTimesInTaxCycle = await getReinvestTimesInTaxCycle(
        rewardpoolContract,
        account
      );
      if (reinvestTimesInTaxCycle == 1 || taxLeftDaysForReinvest == 0) {
        setShowOrder(2);
      } else {
        setShowOrder(1);
      }
      getReinvestSamaritanStars(reinvestUSDAmount);
    } catch (error) {
      console.log(error);
    }
  };

  const getReinvestSamaritanStars = async (reinvestUSDAmount: any) => {
    try {
      console.log(
        "BUSD Amount: ",
        reinvestUSDAmount,
        web3.utils.fromWei(reinvestUSDAmount, "ether")
      );
      console.log("BLST Amount: ", reinvestBLSTAmount);
      let futureReinvestPercent = await getReinvestPercent(
        rewardpoolContract,
        account,
        true,
        reinvestUSDAmount
      );
      let futureSamaritanStars = await getSamaritanStars(
        rewardpoolContract,
        account,
        futureReinvestPercent
      );
      let futureClaimMaxTaxPercent = await getClaimMaxTaxPercent(
        rewardpoolContract,
        futureSamaritanStars
      );
      let futureClaimMinTaxPercent = await getClaimMinTaxPercent(
        rewardpoolContract,
        futureSamaritanStars
      );
      let futureReinvestTaxPercent = await getReinvestTaxPercent(
        rewardpoolContract,
        futureSamaritanStars
      );
      let amountsForReinvesting = await getAmountsForClaimingAndReinvesting(
        web3,
        rewardpoolContract,
        account,
        true,
        reinvestUSDAmount
      );
      console.log("Amount for Reinvesting: ", amountsForReinvesting);
      setFutureClaimMaxTaxPercent(futureClaimMaxTaxPercent);
      setFutureClaimMinTaxPercent(futureClaimMinTaxPercent);
      setFutureReinvestTaxPercent(futureReinvestTaxPercent);
      await dispatch(
        updateInventoryState({
          futureSamaritanStarsWhenReinvest: futureSamaritanStars,
          futureReinvestPercentWhenReinvest: futureReinvestPercent,
          reinvestingUSDWithoutTax: web3.utils.fromWei(
            amountsForReinvesting[1][0],
            "ether"
          ),
          remainUnclaimedUSDWhenReinvest: web3.utils.fromWei(
            amountsForReinvesting[2][1],
            "ether"
          ),
        })
      );
      setIsCalculated(true);
    } catch (error) {
      console.log("Calculation Error: ", error);
    }
  };

  const handleReinvestAmount = async (e: any) => {
    setIsCalculated(false);
    let amount = e.target.value;
    if (amount >= 1) {
      if (amount[0] == "0") {
        amount = amount.slice(1);
      }
    } else if (amount >= 0) {
      if (amount == "") {
        amount = "0";
      }
    } else {
      amount = "0";
    }

    try {
      const usd = await getUSDAmount(web3, feehandlerContract, amount);
      setReinvestBLSTAmount(amount);
      setReinvestUSDAmount(String(web3.utils.toWei(usd, "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReinvestAll = (e: any) => {
    setIsCalculated(false);
    setReinvestAll(e.target.checked);
    if (e.target.checked) {
      console.log("hehe");
      setReinvestBLSTAmount(Number(unclaimedBLSTFromWei).toString());
      setReinvestUSDAmount(unclaimedUSD.toString());
      getReinvestSamaritanStars(unclaimedUSD.toString());
    }
  };

  useEffect(() => {
    getBalance();
  }, [claimAndReinvestModalOpen]);

  useEffect(() => {
    getReinvestSamaritanStars(reinvestUSDAmount);
  }, [reinvestUSDAmount, reinvestAll, unclaimedUSD]);

  return (
    <Dialog onClose={handleClose} open={claimAndReinvestModalOpen}>
      {showOrder !== -2 && (
        <Box sx={{ p: 2, display: "flex" }}>
          <MdClose
            style={{
              marginLeft: "auto",
              fontWeight: "bold",
              fontSize: 14,
              cursor: "pointer",
            }}
            onClick={handleClose}
          />
        </Box>
      )}
      {showOrder === -1 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>
            {getTranslation("youHaveNoInUnclaimedWallet")}
          </Typography>
        </Box>
      )}
      {showOrder === 0 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              {getTranslation("chooseYourTax")}
            </span>
          </Typography>
          <br />
          <Typography>
            {getTranslation("youHaveSthInUnclaimedWallet", {
              CL1: formatNumber(Number(unclaimedBLSTFromWei).toFixed(2)),
              CL2: formatNumber((Number(unclaimedUSD) / 10 ** 18).toFixed(2)),
            })}
          </Typography>
          <Typography>
            {getTranslation("yourCurrentSamaritanRank")}:{" "}
            {currentSamaritanStars}
          </Typography>
          <br />
          <Typography>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              a) {getTranslation("claim")}:
            </span>
            <br />-{" "}
            {getTranslation("ifYouClaimTotal", {
              CL1: Number(unclaimedBLSTFromWei).toFixed(2),
              CL2: Number(taxLeftDaysForClaim) * 2 + Number(claimMinTaxPercent),
            })}
            <br />-{" "}
            {getTranslation("youWillPayClaimTax", {
              CL1: claimTaxAmount.toFixed(2),
              CL2: claimAmount.toFixed(2),
            })}
            <br />-{" "}
            {getTranslation("ifYouWaitWithClaiming", {
              CL1: Number(claimMinTaxPercent),
              CL2: Number(taxLeftDaysForClaim),
            })}
            <br />-{" "}
            {getTranslation("yourTaxLevelsWillBeReset", {
              CL1: futureClaimMaxTaxPercent,
              CL2: futureReinvestTaxPercent,
            })}
            <br />-{" "}
            {getTranslation("yourNewSamaritanRankWill", {
              CL1: futureSamaritanStarsWhenClaim,
            })}
            <br />-{" "}
            {getTranslation("yourNewReinvestPercentageWill", {
              CL1: futureReinvestPercentWhenClaim,
            })}
          </Typography>
          <br />
          <Typography>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              b) {getTranslation("reinvest")}:
            </span>
            <br />-{" "}
            {getTranslation("onAllYouTransferToYourReinvestWallet", {
              CL1: 2 * Number(taxLeftDaysForReinvest),
            })}
            <br />-{" "}
            {getTranslation("youWillPayReinvestTax", {
              CL1: (
                (2 *
                  Number(taxLeftDaysForReinvest) *
                  Number(unclaimedBLSTFromWei)) /
                100
              ).toFixed(2),
              CL2: (
                ((100 - 2 * Number(taxLeftDaysForReinvest)) *
                  Number(unclaimedBLSTFromWei)) /
                100
              ).toFixed(2),
            })}
            <br />-{" "}
            {getTranslation("youWillReachTheMinimumReinvestTax", {
              CL1: 0,
              CL2: Number(taxLeftDaysForReinvest),
            })}
            <br />-{" "}
            {getTranslation("yourNewSamaritanRankWill", {
              CL1:
                isCalculated || reinvestAll
                  ? futureSamaritanStarsWhenReinvest
                  : "...",
            })}
            <br />-{" "}
            {getTranslation("yourNewReinvestPercentageWill", {
              CL1:
                isCalculated || reinvestAll
                  ? futureReinvestPercentWhenReinvest
                  : "...",
            })}
          </Typography>
          <br />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FireBtn
              onClick={() => handleClaimAndReinvestReward(false)}
              loading={claimAndReinvestLoading}
            >
              {getTranslation("claim")}
            </FireBtn>
            <FireBtn
              onClick={() => handleToReinvestShow()}
              disabled={claimAndReinvestLoading}
            >
              {getTranslation("reinvest")}
            </FireBtn>
          </Box>
        </Box>
      )}
      {showOrder === 1 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>
            {getTranslation("amountToTransferToYourReinvestWallet")}
          </Typography>
          <Input
            inputProps={{ step: "0.1" }}
            value={reinvestBLSTAmount}
            onChange={handleReinvestAmount}
            disabled={reinvestAll || claimAndReinvestLoading}
            type="number"
          />
          ${getTranslation("blst")}
          <Checkbox
            checked={reinvestAll}
            onChange={(e) => handleReinvestAll(e)}
            disabled={claimAndReinvestLoading}
          />
          {getTranslation("reinvestAll")}
          <Typography variant="subtitle1">
            (= {Number(Number(reinvestUSDAmount) / 10 ** 18).toFixed(2)} USD)
          </Typography>
          {Number(reinvestUSDAmount) === 0 && (
            <Typography color={"#fb3636"}>
              {getTranslation("youCannotReinvest0")}
            </Typography>
          )}
          {Number(reinvestUSDAmount) > Number(unclaimedUSD) && (
            <Typography color={"#fb3636"}>
              {getTranslation("youCannotReinvestMoreThan")}
            </Typography>
          )}
          <br />
          <Typography>
            -{" "}
            {getTranslation("youWillPayReinvestTax", {
              CL1: (
                (parseFloat(reinvestBLSTAmount) *
                  2 *
                  Number(taxLeftDaysForReinvest)) /
                100
              ).toFixed(2),
              CL2: (
                (parseFloat(reinvestBLSTAmount) *
                  (100 - 2 * Number(taxLeftDaysForReinvest))) /
                100
              ).toFixed(2),
            })}
            <br />-{" "}
            {getTranslation("yourNewSamaritanRankWill", {
              CL1:
                isCalculated || reinvestAll
                  ? futureSamaritanStarsWhenReinvest
                  : "...",
            })}
            <br />-{" "}
            {getTranslation("yourNewReinvestPercentageWill", {
              CL1:
                isCalculated || reinvestAll
                  ? futureReinvestPercentWhenReinvest
                  : "...",
            })}
            <br />- {getTranslation("noChangeToYourClaimTax")}
            <br />-{" "}
            {getTranslation("noChangeToYourReinvestTax", {
              CL1: Number(taxLeftDaysForReinvest),
            })}
            <br />-{" "}
            {getTranslation("youCannotTransferMoneyOutOfReinvestWallet")}
          </Typography>
          <br />
          <FireBtn
            onClick={() => handleClaimAndReinvestReward(true)}
            loading={claimAndReinvestLoading}
            disabled={
              Number(reinvestUSDAmount) > Number(unclaimedUSD) ||
              Number(reinvestUSDAmount) === 0
            }
          >
            {getTranslation("transferToReinvest")}
          </FireBtn>
        </Box>
      )}
      {showOrder === 2 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>
            {getTranslation("amountToTransferToYourReinvestWallet")}
          </Typography>
          <Input
            inputProps={{ step: "0.1" }}
            value={reinvestBLSTAmount}
            onChange={handleReinvestAmount}
            disabled={reinvestAll || claimAndReinvestLoading}
            type="number"
          />
          ${getTranslation("blst")}
          <Checkbox
            checked={reinvestAll}
            onChange={(e) => handleReinvestAll(e)}
            disabled={claimAndReinvestLoading}
          />
          {getTranslation("reinvestAll")}
          <Typography variant="subtitle1">
            (= {Number(Number(reinvestUSDAmount) / 10 ** 18).toFixed(2)} USD)
          </Typography>
          {Number(reinvestUSDAmount) === 0 && (
            <Typography color={"#fb3636"}>
              {getTranslation("youCannotReinvest0")}
            </Typography>
          )}
          {Number(reinvestUSDAmount) > Number(unclaimedUSD) && (
            <Typography color={"#fb3636"}>
              {getTranslation("youCannotReinvestMoreThan")}
            </Typography>
          )}
          <br />
          {Number(taxLeftDaysForReinvest) !== 0 ? (
            <Typography>
              {getTranslation("youWillPayReinvestTax", {
                CL1: (
                  (parseFloat(reinvestBLSTAmount) *
                    2 *
                    Number(taxLeftDaysForReinvest)) /
                  100
                ).toFixed(2),
                CL2: (
                  (parseFloat(reinvestBLSTAmount) *
                    (100 - 2 * Number(taxLeftDaysForReinvest))) /
                  100
                ).toFixed(2),
              })}
              <br />
              {getTranslation("yourNewSamaritanRankWill", {
                CL1: futureSamaritanStarsWhenReinvest,
              })}
              <br />
              {getTranslation("yourNewReinvestPercentageWill", {
                CL1: futureReinvestPercentWhenReinvest,
              })}
              <br />
              {getTranslation("yourAmountOfReinvestTaxDays", {
                CL1: taxLeftDaysForReinvest,
              })}
            </Typography>
          ) : (
            <Typography>
              {getTranslation("reinvestTax", {
                CL1: Number(reinvestBLSTAmount).toFixed(2),
              })}
              <br />
              {getTranslation("yourNewSamaritanRankWill", {
                CL1: futureSamaritanStarsWhenReinvest,
              })}
              <br />
              {getTranslation("yourNewReinvestPercentageWill", {
                CL1: futureReinvestPercentWhenReinvest,
              })}
            </Typography>
          )}
          <br />
          <Typography>
            {getTranslation("yourTaxLevelsWillBeResetTo")}
            <br />-{" "}
            {getTranslation("claimTaxDecreasing", {
              CL1: futureClaimMaxTaxPercent,
              CL2: 2,
              CL3:
                (Number(futureClaimMaxTaxPercent) -
                  Number(futureClaimMinTaxPercent)) /
                2,
              CL4: Number(futureClaimMinTaxPercent),
            })}
            <br />-{" "}
            {getTranslation("reinvestTaxDecreasing", {
              CL1: futureReinvestTaxPercent,
              CL2: 2,
              CL3: Number(futureReinvestTaxPercent) / 2,
              CL4: 0,
            })}
          </Typography>
          <br />
          <FireBtn
            onClick={() => handleClaimAndReinvestReward(true)}
            loading={claimAndReinvestLoading}
            disabled={
              Number(reinvestUSDAmount) > Number(unclaimedUSD) ||
              Number(reinvestUSDAmount) === 0
            }
          >
            {getTranslation("transferToReinvest")}
          </FireBtn>
        </Box>
      )}
    </Dialog>
  );
};

export default ClaimAndReinvestModal;
