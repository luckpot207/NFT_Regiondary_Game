import { Box, Card, CardMedia, Typography } from "@mui/material";

import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { I_Legion, I_Duel, I_Division } from "../../interfaces";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import FireBtn from "../Buttons/FireBtn";
import GreyBtn from "../Buttons/GreyBtn";
import { formatNumber, getTranslation } from "../../utils/utils";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { cancelDuel, duelCounter } from "../../web3hooks/contractFunctions";
import { useDuelSystem, useLegion } from "../../web3hooks/useContract";
import { getAllDuelsAct } from "../../helpers/duel";

type Props = {
  duel: I_Duel;
};

const DuelCard: React.FC<Props> = ({ duel }) => {
  // Hook info
  const dispatch = useDispatch();
  const {
    duelStatus,
    allLegions,
    divisions,
    currentLegionIndexForDuel,
    duelType,
  } = AppSelector(gameState);
  const { account } = useWeb3React();
  const duelContract = useDuelSystem();
  const legionContract = useLegion();

  const [loaded, setLoaded] = useState(false);
  const [leftTime, setLeftTime] = useState("");

  // Functions
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const [duelFlag, setDuelFlag] = useState(false);

  const handleDuelBtnClick = () => {
    if (duelFlag == false) {
      toast.error("You can't duel using your selected legion.");
      return;
    }
    dispatch(
      updateState({
        joinDuelModalOpen: true,
        currentDuelId: duel.duelId.valueOf(),
        endDateJoinDuel: duel.endDateTime.valueOf(),
      })
    );
  };

  const handleUpdatePrediction = () => {
    dispatch(
      updateState({
        updatePredictionModalOpen: true,
        currentDuelId: duel.duelId.valueOf(),
        endDateJoinDuel: duel.endDateTime.valueOf(),
      })
    );
  };

  const handleCancelDuel = async () => {
    try {
      const res = await cancelDuel(duelContract, account, duel.duelId);
      toast.success("Success");
      getAllDuelsAct(dispatch, account, duelContract, legionContract);
    } catch (e) {
      toast.error("Network issue");
    }
  };

  const handleDeleteBtnClick = () => {
    Swal.fire({
      title: "Cancel Duel",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f66810",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancel Duel",
      background: "#111",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelDuel();
      }
    });
  };

  React.useEffect(() => {
    setDuelFlag(false);
    divisions.forEach((division: I_Division, index: Number) => {
      if (
        duel.creatorLegion.attackPower >= division.minAP &&
        duel.creatorLegion.attackPower < division.maxAP
      ) {
        if (
          allLegions[currentLegionIndexForDuel.valueOf()].attackPower >=
          division.minAP &&
          allLegions[currentLegionIndexForDuel.valueOf()].attackPower <
          division.maxAP
        ) {
          setDuelFlag(true);
        }
      }
    });
  }, [currentLegionIndexForDuel, duelType]);

  useEffect(() => {
    const leftTimer = setInterval(() => {
      const left_time =
        new Date(duel.endDateTime.valueOf()).getTime() - new Date().getTime();
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
  }, [leftTime, duel.endDateTime]);

  const duelResult = () => {
    const priceDifference1 =
      Math.round(
        Math.abs(duel.result.valueOf() - duel.creatorEstmatePrice.valueOf()) *
        100
      ) / 100;
    const priceDifference2 =
      Math.round(
        Math.abs(duel.result.valueOf() - duel.joinerEstmatePrice.valueOf()) *
        100
      ) / 100;
    if (priceDifference1 == priceDifference2) {
      return 0;
    } else if (priceDifference1 > priceDifference2) {
      return 1;
    } else {
      return 2;
    }
  };

  return (
    <Box>
      {duelStatus.valueOf() == 1 ? (
        <>
          <Card sx={{ position: "relative" }}>
            <CardMedia
              component={"img"}
              image={duel.creatorLegion.jpg.valueOf()}
              alt="Legion Image"
              loading="lazy"
              onLoad={handleImageLoaded}
            />
            <Typography variant="h6" className="legion-name-text">
              {duel.creatorLegion.name}
            </Typography>
            <Box className="duel-left-time">
              <Typography sx={{ fontWeight: "bold" }}>{leftTime}</Typography>
            </Box>
            <Box
              className="legion-ap-div"
              sx={{
                left: "calc(50% - 50px)",
              }}
            >
              <Typography variant="h6" className="legion-ap-text">
                {formatNumber(duel.creatorLegion.attackPower)} AP
              </Typography>
            </Box>
            <Typography variant="subtitle2" className="legion-id-text">
              #{duel.creatorLegion.id}
            </Typography>
            {!duel.isMine ? (
              <Typography variant="subtitle2" className="duel-bet-price-text">
                {duel.type.valueOf() ? "$" + duel.betPrice : "All-in"}
              </Typography>
            ) : (
              <img
                className="duel-delete-btn"
                onClick={handleDeleteBtnClick}
                src="/assets/images/deleteBtn.png"
              ></img>
            )}
          </Card>
          <Box sx={{ textAlign: "center", mt: 1 }}>
            {duel.isMine ? (
              <FireBtn
                sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                onClick={handleUpdatePrediction}
              >
                Update Prediction
              </FireBtn>
            ) : duelFlag ? (
              <FireBtn
                sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                onClick={handleDuelBtnClick}
              >
                Duel
              </FireBtn>
            ) : (
              <GreyBtn
                sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                onClick={handleDuelBtnClick}
              >
                Duel
              </GreyBtn>
            )}
          </Box>
        </>
      ) : duelStatus.valueOf() == 2 ? (
        <>
          <Box
            sx={{
              border: "6px #00d0ff solid",
              padding: "4px",
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            <Card sx={{ position: "relative" }}>
              <CardMedia
                component={"img"}
                image={duel.creatorLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
              />
              <Typography variant="h6" className="legion-name-text">
                {duel.creatorLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.creatorLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.creatorLegion.id}
              </Typography>
            </Card>
            <Card sx={{ position: "relative", marginLeft: "10px" }}>
              <CardMedia
                component={"img"}
                image={duel.joinerLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
              />
              <Typography variant="h6" className="legion-name-text">
                {duel.joinerLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.joinerLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.joinerLegion.id}
              </Typography>
            </Card>
            <Box className="duel-estimate-price-div">
              <Typography
                className="estimate-price"
              >
                ${duel.creatorEstmatePrice}
              </Typography>
              <Typography
                className="estimate-price"
              >
                ${duel.joinerEstmatePrice}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "30%",
                position: "absolute",
                top: "7%",
                left: "40%",
              }}
            >
              <img
                src="/assets/images/vs.png"
                style={{
                  width: "70%",
                }}
                alt="VS"
              />
            </Box>
            <Box className="duel-left-time">
              <Typography className="duel-left-time-text" sx={{ fontWeight: "bold" }}>{leftTime}</Typography>
            </Box>
            <Typography variant="subtitle2" className="duel-bet-price-text">
              {duel.type.valueOf() ? "$" + duel.betPrice : "All-in"}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              border: "6px #195fb4 solid",
              padding: "4px",
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            <Card sx={{ position: "relative" }}>
              <CardMedia
                component={"img"}
                image={duel.creatorLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
                sx={{
                  border: "4px solid",
                  borderColor:
                    duelResult() == 0
                      ? "orange"
                      : duelResult() == 1
                        ? "red"
                        : "green",
                }}
              />
              <Typography variant="h6" className="legion-name-text">
                {duel.creatorLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.creatorLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.creatorLegion.id}
              </Typography>
            </Card>
            <Card sx={{ position: "relative", marginLeft: "10px" }}>
              <CardMedia
                component={"img"}
                image={duel.joinerLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
                sx={{
                  border: "4px solid",
                  borderColor:
                    duelResult() == 0
                      ? "orange"
                      : duelResult() == 1
                        ? "green"
                        : "red",
                }}
              />
              <Typography variant="h6" className="legion-name-text">
                {duel.joinerLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.joinerLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.joinerLegion.id}
              </Typography>
            </Card>
            <Box className="duel-estimate-price-div">
              <Typography
                className={
                  duelResult() == 0
                    ? "draw-price-text"
                    : duelResult() == 1
                      ? "loser-price-text"
                      : "winner-price-text"
                }
              >
                ${duel.creatorEstmatePrice}
              </Typography>
              <Typography
                className={
                  duelResult() == 0
                    ? "draw-price-text"
                    : duelResult() == 2
                      ? "loser-price-text"
                      : "winner-price-text"
                }
              >
                ${duel.joinerEstmatePrice}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "30%",
                position: "absolute",
                top: "7%",
                left: "40%",
              }}
            >
              <img
                src="/assets/images/vs.png"
                style={{
                  width: "70%",
                }}
                alt="VS"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "40%",
                position: "absolute",
                bottom: "20%",
                left: "30%",
              }}
            >
              <Typography
                className="duel-result-price-text"
              >
                $CRYPTO price was {duel.result}
              </Typography>
            </Box>
            <Box className="duel-left-time">
              <Typography className="duel-left-time-text" sx={{ fontWeight: "bold" }}>{duel.endDateTime}</Typography>
            </Box>
            <Typography variant="subtitle2" className="duel-bet-price-text">
              {duel.type.valueOf() ? "$" + duel.betPrice : "All-in"}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DuelCard;
