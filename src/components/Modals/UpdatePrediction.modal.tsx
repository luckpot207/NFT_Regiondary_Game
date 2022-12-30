import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { duelState } from "../../reducers/duel.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { AppSelector } from "../../store";
import { useDuelSystem, useLegion, useWeb3 } from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { updatePrediction } from "../../web3hooks/contractFunctions/duel.contract";
import DuelService from "../../services/duel.service";
import { convertInputNumberToStr, getTranslation } from "../../utils/utils";
import constants from "../../constants";
import gameConfig from "../../config/game.config";

const PriceTextField = styled(TextField)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input.MuiInput-input": {
    paddingTop: "0px",
    paddingBottom: "0px",
    textAlign: "center",
    MozAppearance: "TextField",
  },
});

const UpdatePredictionModal: React.FC = () => {
  const dispatch = useDispatch();
  const { allDuels, currentDuelId } = AppSelector(duelState);
  const { updatePredictionModalOpen } = AppSelector(modalState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contract
  const duelContract = useDuelSystem();
  const legionContract = useLegion();
  const [estimatePrice, setEstimatePrice] = useState<string>("0");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [leftTime, setLeftTime] = useState<string>("");
  const [duelLeftTime, setDuelLeftTime] = useState<string>("");
  const [currentPrediction, setCurrentPrediction] = useState<number>(0);
  const [updatePredictionLoading, setUpdatePredictionLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const leftTimer = setInterval(() => {
      const join_left_time =
        new Date(endDateTime.valueOf()).getTime() - new Date().getTime();
      const joinLeftTimeStr =
        "" +
        Math.floor(join_left_time / (60 * 60 * 1000)) +
        "h " +
        Math.floor((join_left_time % (60 * 60 * 1000)) / (60 * 1000)) +
        "m " +
        Math.floor((join_left_time % (60 * 1000)) / 1000) +
        "s";
      const leftTimeStr =
        "" +
        (Math.floor(join_left_time / (60 * 60 * 1000)) + 18) +
        "h " +
        Math.floor((join_left_time % (60 * 60 * 1000)) / (60 * 1000)) +
        "m " +
        Math.floor((join_left_time % (60 * 1000)) / 1000) +
        "s";
      setDuelLeftTime(leftTimeStr);
      setLeftTime(joinLeftTimeStr);
    }, 1000);
    return () => clearInterval(leftTimer);
  }, [leftTime, endDateTime]);

  useEffect(() => {
    setEstimatePrice("0");
    allDuels.forEach((duel, index) => {
      if (duel.duelId == currentDuelId) {
        setEndDateTime(duel.endDateTime.valueOf());
        setCurrentPrediction(duel.creatorEstmatePrice.valueOf());
      }
    });
  }, [updatePredictionModalOpen]);

  const handleChangeEstimatePrice = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let price =
      Number(e.target.value) > gameConfig.maxEstimatePrice
        ? gameConfig.maxEstimatePrice.toString()
        : Number(Number(e.target.value).toFixed(4)) === Number(e.target.value)
        ? e.target.value.toString()
        : estimatePrice.toString();
    if (
      price.indexOf(".") != -1 &&
      price.substr(price.indexOf(".") + 1).length > 4
    ) {
      price = estimatePrice.toString();
    }
    setEstimatePrice(Number(price) < 0 ? "0" : price);
  };

  const handleClose = () => {
    dispatch(updateModalState({ updatePredictionModalOpen: false }));
  };

  const handleSubmit = async () => {
    if (Number(estimatePrice) < 0) {
      toast.error(getTranslation("pleaseprovidevalidvalue"));
      return;
    }
    try {
      setUpdatePredictionLoading(true);
      const res = await updatePrediction(
        duelContract,
        account,
        currentDuelId,
        Number(estimatePrice) * 10 ** 18
      );
      setUpdatePredictionLoading(false);
      dispatch(updateModalState({ updatePredictionModalOpen: false }));
      toast.success(getTranslation("yourpredictionhasbeenupdated"));
      DuelService.getAllDuelsAct(
        dispatch,
        web3,
        account,
        duelContract,
        legionContract
      );
    } catch (error) {
      setUpdatePredictionLoading(false);
      console.log(error);
    }
  };

  return (
    <Dialog
      open={updatePredictionModalOpen.valueOf()}
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
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          {getTranslation("updateprediction")}
        </Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.8em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Typography>{getTranslation("yourcurrentpredictionis")}:</Typography>
        <Typography>
          {getTranslation("ithinkblstwillbebusdin", {
            CL1: currentPrediction,
            CL2: duelLeftTime,
          })}
        </Typography>
        <Typography>
          {getTranslation("youhavelefttoupdateyourprediction", {
            CL1: leftTime,
          })}
        </Typography>
        <Box
          sx={{
            padding: "20px",
            fontSize: "1.2em",
            fontWeight: "bold",
          }}
        >
          <a
            href={constants.navlink.tokenPriceUrl}
            target="_blank"
            style={{ color: constants.color.color2, textDecoration: "none" }}
          >
            {getTranslation("checkblstpricenow")}
          </a>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ fontWeight: "bold" }}>
            {getTranslation("ithink1blstwillbe")}
          </Box>
          <PriceTextField
            id="outlined-number"
            variant="standard"
            type="number"
            value={convertInputNumberToStr(estimatePrice)}
            onChange={handleChangeEstimatePrice}
            sx={{ padding: "0 !important" }}
          />
          <Box sx={{ fontWeight: "bold" }}>BUSD</Box>
        </Box>
        {/* <Grid container mb={1} spacing={1}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            {getTranslation("ithink1blstwillbe")}{" "}
          </Grid>
          <Grid item xs={6} sm={4} md={4} lg={2}>
            <PriceTextField
              id="outlined-number"
              variant="standard"
              type="number"
              value={convertInputNumberToStr(estimatePrice)}
              onChange={handleChangeEstimatePrice}
              sx={{ padding: "0 !important" }}
            />
          </Grid>
          <Grid item xs={6} sm={2} md={2} lg={1}>
            BUSD
          </Grid>
        </Grid> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <FireBtn
            sx={{ width: "100px" }}
            onClick={handleSubmit}
            loading={updatePredictionLoading}
          >
            {getTranslation("update")}
          </FireBtn>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default UpdatePredictionModal;
