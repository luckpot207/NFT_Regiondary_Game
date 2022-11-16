import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import { toast } from "react-toastify";

import { AppDispatch, AppSelector } from "../../store";
import FireBtn from "../Buttons/FireBtn";
import ApiService from "../../services/api.service";
import GreyBtn from "../Buttons/GreyBtn";
import GreenBtn from "../Buttons/GreenBtn";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { apiConfig } from "../../config/api.config";
import constants from "../../constants";

const ReincarnationModal: React.FC = () => {
  // Hook Info
  const dispatch: AppDispatch = useDispatch();
  const { account } = useWeb3React();
  const { reincarnationModalOpen } = AppSelector(modalState);
  const [reincarnationClicked, setReincarnationClicked] = useState(false);
  const [reincarnationAllowed, setReincarnationAllowed] = useState(false);

  useEffect(() => {
    getBalance();
    checkDone();
  }, []);

  const handleSubmit = async () => {
    try {
      await ApiService.addReincarnationValue(
        account?.toLowerCase() as string,
        0
      );
      toast.success("Reincarnation confirmed!");
    } catch (error) {
      toast.error("Reincarnation failed!");
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(
      updateModalState({
        reincarnationModalOpen: false,
      })
    );
  };

  const getBalance = async () => {
    try {
      const query = `
        {
          samaritanStarAndTaxCycleChangeLogs (
            where:{
              address: ${`"` + account?.toLowerCase() + `"`}
            }
            orderBy: timestamp
            orderDirection: desc
          ) {
            currentSamaritanStars
            currentReinvestPercent
            taxStartTime
            timestamp
          }
        }
      `;
      const graphRes = await Axios.post(apiConfig.subgraphServer, { query });
      const logs = graphRes.data.data.samaritanStarAndTaxCycleChangeLogs;
      const comparisionTimestamp = Math.floor(
        new Date("10/27/2022 11:00:00 AM UTC").getTime() / 1000
      );
      if (logs.length > 0) {
        const timeFilteredInfo = logs.filter(
          (log: any) => log.timestamp > comparisionTimestamp
        );
        if (timeFilteredInfo.length > 0) {
          if (
            timeFilteredInfo.filter(
              (item: any) => Number(item.currentReinvestPercent) >= 50
            ).length > 0
          ) {
            setReincarnationAllowed(true);
          }
        } else {
          if (logs[0]) {
            if (Number(logs[0].currentReinvestPercent) >= 50) {
              setReincarnationAllowed(true);
            }
          }
        }
      } else {
        setReincarnationAllowed(true);
      }
    } catch (error) {}
  };

  const checkDone = async () => {
    try {
      const res = await ApiService.getReincarnationValueByAddress(
        account?.toLowerCase() as string
      );
      if (res.data.address) {
        setReincarnationClicked(true);
      }
    } catch (error) {}
  };

  return (
    <Dialog
      open={reincarnationModalOpen.valueOf()}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Reincarnation Has Started
        </DialogTitle>
        <Box sx={{ p: 1, cursor: "pointer" }} onClick={handleClose}>
          <FaTimes />
        </Box>
      </Box>
      <DialogContent>
        <Box>
          <Typography
            sx={{
              textAlign: "left",
              marginBottom: 1,
            }}
          >
            The v3 game ended and the migration to the v4 game has started.
            <br />
            All players who have at least 3 Samaritan Stars (or had up to 48
            hours before the Reincarnation started), can click the button below
            before 4 November 11:59am UTC, to receive a Reincarnation Voucher
            for v4.
            <br />
            If you do not click the button below, then you will forfeit your
            voucher.
            <br />
            We recommend you to sell all your $BLV3. The v3 game cannot be
            played anymore, so you cannot summon/hunt/claim.
            <br />
            Your Reincarnation Value will be calculated based on what you have
            left in your Unclaimed Wallet (that you could not claim because the
            Reward Pool is empty) and the value of your Legions.
            <br />
            <a
              href={constants.navlink.reincarnationDocLink}
              target="_blank"
              className="fc2 td-none"
            >
              Please read our whitepaper for all additional information.
            </a>
            <br />
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            {reincarnationAllowed && !reincarnationClicked && (
              <FireBtn
                sx={{
                  mb: 1,
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
                onClick={handleSubmit}
                aria-describedby="summon-beast-btn"
              >
                Reincarnate Now
              </FireBtn>
            )}
            {reincarnationAllowed && reincarnationClicked && (
              <GreenBtn
                sx={{
                  mb: 1,
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
                aria-describedby="summon-beast-btn"
              >
                You Have Reincarnated
              </GreenBtn>
            )}
            {!reincarnationAllowed && (
              <GreyBtn
                sx={{
                  mb: 1,
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                You Did Not Have 3 Stars Recently
              </GreyBtn>
            )}
          </Box>
          <Typography
            sx={{
              textAlign: "left",
              marginBottom: 1,
            }}
          >
            Do NOT buy the $BLV3 token.
            <br />
            Follow our announcements about the upcoming launch of v4.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReincarnationModal;
