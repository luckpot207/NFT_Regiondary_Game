import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { AppDispatch, AppSelector } from "../../store";
import FireBtn from "../Buttons/FireBtn";
import {
  inventoryState,
  setClaimedBUSDAlertAmount,
} from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";

const PriceTextField = styled(TextField)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input.MuiInput-input": {
    textAlign: "center",
    MozAppearance: "TextField",
  },
});

const ClaimedBUSDAlertAmountModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { claimedBUSDAlertAmount } = AppSelector(inventoryState);
  const { claimedBUSDAlertAmountModalOpen } = AppSelector(modalState);

  const { account } = useWeb3React();
  const [alertAmount, setAlertAmount] = useState<number>(
    claimedBUSDAlertAmount.valueOf()
  );

  useEffect(() => {
    setAlertAmount(claimedBUSDAlertAmount.valueOf());
  }, [claimedBUSDAlertAmountModalOpen]);

  const handleAlertAmountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (amount - Math.floor(amount) > 0) {
      setAlertAmount(alertAmount);
      return;
    }
    setAlertAmount(amount);
  };

  const handleSubmit = async () => {
    dispatch(
      setClaimedBUSDAlertAmount({
        address: account as string,
        amount: alertAmount,
      })
    );
    dispatch(
      updateModalState({
        claimedBUSDAlertAmountModalOpen: false,
      })
    );
  };

  const handleClose = () => {
    dispatch(
      updateModalState({
        claimedBUSDAlertAmountModalOpen: false,
      })
    );
  };

  //
  return (
    <Dialog open={claimedBUSDAlertAmountModalOpen} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          SET ALERT
        </Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.2em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent dividers sx={{ maxWidth: "400px" }}>
        <Typography mb={2}>
          Play a sound alert when BUSD claimed in the last hour has reached
        </Typography>
        <Stack mb={1} flexDirection="row" sx={{ flexWrap: "wrap" }}>
          <Box>
            <PriceTextField
              id="outlined-number"
              variant="standard"
              type="number"
              value={alertAmount}
              onChange={handleAlertAmountChanged}
            />
          </Box>
          <Box>BUSD</Box>
        </Stack>
        <Stack alignItems="center">
          <FireBtn
            sx={{ width: "100px" }}
            onClick={handleSubmit}
            // loading={}
          >
            Set Alert
          </FireBtn>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimedBUSDAlertAmountModal;
