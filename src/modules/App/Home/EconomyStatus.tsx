import { Box, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../../store";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import HomeTypo from "../../../components/UI/HomeTypo";
import FireBtn from "../../../components/Buttons/FireBtn";
import GreyBtn from "../../../components/Buttons/GreyBtn";
import Slider, {
  SliderThumb,
  SliderValueLabelProps,
} from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import VoteModal from "../../../components/Modals/Vote.modal";
import ReincarnationModal from "../../../components/Modals/Reincarnation.modal";
import Economy from "./Economy";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";

const PrettoSlider = styled(Slider)({
  background: "linear-gradient(to right, red, yellow , green)",
  pointerEvents: "none",
  padding: "0px !important",
  height: 16,
  "& .MuiSlider-rail": {
    background: "linear-gradient(to right, red, yellow , green)",
  },
  "& .MuiSlider-track": {
    border: "none",
    background: "linear-gradient(to right, red, yellow , green)",
  },
  "& .MuiSlider-thumb": {
    height: 18,
    width: 10,
    top: 24,
    backgroundColor: "#f66810",
    border: "0px solid",
    borderRadius: "0",
    "&:before": {
      top: -16,
      height: 0,
      width: 0,
      border: "8px solid",
      borderColor: "transparent transparent #f66810 transparent",
      boxShadow: "none",
    },
  },
  "& 	.MuiSlider-markLabel": {
    top: 20,
  },
});

const EconomyStatus: React.FC = () => {
  const dispatch = useDispatch();
  const {
    language,
    goodVote,
    badVote,
    playerSentiment,
    allLegions,
    hadSamaritanStar,
    reincarnationProcess,
    alreadyVoted,
    lastestVoteDate,
    voteExpired,
    expireVoteDate,
  } = AppSelector(gameState);

  const [voteExpiredLeftDateTime, setVoteExpiredLeftDateTime] = useState("");

  const handleVote = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!hadSamaritanStar) {
      toast.error(
        "You need to have (or had in the past) at least 4 Samaritan Stars to be able to vote."
      );
      return;
    }

    const totalAP = allLegions
      .map((legion) => legion.attackPower)
      .reduce((prev, curr) => prev.valueOf() + curr.valueOf(), 0);
    if (totalAP < 40000) {
      toast.error("You don't have enough total Attack Power!");
      return;
    }

    dispatch(
      updateState({
        allowVote: true,
      })
    );
  };

  const handleReincarnation = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      updateState({
        allowReincarnation: true,
      })
    );
  };

  const marks = [
    {
      value: 30,
      label: "30%",
    },
  ];

  const calcVoteExpireDateTime = () => {
    if (alreadyVoted && !voteExpired) {
      setVoteExpiredLeftDateTime(
        `${Math.floor(
          (new Date(lastestVoteDate).getTime() -
            new Date().getTime() +
            3 * 24 * 60 * 60 * 1000) /
            (24 * 60 * 60 * 1000)
        )} days ${Math.floor(
          ((new Date(lastestVoteDate).getTime() -
            new Date().getTime() +
            3 * 24 * 60 * 60 * 1000) %
            (24 * 60 * 60 * 1000)) /
            (60 * 60 * 1000)
        )} hours ${Math.floor(
          ((new Date(lastestVoteDate).getTime() -
            new Date().getTime() +
            3 * 24 * 60 * 60 * 1000) %
            (60 * 60 * 1000)) /
            (60 * 1000)
        )} minutes`
      );
    }
  };

  React.useEffect(() => {
    // realTimeUpdate();
  }, []);

  const realTimeUpdate = () => {
    setTimeout(() => {
      calcVoteExpireDateTime();
      realTimeUpdate();
    }, 1000);
  };

  const valuetext = (value: number) => {
    return `${value}%`;
  };

  return (
    <Card
      className="bg-c4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 4, justifyContent: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #fff",
            marginBottom: 3,
          }}
        >
          <LanguageTranslate translateKey="economyStatus" /> ( Beta )
        </Typography>
        <Economy />
        <br />
        <Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              <LanguageTranslate translateKey="playerSentiment" />
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <Box
                sx={{
                  width: "10%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/images/sentiment/r1.png"
                  style={{
                    height: "1.7em",
                  }}
                  alt="Recycle"
                />
              </Box>
              <Box
                sx={{
                  width: "10%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "right",
                }}
              >
                <img
                  src="/assets/images/sentiment/r2.png"
                  style={{
                    height: "1.7em",
                  }}
                  alt="Recycle"
                />
              </Box>
              <Box
                sx={{
                  width: "10%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/images/sentiment/r3.png"
                  style={{
                    height: "1.7em",
                  }}
                  alt="Recycle"
                />
              </Box>
              <Box
                sx={{
                  width: "10%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/images/sentiment/r4.png"
                  style={{
                    height: "1.7em",
                  }}
                  alt="Recycle"
                />
              </Box>
              <Box
                sx={{
                  width: "8%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/images/sentiment/r5.png"
                  style={{
                    height: "1.7em",
                  }}
                  alt="Recycle"
                />
              </Box>
            </Box>
            {goodVote.valueOf() + badVote.valueOf() >= 20 ? (
              <PrettoSlider
                track="inverted"
                sx={{
                  marginBottom: 4,
                }}
                aria-labelledby="track-inverted-slider"
                value={playerSentiment.valueOf()}
                valueLabelDisplay="off"
                valueLabelFormat={(x) => `${x}%`}
                marks={marks}
              />
            ) : (
              <PrettoSlider
                track="inverted"
                sx={{
                  marginBottom: 4,
                }}
                aria-labelledby="track-inverted-slider"
                value={97}
                valueLabelDisplay="off"
                valueLabelFormat={(x) => `${x}%`}
                marks={marks}
              />
            )}
          </Box>

          <Typography
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Voting starts on 27 October
          </Typography>
          {/* <Box
            sx={{
              textAlign: "Center",
              mb: 1,
            }}
          >
            {hadSamaritanStar ? (
              <FireBtn
                sx={{
                  width: "30%",
                  wordBreak: "break-word",
                  fontSize: 14,
                  textAlign: "center",
                }}
                aria-describedby="summon-beast-btn"
                onClick={handleVote}
              >
                {!alreadyVoted
                  ? "Vote"
                  : !voteExpired
                  ? "Update Vote"
                  : "Vote Again"}
              </FireBtn>
            ) : (
              <GreyBtn
                sx={{
                  width: "30%",
                  wordBreak: "break-word",
                  fontSize: 14,
                  textAlign: "center",
                }}
                aria-describedby="summon-beast-btn"
                onClick={handleVote}
              >
                {!alreadyVoted
                  ? "Vote"
                  : !voteExpired
                  ? "Update Vote"
                  : "Vote Again"}
              </GreyBtn>
            )}
          </Box>
          <Box>
            <Typography
              fontSize={15}
              sx={{
                fontWeight: "normal",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              {hadSamaritanStar
                ? !alreadyVoted
                  ? "You can vote now!"
                  : !voteExpired
                  ? `Your vote expired in ${voteExpiredLeftDateTime}`
                  : "Your vote expired. Please vote again."
                : ""}
            </Typography>

            <Typography
              fontSize={15}
              sx={{
                fontWeight: "normal",
                textAlign: "center",
                marginBottom: 2,
              }}
            ></Typography>
          </Box>
          <Box
            sx={{
              textAlign: "Center",
            }}
          >
            {reincarnationProcess ? (
              <FireBtn
                sx={{
                  mb: 1,
                  width: "70%",
                  wordBreak: "break-word",
                  fontSize: 14,
                  textAlign: "center",
                }}
                aria-describedby="summon-beast-btn"
                onClick={handleReincarnation}
              >
                Reincarnation
              </FireBtn>
            ) : (
              <></>
            )}
          </Box> */}
        </Box>
      </Box>
      <VoteModal />
      <ReincarnationModal />
    </Card>
  );
};

export default EconomyStatus;
