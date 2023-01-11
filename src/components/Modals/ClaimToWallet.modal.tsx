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
import { inventoryState } from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { getBLSTAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import {
  convertInputNumberToStr,
  formatNumber,
  getTranslation,
} from "../../utils/utils";
import {
  useBloodstone,
  useFeeHandler,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import {
  claimToWallet,
  lastClaimedTime,
} from "../../web3hooks/contractFunctions/rewardpool.contract";
import constants from "../../constants";
import InventoryService from "../../services/inventory.service";

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
  paddingLeft: "0px",
});

const ClaimToWalletModal: React.FC = () => {
  let clockTimer: any = 0;
  const dispatch: AppDispatch = useDispatch();
  const { claimedUSD, claimedBLST } = AppSelector(inventoryState);
  const { claimToWalletModalOpen } = AppSelector(modalState);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const rewardpoolContract = useRewardPool();
  const bloodstoneContract = useBloodstone();
  const feehandlerContract = useFeeHandler();

  const [claimToWalletAmount, setClaimToWalletAmount] = useState<string>("0");
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [isMax, setIsMax] = useState<boolean>(false);
  const [is250, setIs250] = useState<boolean>(false);
  const [is25Percent, setIs25Percent] = useState<boolean>(false);
  const [is5000, setIs5000] = useState<boolean>(false);
  const [lastClaimTime, setLastClaimTime] = useState<string>("");
  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [blst250, setBlst250] = useState<number>(0);
  const [blst5000, setBlst5000] = useState<number>(0);
  const [blst25Percent, setBlst25Percent] = useState<number>(0);

  useEffect(() => {
    getLastClaimedTime();
    clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    if (isMax) {
      setClaimToWalletAmount(maxAmount.toString());
    } else {
      setClaimToWalletAmount("0");
    }
  }, [isMax]);

  useEffect(() => {
    if (is250) {
      setClaimToWalletAmount("250");
    } else {
      setClaimToWalletAmount("0");
    }
  }, [is250]);

  useEffect(() => {
    if (is5000) {
      setClaimToWalletAmount("5000");
    } else {
      setClaimToWalletAmount("0");
    }
  }, [is5000]);

  useEffect(() => {
    if (is25Percent) {
      setClaimToWalletAmount(
        Number(Number(claimedUSD) / 10 ** 18 / 4)
          .toFixed(4)
          .toString()
      );
    } else {
      setClaimToWalletAmount("0");
    }
  }, [is25Percent]);

  useEffect(() => {
    if (claimToWalletModalOpen == true) {
      setMaxUSDAmount();
    }
  }, [claimToWalletModalOpen]);

  const getLastClaimedTime = async () => {
    const lastTime = await lastClaimedTime(rewardpoolContract, account);
    setLastClaimTime(new Date(lastTime * 1000).toISOString());
  };

  const getLeftTime = () => {
    const left_time =
      new Date(lastClaimTime).getTime() +
      24 * 60 * 60 * 1000 -
      currentTime.getTime();
    return (
      "" +
      Math.floor(left_time / (60 * 60 * 1000)) +
      "h " +
      Math.floor((left_time % (60 * 60 * 1000)) / (60 * 1000)) +
      "m " +
      Math.floor((left_time % (60 * 1000)) / 1000) +
      "s"
    );
  };

  const setMaxUSDAmount = async () => {
    let busdAmount = 0;
    if (Number(claimedUSD) / 10 ** 18 < 250) {
      busdAmount = Number(claimedUSD) / 10 ** 18;
    } else if (
      Number(claimedUSD) / 10 ** 18 >= 250 &&
      Number(claimedUSD) / 10 ** 18 < 1000
    ) {
      busdAmount = 250;
    } else if (
      Number(claimedUSD) / 10 ** 18 >= 1000 &&
      Number(claimedUSD) / 10 ** 18 < 20000
    ) {
      busdAmount = Math.floor((Number(claimedUSD) / 10 ** 18 / 4) * 100) / 100;
    } else {
      busdAmount = 5000;
    }
    setMaxAmount(Number(busdAmount));

    try {
      setBlst250(await getBLSTAmount(web3, feehandlerContract, 250));
      setBlst5000(await getBLSTAmount(web3, feehandlerContract, 5000));
      setBlst25Percent(
        await getBLSTAmount(
          web3,
          feehandlerContract,
          Number(claimedUSD) / 10 ** 18 / 10
        )
      );
    } catch (e) {
      console.log("Get BLST amount issue : ", e);
    }
  };

  const handleTransferToWallet = async () => {
    if (Number(claimToWalletAmount) == 0) {
      toast.error(getTranslation("pleaseEnterAValidAMount"));
      return;
    }
    try {
      setTransferLoading(true);
      let transferAmount = isMax
        ? String(claimedUSD)
        : String(Number(claimToWalletAmount) * 10 ** 18);
      const res = await claimToWallet(
        web3,
        rewardpoolContract,
        account,
        transferAmount
      );
      setTransferLoading(false);
      toast.success(getTranslation("successfullyTransfered"));
      InventoryService.getWalletAndUnclaimedBalance(
        dispatch,
        web3,
        account,
        bloodstoneContract,
        rewardpoolContract,
        feehandlerContract
      );
      handleClose();
      getLastClaimedTime();
    } catch (e) {
      setTransferLoading(false);
      console.log(e);
    }
  };

  const handleChangeClaimToWalletAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = e.target.value;
    if (
      Number(amount) > maxAmount ||
      // amount * 100 - Math.floor(amount * 100) > 0 ||
      Number(amount) < 0
    ) {
      setClaimToWalletAmount(claimToWalletAmount);
      return;
    }
    setClaimToWalletAmount(amount.toString());
  };

  const handleIsMax = () => {
    setIsMax(!isMax);
  };
  const handleIs250 = () => {
    setIs250(!is250);
  };
  const handleIs5000 = () => {
    setIs5000(!is5000);
  };
  const handleIs25Percent = () => {
    setIs25Percent(!is25Percent);
    if(is25Percent) {
      setIs250(false);
    }
  };

  const handleClose = () => {
    dispatch(
      updateModalState({
        claimToWalletModalOpen: false,
      })
    );
  };

  return (
    <Dialog
      open={claimToWalletModalOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
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
      {claimedUSD > 0 &&
        new Date().getTime() >=
          new Date(lastClaimTime).getTime() + 24 * 60 * 60 * 1000 && (
          <DialogContent>
            <Typography mb={1}>
              {getTranslation("youHaveInYourClaimWallet", {
                CL1: formatNumber((Number(claimedUSD) / 10 ** 18).toFixed(2)),
                CL2: formatNumber(Number(claimedBLST).toFixed(2)),
              })}
            </Typography>
            <Typography mb={1} sx={{ fontWeight: "bold" }}>
              {getTranslation("howMuchDoYouWantToTransferToYourMetaMaskWallet")}
            </Typography>
            <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
              <ClaimToWalletTextField
                variant="standard"
                type="number"
                value={claimToWalletAmount}
                onChange={handleChangeClaimToWalletAmount}
                disabled={isMax || is250 || is5000 || is25Percent}
                sx={{ padding: "0 !important" }}
              />
              <Typography sx={{ fontWeight: "bold" }}>
                {" "}
                &nbsp;BUSD&nbsp;&nbsp;&nbsp;
              </Typography>
            </Stack>
            <br></br>
            <Typography mb={1} style={{ fontWeight: "bold" }}>
              {getTranslation("quickOptions")} :
            </Typography>
            <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
              <MaxCheckBox
                checked={is250}
                onChange={handleIs250}
                disabled={
                  Number(claimedUSD) / 10 ** 18 > 250 &&
                  Number(claimedUSD) / 10 ** 18 < 1000
                    ? false
                    : true
                }
              />
              <Typography>250 BUSD </Typography>
              <Typography>
                &nbsp;(= {formatNumber(Number(blst250).toFixed(2))} $
                {getTranslation("blst")})
              </Typography>
            </Stack>
            <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
              <MaxCheckBox
                checked={is25Percent}
                onChange={handleIs25Percent}
                disabled={Number(claimedUSD) / 10 ** 18 > 20000 ? true : false}
              />
              <Typography>
                10% ={" "}
                {formatNumber((Number(claimedUSD) / 10 ** 18 / 10).toFixed(2))}{" "}
                BUSD{" "}
              </Typography>
              <Typography>
                &nbsp;(= {formatNumber(Number(blst25Percent).toFixed(2))} $
                {getTranslation("blst")})
              </Typography>
            </Stack>
            <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
              <MaxCheckBox
                checked={is5000}
                onChange={handleIs5000}
                disabled={Number(claimedUSD) / 10 ** 18 > 20000 ? false : true}
              />
              <Typography>5000 BUSD</Typography>
              <Typography>
                &nbsp;(= {formatNumber(Number(blst5000).toFixed(2))} $
                {getTranslation("blst")})
              </Typography>
            </Stack>
            <Stack flexDirection="row" mb={1} sx={{ flexWrap: "wrap" }}>
              <MaxCheckBox
                checked={isMax}
                onChange={handleIsMax}
                disabled={Number(claimedUSD) / 10 ** 18 < 250 ? false : true}
              />
              <Typography>
                {getTranslation("maxAvailable")} ={" "}
                {formatNumber((Number(claimedUSD) / 10 ** 18).toFixed(2))} BUSD{" "}
              </Typography>
              <Typography>
                &nbsp;(= {formatNumber(Number(claimedBLST).toFixed(2))} $
                {getTranslation("blst")})
              </Typography>
            </Stack>
            <Box sx={{ textAlign: "center" }}>
              <FireBtn
                onClick={handleTransferToWallet}
                loading={transferLoading}
              >
                {getTranslation("transfer")}
              </FireBtn>
            </Box>
          </DialogContent>
        )}

      {claimedUSD > 0 &&
        new Date().getTime() <
          new Date(lastClaimTime).getTime() + 24 * 60 * 60 * 1000 && (
          <DialogContent>
            <Typography>
              {getTranslation(
                "youNeedToWaitToBeAbleToTranferMoreIntoYourMetaMaskWallet",
                {
                  CL1: getLeftTime(),
                }
              )}
            </Typography>
          </DialogContent>
        )}
      {claimedUSD == 0 && (
        <DialogContent>
          <Typography>{getTranslation("yourClaimWalletIsEmpty")}</Typography>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ClaimToWalletModal;
