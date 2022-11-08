import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import { Box, Card, Typography, Stack, Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

import { AppDispatch, AppSelector } from "../../../store";
import FireBtn from "../../../components/Buttons/FireBtn";
import GreyBtn from "../../../components/Buttons/GreyBtn";
import Economy from "./Economy";
import { voteState, updateVoteState } from "../../../reducers/vote.reducer";
import { legionState } from "../../../reducers/legion.reducer";
import { inventoryState } from "../../../reducers/inventory.reducer";
import { ILegion } from "../../../types";
import { apiConfig } from "../../../config/api.config";
import { updateModalState } from "../../../reducers/modal.reducer";
import { getTranslation } from "../../../utils/utils";
import VoteModal from "../../../components/Modals/Vote.modal";

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
    background: "transparent !important",
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
    top: 30,
    color: "white",
  },
});

const EconomyStatus: React.FC = () => {
  let behaviourTimer: any = 0;
  let clockTimer: any = 0;
  const behaviourMarks = [
    {
      value: 50,
      label: "",
    },
  ];

  const dispatch: AppDispatch = useDispatch();
  const {
    goodVote,
    badVote,
    playerSentiment,
    reincarnationProcess,
    alreadyVoted,
    lastestVoteDate,
    voteExpired,
    myVote,
  } = AppSelector(voteState);
  const { allLegions } = AppSelector(legionState);
  const { daysLeftUntilAbove3Stars } = AppSelector(inventoryState);

  const { account } = useWeb3React();
  const [playerBehaviourValue, setPlayerBehaviourValue] = useState(100);

  const [isHad4Stars, setIsHad4Stars] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const totalAP = allLegions
    .map((legion: ILegion) => legion.attackPower)
    .reduce((prev: Number, curr: Number) => Number(prev) + Number(curr), 0);

  useEffect(() => {
    behaviourTimer = setInterval(() => {
      getBehaviourValue();
    }, 10000);
    clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(behaviourTimer);
      clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    getBalance();
  }, [daysLeftUntilAbove3Stars, account]);

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
      console.log(graphRes);
      const starLogs = graphRes.data.data.samaritanStarAndTaxCycleChangeLogs;
      if (daysLeftUntilAbove3Stars > 0) {
        if (starLogs[0].currentReinvestPercent >= 65) setIsHad4Stars(true);
      } else {
        if (
          starLogs.filter((log: any) => Number(log.currentSamaritanStars) >= 4)
            .length > 0
        ) {
          setIsHad4Stars(true);
        } else {
          if (starLogs[0].currentReinvestPercent >= 65) setIsHad4Stars(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = () => {
    if (!isHad4Stars) {
      toast.error(
        "You need to have (or had in the past) at least 4 Samaritan Stars to be able to vote."
      );
      return;
    }

    const totalAP = allLegions
      .map((legion) => legion.attackPower)
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    if (totalAP < 40000) {
      toast.error("You don't have enough total Attack Power!");
      return;
    }

    dispatch(
      updateModalState({
        voteModalOpen: true,
      })
    );
  };

  const handleReincarnation = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      updateVoteState({
        allowReincarnation: true,
      })
    );
  };

  const sentimentMarks = [
    {
      value: 30,
      label: "30%",
    },
  ];

  const calcVoteExpireDateTime = (lastestVoteDate: string) => {
    if (alreadyVoted && !voteExpired) {
      return `${Math.floor(
        (new Date(lastestVoteDate).getTime() -
          currentTime.getTime() +
          3 * 24 * 60 * 60 * 1000) /
          (24 * 60 * 60 * 1000)
      )} days ${Math.floor(
        ((new Date(lastestVoteDate).getTime() -
          currentTime.getTime() +
          3 * 24 * 60 * 60 * 1000) %
          (24 * 60 * 60 * 1000)) /
          (60 * 60 * 1000)
      )} hours ${Math.floor(
        ((new Date(lastestVoteDate).getTime() -
          currentTime.getTime() +
          3 * 24 * 60 * 60 * 1000) %
          (60 * 60 * 1000)) /
          (60 * 1000)
      )} minutes`;
    }
    return "";
  };

  const getBehaviourValue = async () => {
    try {
      let timeStamp = Math.round(
        (new Date().getTime() - 24 * 60 * 60 * 1000) / 1000
      );
      let total_claimed = 0,
        total_reinvested = 0;
      let subgraphRes = [];
      while (true) {
        const query = `
        {
          claimOrReinvestEvents(
            where: {
              timestamp_gt: ${timeStamp},
            },
            orderBy: timestamp,
            first: 1000
          ) {
            id
            claimStatus
            address {
              id
            }
            realAmount
            totalAmount
            timestamp
          }
        }
        `;
        const queryRes = await Axios.post(apiConfig.subgraphServer, { query });
        subgraphRes = queryRes.data.data.claimOrReinvestEvents;
        subgraphRes.forEach((user: any) => {
          user.claimStatus
            ? (total_claimed += Math.round(user.realAmount / 10 ** 18))
            : (total_reinvested += Math.round(user.realAmount / 10 ** 18));
        });
        if (subgraphRes.length == 0) break;
        timeStamp = subgraphRes[subgraphRes.length - 1].timestamp;
        subgraphRes = [];
      }
      timeStamp = Math.round(
        (new Date().getTime() - 24 * 60 * 60 * 1000) / 1000
      );
      let total_unclaimed = 0;
      subgraphRes = [];
      while (true) {
        const query = `
          {
            users(
              where: {
                timestamp_gt: ${timeStamp},
              },
              orderBy: timestamp,
              first: 1000
            ) {
              unclaimedUSD
            }
          }
        `;
        const queryRes = await Axios.post(apiConfig.subgraphServer, { query });
        subgraphRes = queryRes.data.data.users;
        subgraphRes.forEach((user: any) => {
          total_unclaimed += Math.round(user.unclaimedUSD / 10 ** 18);
        });
        if (subgraphRes.length == 0) break;
        timeStamp = subgraphRes[subgraphRes.length - 1].timestamp;
        subgraphRes = [];
      }
      if (total_unclaimed != 0 && total_claimed - total_reinvested > 0) {
        setPlayerBehaviourValue(
          Math.round(
            ((total_claimed - total_reinvested) * 100) / total_unclaimed
          )
        );
      } else {
        setPlayerBehaviourValue(99);
      }
    } catch (error) {}
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
          {getTranslation("economyStatus")}
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
                marginBottom: 1,
              }}
            >
              {getTranslation("playerBehaviour")}
            </Typography>
            <Stack justifyContent="space-between" flexDirection="row">
              <Typography>100%</Typography>
              <Typography>50/50</Typography>
              <Typography>100%</Typography>
            </Stack>
            <PrettoSlider
              track="inverted"
              sx={{
                marginBottom: 4,
              }}
              aria-labelledby="track-inverted-slider"
              value={playerBehaviourValue.valueOf()}
              valueLabelDisplay="off"
              valueLabelFormat={(x) => `${x}%`}
              marks={behaviourMarks}
            />
            <Stack
              justifyContent="space-between"
              flexDirection="row"
              sx={{ marginTop: "-25px" }}
            >
              <Typography>{getTranslation("claiming")}</Typography>
              <Typography>
                {getTranslation("reinvesting")}
                {getTranslation("holding")}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <br />
        <Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 1,
              }}
            >
              {getTranslation("playerSentiment")}
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
                marks={sentimentMarks}
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
                marks={sentimentMarks}
              />
            )}
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.8em",
            }}
          >
            Current Votes: {goodVote.valueOf() + badVote.valueOf()}
          </Typography>
          <Box
            sx={{
              textAlign: "Center",
              mb: 1,
            }}
          >
            {isHad4Stars && totalAP >= 40000 ? (
              <FireBtn
                sx={{
                  width: "30%",
                  wordBreak: "break-word",
                  fontSize: 14,
                  textAlign: "center",
                }}
                onClick={() => handleVote()}
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
                onClick={() => handleVote()}
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
              {isHad4Stars
                ? !alreadyVoted
                  ? "You can vote now!"
                  : !voteExpired
                  ? `Your ${
                      myVote ? "Good" : "Bad"
                    } vote expires in ${calcVoteExpireDateTime(
                      lastestVoteDate.toString()
                    )}`
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
                onClick={handleReincarnation}
              >
                Reincarnation
              </FireBtn>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
      <VoteModal />
    </Card>
  );
};

export default EconomyStatus;
