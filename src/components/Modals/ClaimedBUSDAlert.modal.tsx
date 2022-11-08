import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, Typography, DialogTitle } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { AppDispatch, AppSelector } from "../../store";
import { inventoryState } from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import constants from "../../constants";

const ClaimedBUSDAlertModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { claimedBUSDAlertAmount } = AppSelector(inventoryState);
  const { claimedBUSDAlertModalOpen } = AppSelector(modalState);

  const [audio] = useState(new Audio(constants.alarmAudio));

  audio.loop = true;

  useEffect(() => {
    if (audio) {
      if (claimedBUSDAlertModalOpen) {
        audio.play();
      } else audio.pause();
    }
  }, [claimedBUSDAlertModalOpen, audio]);

  const handleClose = () => {
    dispatch(
      updateModalState({
        claimedBUSDAlertModalOpen: false,
      })
    );
  };

  //
  return (
    <Dialog open={claimedBUSDAlertModalOpen} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>
          BUSD claimed in the last hour has reached {claimedBUSDAlertAmount}{" "}
          BUSD
        </Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.2em",
            marginLeft: "1em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
    </Dialog>
  );
};

export default ClaimedBUSDAlertModal;
