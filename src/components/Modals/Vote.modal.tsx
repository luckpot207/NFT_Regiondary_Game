import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FaTimes } from "react-icons/fa";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";

import { AppDispatch, AppSelector } from "../../store";
import FireBtn from "../Buttons/FireBtn";
import {
  getVoteByAddress,
  getVoteStatus,
  vote,
  voteState,
} from "../../reducers/vote.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import constants from "../../constants";

const VoteModal: React.FC = () => {
  let clockTimer: any = 0;

  const dispatch: AppDispatch = useDispatch();
  const { alreadyVoted, voteExpired, lastestVoteDate, myVote } =
    AppSelector(voteState);
  const { voteModalOpen } = AppSelector(modalState);

  const { account } = useWeb3React();

  const [status, setStatus] = useState<boolean>(myVote.valueOf());
  const [voteExpiredLeftDateTime, setVoteExpiredLeftDateTime] = useState("");
  const [currenTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(clockTimer);
    };
  }, []);

  const handleSubmit = async () => {
    if (!account) {
      toast.error("You must connect your wallet!");
      handleClose();
      return;
    }

    dispatch(
      vote({
        address: account as string,
        vote: status as boolean,
      })
    ).then(() => {
      dispatch(getVoteStatus());
      dispatch(getVoteByAddress({ address: account as string }));
    });
    handleClose();
  };

  const handleClose = () => {
    dispatch(
      updateModalState({
        voteModalOpen: false,
      })
    );
  };

  const calcVoteExpireDateTime = (lastestVoteDate: string) => {
    if (alreadyVoted && !voteExpired) {
      return `${Math.floor(
        (new Date(lastestVoteDate).getTime() -
          currenTime.getTime() +
          3 * 24 * 60 * 60 * 1000) /
          (24 * 60 * 60 * 1000)
      )} days ${Math.floor(
        ((new Date(lastestVoteDate).getTime() -
          currenTime.getTime() +
          3 * 24 * 60 * 60 * 1000) %
          (24 * 60 * 60 * 1000)) /
          (60 * 60 * 1000)
      )} hours ${Math.floor(
        ((new Date(lastestVoteDate).getTime() -
          currenTime.getTime() +
          3 * 24 * 60 * 60 * 1000) %
          (60 * 60 * 1000)) /
          (60 * 1000)
      )} minutes`;
    }
  };

  //
  return (
    <Dialog
      open={voteModalOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <DialogTitle sx={{ position: "relative" }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Vote about the current economy status:
          </Typography>
        </Box>
        <FaTimes
          style={{
            position: "absolute",
            top: "1em",
            right: "1em",
            cursor: "pointer",
            fontSize: "1.2em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            textAlign: "Center",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            sx={{
              alignItems: "center",
              marginBottom: 1,
            }}
            value={status}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              onClick={() => setStatus(true)}
              label="Good"
              sx={{ width: "80px" }}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              onClick={() => setStatus(false)}
              label="Bad"
              sx={{ width: "80px" }}
            />
          </RadioGroup>

          <Typography
            fontSize={15}
            sx={{
              fontWeight: "normal",
              textAlign: "left",
              marginBottom: 0,
            }}
          >
            {alreadyVoted &&
              "Your " +
                (myVote.valueOf() ? "Good" : "Bad") +
                " vote expires in " +
                calcVoteExpireDateTime(lastestVoteDate.toString()) +
                "."}
            {(!alreadyVoted || voteExpired) &&
              "Your vote will expire in 3 days."}
          </Typography>
          <Typography
            fontSize={15}
            sx={{
              fontWeight: "normal",
              textAlign: "left",
            }}
          >
            You can change your vote, or vote the same to restart the countdown
            timer.
          </Typography>
          <Typography
            fontSize={15}
            sx={{
              fontWeight: "normal",
              textAlign: "left",
              marginBottom: 2,
            }}
          >
            V3 will stay live as long as at least 30% players vote Good.
          </Typography>
          <FireBtn
            sx={{
              mb: 1,
              width: "30%",
              wordBreak: "break-word",
              fontSize: 14,
              textAlign: "center",
            }}
            onClick={handleSubmit}
            aria-describedby="summon-beast-btn"
          >
            {!alreadyVoted && "Vote"}
            {alreadyVoted && !voteExpired && "Update Vote"}
            {alreadyVoted && voteExpired && "Vote again"}
          </FireBtn>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VoteModal;
