import {
  Box,
  Checkbox,
  Dialog,
  Input,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../helpers/basicInfo";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import {
  claimAndReinvest,
  getAmountsForClaimingAndReinvesting,
  getClaimMaxTaxPercent,
  getClaimMinTaxPercent,
  getReinvestPercent,
  getReinvestTaxPercent,
  getReinvestTimesInTaxCycle,
  getSamaritanStars,
  getUnclaimedWallet,
  getUSDAmount,
} from "../../web3hooks/contractFunctions";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { MdClose } from "react-icons/md";

const ClaimAndReinvestModal: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    language,
    claimAndReinvestModalOpen,
    currentSamaritanStars,
    unclaimedBLST,
    taxLeftDaysForClaim,
    taxLeftDaysForReinvest,
    claimMinTaxPercent,
    futureSamaritanStarsWhenClaim,
    futureSamaritanStarsWhenReinvest,
  } = AppSelector(gameState);

  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const feehandlerContract = useFeeHandler();
  const bloodstoneContract = useBloodstone();
  const legionContract = useLegion();
  const rewardpoolContract = useRewardPool();

  // States
  const claimAmount =
    ((100 - Number(claimMinTaxPercent) - 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLST)) /
    100;
  const claimTaxAmount =
    ((Number(claimMinTaxPercent) + 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLST)) /
    100;

  const [unclaimedUSD, setUnclaimedUSD] = useState(0);
  const [showOrder, setShowOrder] = useState(0);
  const [reinvestBLSTAmount, setReinvestBLSTAmount] = useState("0");
  const [reinvestUSDAmount, setReinvestUSDAmount] = useState(0);
  const [reinvestAll, setReinvestAll] = useState(false);
  const [claimAndReinvestLoading, setClaimAndReinvestLoading] = useState(false);

  const [futureClaimMaxTaxPercent, setFutureClaimMaxTaxPercent] = useState(0);
  const [futureClaimMinTaxPercent, setFutureClaimMinTaxPercent] = useState(0);
  const [futureReinvestTaxPercent, setFutureReinvestTaxPercent] = useState(0);

  // Functions
  const getBalance = async () => {
    setShowOrder(-2);
    setReinvestBLSTAmount("0");
    setReinvestUSDAmount(0);
    setReinvestAll(false);
    try {
      const { busd, blst } = await getUnclaimedWallet(
        web3,
        rewardpoolContract,
        account
      );
      setUnclaimedUSD(busd);
      console.log("unclaimed USD", busd);
      let amountsForClaiming = await getAmountsForClaimingAndReinvesting(
        web3,
        rewardpoolContract,
        account,
        false,
        0
      );
      console.log("amountsForClaiming: ", amountsForClaiming);
      let futureReinvestPercentWhenClaim = await getReinvestPercent(
        web3,
        rewardpoolContract,
        account,
        false,
        0
      );
      console.log(
        "futureReinvestPercentWhenClaim: ",
        futureReinvestPercentWhenClaim
      );
      let futureSamaritanStarsWhenClaim = await getSamaritanStars(
        rewardpoolContract,
        account,
        futureReinvestPercentWhenClaim
      );
      console.log(
        "futureSamaritanStarsWhenClaim:",
        futureSamaritanStarsWhenClaim
      );
      let amountsForReinvesting = await getAmountsForClaimingAndReinvesting(
        web3,
        rewardpoolContract,
        account,
        true,
        unclaimedUSD
        // Number(Number(unclaimedUSD).toFixed(0))
      );
      console.log("amountsForReinvesting: ", amountsForReinvesting);
      let futureReinvestPercentWhenReinvest = await getReinvestPercent(
        web3,
        rewardpoolContract,
        account,
        true,
        unclaimedUSD
        // Number(Number(unclaimedUSD).toFixed(0))
      );
      let futureSamaritanStarsWhenReinvest = await getSamaritanStars(
        rewardpoolContract,
        account,
        futureReinvestPercentWhenReinvest
      );

      dispatch(
        updateState({
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
      if (Number(unclaimedBLST) === 0) {
        setShowOrder(-1);
      } else {
        setShowOrder(0);
      }
    } catch (error) {
      console.log("claim modal error", error);
    }
  };

  const handleClose = () => {
    dispatch(updateState({ claimAndReinvestModalOpen: false }));
  };

  const handleClaimAndReinvestReward = async (reinvested: boolean) => {
    setClaimAndReinvestLoading(true);
    try {
      let amountsForReinvesting = await getAmountsForClaimingAndReinvesting(
        web3,
        rewardpoolContract,
        account,
        true,
        reinvestUSDAmount
      );
      console.log("amountsForReinvesting: ", amountsForReinvesting);
      await claimAndReinvest(
        web3,
        rewardpoolContract,
        account,
        reinvested,
        reinvestUSDAmount
      );
      getUserInfo(
        dispatch,
        web3,
        account,
        bloodstoneContract,
        rewardpoolContract,
        feehandlerContract
      );
      dispatch(updateState({ claimAndReinvestModalOpen: false }));
    } catch (error) {
      console.log("handleClaimAndReinvestReward error", error);
    }
    setClaimAndReinvestLoading(false);
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
      getReinvestSamaritanStars();
    } catch (error) {
      console.log(error);
    }
  };

  const getReinvestSamaritanStars = async () => {
    try {
      let futureReinvestPercent = await getReinvestPercent(
        web3,
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
      console.log("amountsForReinvesting: ", amountsForReinvesting);
      setFutureClaimMaxTaxPercent(futureClaimMaxTaxPercent);
      setFutureClaimMinTaxPercent(futureClaimMinTaxPercent);
      setFutureReinvestTaxPercent(futureReinvestTaxPercent);
      dispatch(
        updateState({
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
    } catch (error) {
      console.log("getReinvestSamaritanStars: ", error);
    }
  };

  const handleReinvestAmount = async (e: any) => {
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
    setReinvestBLSTAmount(amount);

    try {
      const usd = await getUSDAmount(web3, feehandlerContract, amount);
      setReinvestUSDAmount(Number(web3.utils.toWei(usd, "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReinvestAll = (e: any) => {
    setReinvestAll(e.target.checked);
    if (e.target.checked) {
      setReinvestBLSTAmount(Number(unclaimedBLST).toString());
      setReinvestUSDAmount(unclaimedUSD);
    }
  };

  useEffect(() => {
    getBalance();
  }, [claimAndReinvestModalOpen]);

  useEffect(() => {
    getReinvestSamaritanStars();
  }, [reinvestUSDAmount, reinvestAll, unclaimedUSD]);

  return (
    <Dialog onClose={handleClose} open={claimAndReinvestModalOpen.valueOf()}>
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
            You have no $BLST in your Unclaimed Wallet. Go more hunting!
          </Typography>
        </Box>
      )}
      {showOrder === 0 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              Choose your tax
            </span>
          </Typography>
          <br />
          <Typography>
            Your current Samaritan Rank: {currentSamaritanStars}
          </Typography>
          <br />
          <Typography>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>a) Claim:</span>
            <br />- If you claim your total {Number(unclaimedBLST).toFixed(
              2
            )}{" "}
            BLST to your wallet, then you will pay{" "}
            {Number(taxLeftDaysForClaim) * 2 + Number(claimMinTaxPercent)}%
            Claim Tax today.
            <br />- You will pay {claimTaxAmount.toFixed(2)} BLST Claim Tax, and
            get {claimAmount.toFixed(2)} BLST in your Metamask wallet.
            <br />- You will reach the minimum Claim Tax of{" "}
            {Number(claimMinTaxPercent)}% in {Number(taxLeftDaysForClaim)} days.
            <br />- Your new Samaritan Rank will be{" "}
            {futureSamaritanStarsWhenClaim}.
          </Typography>
          <br />
          <Typography>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              b) Reinvest:
            </span>
            <br />- On all BLST you transfer to your Reinvest Wallet, you will
            pay {2 * Number(taxLeftDaysForReinvest)}% Reinvest Tax today.
            <br />- You will pay{" "}
            {(
              (2 * Number(taxLeftDaysForReinvest) * Number(unclaimedBLST)) /
              100
            ).toFixed(2)}{" "}
            BLST Reinvest Tax, and get{" "}
            {(
              ((100 - 2 * Number(taxLeftDaysForReinvest)) *
                Number(unclaimedBLST)) /
              100
            ).toFixed(2)}{" "}
            BLST in your Reinvest Wallet.
            <br />- You will reach the minimum Reinvest Tax of {0}% in{" "}
            {Number(taxLeftDaysForReinvest)} days.
            <br />- Your new Samaritan Rank will be{" "}
            {futureSamaritanStarsWhenReinvest}.
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
              Claim
            </FireBtn>
            <FireBtn
              onClick={() => handleToReinvestShow()}
              disabled={claimAndReinvestLoading}
            >
              Reinvest
            </FireBtn>
          </Box>
        </Box>
      )}
      {showOrder === 1 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>Amount to transfer to your Reinvest wallet</Typography>
          <Input
            inputProps={{ step: "0.1" }}
            value={reinvestBLSTAmount}
            onChange={handleReinvestAmount}
            disabled={reinvestAll || claimAndReinvestLoading}
            type="number"
          />
          $BLST
          <Checkbox
            checked={reinvestAll}
            onChange={(e) => handleReinvestAll(e)}
            disabled={claimAndReinvestLoading}
          />
          Reinvest All
          <Typography variant="subtitle1">
            (= {Number(reinvestUSDAmount / 10 ** 18).toFixed(2)} USD)
          </Typography>
          {Number(reinvestUSDAmount) === 0 && (
            <Typography color={"#fb3636"}>You cannot reinvest 0.</Typography>
          )}
          {Number(reinvestUSDAmount) > Number(unclaimedUSD) && (
            <Typography color={"#fb3636"}>
              You cannot reinvest more than the amount in your Unclaimed Wallet.
            </Typography>
          )}
          <br />
          <Typography>
            - You will pay{" "}
            {(
              (parseFloat(reinvestBLSTAmount) *
                2 *
                Number(taxLeftDaysForReinvest)) /
              100
            ).toFixed(2)}{" "}
            BLST Reinvest Tax, and get{" "}
            {(
              (parseFloat(reinvestBLSTAmount) *
                (100 - 2 * Number(taxLeftDaysForReinvest))) /
              100
            ).toFixed(2)}{" "}
            BLST in your Reinvest Wallet.
            <br />- Your new Samaritan Rank will be{" "}
            {futureSamaritanStarsWhenReinvest}.
            <br />- There will be no change to your Claim Tax length/percentage.
            <br />- There will be no change to your Reinvest Tax, and you will
            reach the minimum Reinvest Tax of 0 % in{" "}
            {Number(taxLeftDaysForReinvest)} days.
            <br />- You cannot transfer money out of the Reinvest Wallet. You
            can only use the Reinvest Wallet to pay for items within the game.
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
            Transfer to Reinvest
          </FireBtn>
        </Box>
      )}
      {showOrder === 2 && (
        <Box sx={{ p: 4, pt: 0 }}>
          <Typography>Amount to transfer to your Reinvest wallet</Typography>
          <Input
            inputProps={{ step: "0.1" }}
            value={reinvestBLSTAmount}
            onChange={handleReinvestAmount}
            disabled={reinvestAll || claimAndReinvestLoading}
            type="number"
          />
          $BLST
          <Checkbox
            checked={reinvestAll}
            onChange={(e) => handleReinvestAll(e)}
            disabled={claimAndReinvestLoading}
          />
          Reinvest All
          <Typography variant="subtitle1">
            (= {Number(reinvestUSDAmount / 10 ** 18).toFixed(2)} USD)
          </Typography>
          {Number(reinvestUSDAmount) === 0 && (
            <Typography color={"#fb3636"}>You cannot reinvest 0.</Typography>
          )}
          {Number(reinvestUSDAmount) > Number(unclaimedUSD) && (
            <Typography color={"#fb3636"}>
              You cannot reinvest more than the amount in your Unclaimed Wallet.
            </Typography>
          )}
          <br />
          {Number(taxLeftDaysForReinvest) !== 0 ? (
            <Typography>
              You will pay{" "}
              {(
                (parseFloat(reinvestBLSTAmount) *
                  2 *
                  Number(taxLeftDaysForReinvest)) /
                100
              ).toFixed(2)}{" "}
              BLST Reinvest Tax, and get{" "}
              {(
                (parseFloat(reinvestBLSTAmount) *
                  (100 - 2 * Number(taxLeftDaysForReinvest))) /
                100
              ).toFixed(2)}{" "}
              BLST in your Reinvest Wallet.
              <br />
              Your new Samaritan Rank will be {futureSamaritanStarsWhenReinvest}
              .
              <br />
              Your amount of Reinvest Tax days left will stay{" "}
              {taxLeftDaysForReinvest} days.
            </Typography>
          ) : (
            <Typography>
              You will pay 0% Reinvest Tax, and get{" "}
              {Number(reinvestBLSTAmount).toFixed(2)} BLST in your Reinvest
              Wallet.
              <br />
              Your new Samaritan Rank will be {futureSamaritanStarsWhenReinvest}
              .
            </Typography>
          )}
          <br />
          <Typography>
            Your Tax levels will be reset to:
            <br />- {futureClaimMaxTaxPercent}% for Claim Tax decreasing 2% each
            day over{" "}
            {(Number(futureClaimMaxTaxPercent) -
              Number(futureClaimMinTaxPercent)) /
              2}{" "}
            days to reach a minimum of {Number(futureClaimMinTaxPercent)} %
            <br />- {futureReinvestTaxPercent}% for Reinvest Tax decreasing 2%
            each day over {Number(futureReinvestTaxPercent) / 2} days to reach a
            minimum of 0 %
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
            Transfer to Reinvest
          </FireBtn>
        </Box>
      )}
    </Dialog>
  );
};

export default ClaimAndReinvestModal;
