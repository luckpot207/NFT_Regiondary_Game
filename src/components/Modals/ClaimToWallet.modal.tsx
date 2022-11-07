import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  Checkbox,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaTimes } from "react-icons/fa";
import { useWeb3React } from "@web3-react/core";
import { AppDispatch, AppSelector } from "../../store";
import { toast } from "react-toastify";
import FireBtn from "../Buttons/FireBtn";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { formatNumber, getTranslation } from "../../utils/utils";
import {
  useFeeHandler,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";

import {
  getBLSTAmount,
  getUSDAmount,
  claimToWallet,
  lastClaimedTime,
} from "../../web3hooks/contractFunctions";

const ClaimToWalletTextField = styled(TextField)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input.MuiInput-input": {
    paddingTop: "0px",
    paddingBottom: "0px",
    textAlign: "center",
    MozAppearance: "TextField",
    maxWidth: "5em",
  },
});

const MaxCheckBox = styled(Checkbox)({
  paddingTop: "0px",
  paddingBottom: "0px",
});

const ClaimToWalletModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { claimedUSD, claimedBLST, claimToWalletModalOpen } =
    AppSelector(gameState);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const feehandlerContract = useFeeHandler();
  const rewardpoolContract = useRewardPool();
  const [claimToWalletAmount, setClaimToWalletAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [isMax, setIsMax] = useState<boolean>(false);
  const [lastClaimTime, setLastClaimTime] = useState<string>("");
  const [leftTime, setLeftTime] = useState<string>("");

  useEffect(() => {
    if (isMax) {
      setClaimToWalletAmount(maxAmount);
    }
  }, [isMax]);

  useEffect(() => {
    if (claimToWalletModalOpen == true) {
      getLastClaimedTime();
      setMaxBlstAmount();
    }
  }, [claimToWalletModalOpen]);

  useEffect(() => {
    const leftTimer = setInterval(() => {
      const left_time =
        new Date(lastClaimTime).getTime() +
        24 * 60 * 60 * 1000 -
        new Date().getTime();
      setLeftTime(
        "" +
          Math.floor(left_time / (60 * 60 * 1000)) +
          "h " +
          Math.floor((left_time % (60 * 60 * 1000)) / (60 * 1000)) +
          "m " +
          Math.floor((left_time % (60 * 1000)) / 1000) +
          "s"
      );
    }, 1000);
    return () => clearInterval(leftTimer);
  }, [leftTime, lastClaimTime]);

  const getLastClaimedTime = async () => {
    const lastTime = await lastClaimedTime(rewardpoolContract, account);
    setLastClaimTime(lastTime);
  };

  const setMaxBlstAmount = async () => {
    let blstAmount = 0;
    if (claimedUSD < 250) {
      blstAmount = Number(claimedBLST);
    } else if (claimedUSD >= 250 && claimedUSD < 1000) {
      blstAmount = await getBLSTAmount(web3, feehandlerContract, 250);
    } else if (claimedUSD >= 1000 && claimedUSD < 20000) {
      blstAmount = await getBLSTAmount(
        web3,
        feehandlerContract,
        Number(claimedUSD) / 4
      );
    } else {
      blstAmount = await getBLSTAmount(web3, feehandlerContract, 5000);
    }
    setMaxAmount(Number(blstAmount));
  };

  const handleTransferToWallet = async () => {
    if (claimToWalletAmount == 0 || Number.isNaN(claimToWalletAmount)) {
      toast.error("Please input valid amount.");
      return;
    }
    try {
      const busdAmount = await getUSDAmount(
        web3,
        feehandlerContract,
        claimToWalletAmount
      );
      const res = await claimToWallet(
        web3,
        rewardpoolContract,
        account,
        busdAmount
      );
      toast.success("Successfully transfered");
      handleClose();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeClaimToWalletAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(e.target.value);
    if (
      amount > maxAmount ||
      amount * 100 - Math.floor(amount * 100) > 0 ||
      amount < 0
    ) {
      setClaimToWalletAmount(claimToWalletAmount);
      return;
    }
    setClaimToWalletAmount(amount);
  };

  const handleIsMax = () => {
    setIsMax(!isMax);
  };

  const handleClose = () => {
    dispatch(
      updateState({
        claimToWalletModalOpen: false,
      })
    );
  };

  //
  return (
    <Dialog open={claimToWalletModalOpen.valueOf()} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography></Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.2em",
            marginLeft: "1em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      {new Date().getTime() >=
        new Date(lastClaimTime).getTime() + 24 * 60 * 60 * 1000 && (
        <DialogContent>
          <Typography mb={1}>
            You have {formatNumber(Number(claimedBLST).toFixed(2))}$CRYPTO (={" "}
            {formatNumber(Number(claimedUSD).toFixed(2))}BUSD) in your Claim
            Wallet.
          </Typography>
          <Typography mb={1}>
            How much do you want to transfer to your MetaMask wallet?
          </Typography>
          <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
            <ClaimToWalletTextField
              id="outlined-number"
              variant="standard"
              type="number"
              value={claimToWalletAmount}
              onChange={handleChangeClaimToWalletAmount}
              sx={{ padding: "0 !important" }}
            />
            <Typography sx={{ fontWeight: "bold" }}>
              BUSD{" "}
            </Typography>
            <MaxCheckBox checked={isMax} onChange={handleIsMax} />
            <Typography>
              Max{" "}
              {formatNumber(Number(claimedUSD).toFixed(2))} BUSD{" "}
            </Typography>
            <Typography>
              {" "}
              (= {formatNumber(Number(claimedBLST).toFixed(2))} $CRYPTO)
            </Typography>
          </Stack>
          <Box sx={{ textAlign: "center" }}>
            <FireBtn onClick={handleTransferToWallet}>
              Transfer
            </FireBtn>
          </Box>
        </DialogContent>
      )}

      {new Date().getTime() <
        new Date(lastClaimTime).getTime() + 24 * 60 * 60 * 1000 && (
        <DialogContent>
          <Typography>
            You need to wait {leftTime} to be able to transfer more into your MetaMask wallet.
          </Typography>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ClaimToWalletModal;
