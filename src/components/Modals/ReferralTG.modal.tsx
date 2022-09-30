import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  Box,
  Typography,
  Input,
  Button,
  TextField,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  addContactInfo,
  editContactInfo,
  gameState,
  getContactInfo,
  updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppDispatch, AppSelector } from "../../store";

const ReferralTGModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    referralTGModalOpen,
    contactInfo,
    addContactLoading,
    editContactLoading,
  } = AppSelector(gameState);

  const { account } = useWeb3React();
  const [TGName, setTGName] = useState("");

  const handleClose = () => {
    dispatch(updateState({ referralTGModalOpen: false }));
  };

  const handleTGName = () => {
    if (contactInfo) {
      dispatch(
        editContactInfo({
          wallet: account?.toLowerCase() as string,
          tgname: TGName,
        })
      )
        .then((res) => {
          dispatch(getContactInfo(account?.toLowerCase()));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(
        addContactInfo({
          wallet: account?.toLowerCase() as string,
          tgname: TGName,
        })
      )
        .then((res) => {
          dispatch(getContactInfo(account?.toLowerCase()));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (contactInfo) {
      if (contactInfo.lastTG !== "") {
        setTGName(contactInfo.lastTG);
      } else {
        setTGName(contactInfo.firstTG);
      }
    }
  }, [contactInfo]);

  return (
    <Dialog onClose={handleClose} open={referralTGModalOpen.valueOf()}>
      <Box sx={{ display: "flex", p: 2 }}>
        <FaTimes
          style={{ marginLeft: "auto", cursor: "pointer" }}
          onClick={handleClose}
        />
      </Box>
      <Box sx={{ p: 4, pt: 0 }}>
        <Typography>
          Every week, the top 3 affiliates win up to 25% bonuses on top of their
          referral commissions. Also, one random affiliate who added their
          Telegram name wins a prize. Enter your Telegram name so we can keep
          you posted if you win the random draw or one of the top 3 prizes:
        </Typography>
        <TextField
          sx={{ marginTop: 1 }}
          value={TGName}
          onChange={(e) => setTGName(e.target.value)}
          placeholder="Telegram Name"
          inputProps={{ maxLength: 40 }}
          variant="standard"
          label="TG Name"
        />
        <Typography sx={{ my: 2 }}>
          Your Telegram name will stay private and secure, will never be shared,
          and you will only be potentially contacted by the founder/dev Danny
          from @itsdannyh.
        </Typography>
        <LoadingButton
          variant="contained"
          onClick={handleTGName}
          loading={addContactLoading.valueOf() || editContactLoading.valueOf()}
        >
          {!contactInfo ? "I want to win, sign me up" : "Update username"}
        </LoadingButton>
      </Box>
    </Dialog>
  );
};

export default ReferralTGModal;
