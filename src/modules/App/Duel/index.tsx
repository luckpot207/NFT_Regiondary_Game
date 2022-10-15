import {
  Box,
  Card,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  ButtonGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";
import { useLegion, useWeb3 } from "../../../web3hooks/useContract";
import { AppSelector } from "../../../store";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { I_Duel, I_Legion } from "../../../interfaces";
import OrgMenuItem from "../../../components/UI/OrgMenuItem";
import GreenMenuItem from "../../../components/UI/GreenMenuItem";
import RedMenuItem from "../../../components/UI/RedMenuItem";
import DuelLegionAPFilter from "../../../components/Filters/DuelLegionAP.filter";
import DuelLeftTimeSort from "../../../components/Filters/DuelLeftTime.sort";
import DuelProcessSort from "../../../components/Filters/DuelProcess.sort";
import DuelShowOnlyMineFilter from "../../../components/Filters/DuelShowOnlyMine.filter";
import DuelTypeSort from "../../../components/Filters/DuelType.sort";
import DuelCard from "../../../components/Cards/Duel.card";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import FireBtn from "../../../components/Buttons/FireBtn";
import CreateDuelModal from "../../../components/Modals/CreateDuel.modal";
import JoinDuelModal from "../../../components/Modals/JoinDuel.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import UpdatePredictionModal from "../../../components/Modals/UpdatePrediction.modal";
import { useDuelSystem } from "../../../web3hooks/useContract";
import { doingDuels, ownerOf } from "../../../web3hooks/contractFunctions";
import { getAllDuelsAct } from "../../../helpers/duel";
import { formatNumber } from "../../../utils/utils";

const Duel: React.FC = () => {
  const dispatch = useDispatch();
  const {
    language,
    getAllDulesLoading,
    allLegions,
    allDuels,
    duelStatus,
    duelLegionFilterMinAP,
    duelLegionFilterMaxAP,
    duelLegionFilterMaxConstAP,
    duelJoinLeftMaxTime,
    duelJoinLeftMinTime,
    duelLeftMaxTime,
    duelLeftMinTime,
    duelResultFilterStart,
    duelResultFilterEnd,
    duelJoinLeftMaxConstTime,
    duelLeftMaxConstTime,
    duelResultFilterEndConst,
    duelShowOnlyMine,
    duelType,
    currentLegionIndexForDuel,
    currentPage,
    pageSize,
  } = AppSelector(gameState);
  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  const duelContract = useDuelSystem();
  const legionContract = useLegion();

  const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);
  const [legionsDuelStatus, setLegionsDuelStatus] = useState<boolean[]>([]);
  const [currentInvitations, setCurrentInvitations] = useState<number>(0);
  const [ongoingDuels, setOngoingDuels] = useState<number>(0);
  const [pastDuels, setPastDuels] = useState<number>(0);
  const [totalPastDuels, setTotalPastDuels] = useState<number>(0);
  const [totalOngoingDuels, setTotalOngoingDuels] = useState<number>(0);
  const [nextDuelResultDateTime, setNextDuelResultDateTime] =
    useState<string>("");
  const [leftTimeForNextDuelResult, setLeftTimeForNextDuelResult] =
    useState<string>("");

  const handleDuelSort = (val: Number) => {
    dispatch(updateState({ duelStatus: val }));
  };

  const handleSelectLegion = (e: SelectChangeEvent) => {
    const legionIndex = parseInt(e.target.value);
    setCurrentLegionIndex(legionIndex);
    dispatch(updateState({ currentLegionIndexForDuel: legionIndex }));
  };

  const showCreateDuelModal = () => {
    dispatch(updateState({ createDuelModalOpen: true }));
  };

  const getBalance = async () => {
    getAllDuelsAct(dispatch, account, duelContract, legionContract);
    var legionsDueStatusTemp: boolean[] = [];
    for (let i = 0; i < allLegions.length; i++) {
      const legion = allLegions[i];
      const res = await doingDuels(duelContract, legion.id);
      legionsDueStatusTemp.push(res);
    }
    setLegionsDuelStatus(legionsDueStatusTemp);
  };

  useEffect(() => {
    const leftTimer = setInterval(() => {
      if (nextDuelResultDateTime == "") {
        setLeftTimeForNextDuelResult("");
      } else {
        const timeDifference =
          new Date(nextDuelResultDateTime.valueOf()).getTime() -
          new Date().getTime();
        const leftTimeStr =
          "" +
          Math.floor(timeDifference / (60 * 60 * 1000)) +
          "h " +
          Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000)) +
          "m " +
          Math.floor((timeDifference % (60 * 1000)) / 1000) +
          "s";
        setLeftTimeForNextDuelResult(leftTimeStr);
      }
    }, 1000);
    return () => clearInterval(leftTimer);
  }, [nextDuelResultDateTime, leftTimeForNextDuelResult]);

  useEffect(() => {
    getBalance();
  }, [allLegions]);

  const getOwnDuelStatus = async () => {
    try {
      let endDate: string = "";
      const currentInvitationsTemp = allDuels.filter(
        (duel) => duel.isMine && duel.status == 1
      );
      const ongoingDuelsTemp = allDuels.filter(
        (duel) => duel.isMine && duel.status == 2
      );
      const pastDuelsTemp = allDuels.filter(
        (duel) => duel.isMine && duel.status == 3
      );
      const totalPastDuelsTemp = allDuels.filter((duel) => duel.status == 3);
      const totalOngoingDuelsTemp = allDuels.filter((duel) => duel.status == 2);

      ongoingDuelsTemp.forEach((duel) => {
        if (duel.status != 0) {
          if (endDate == "") {
            endDate = duel.endDateTime.valueOf();
          } else {
            if (
              new Date(endDate).getTime() >
              new Date(duel.endDateTime.valueOf()).valueOf()
            ) {
              endDate = duel.endDateTime.valueOf();
            }
          }
        }
      });

      setNextDuelResultDateTime(endDate);
      setCurrentInvitations(currentInvitationsTemp.length);
      setOngoingDuels(ongoingDuelsTemp.length);
      setPastDuels(pastDuelsTemp.length);
      setTotalPastDuels(totalPastDuelsTemp.length);
      setTotalOngoingDuels(totalOngoingDuelsTemp.length);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (allDuels.length != 0) {
      getOwnDuelStatus();
    }
  }, [allDuels]);

  const APFilterVal = allDuels.filter((duel: I_Duel) => {
    return duel.status != 3
      ? duel.creatorLegion.attackPower >=
      duelLegionFilterMinAP.valueOf() * 1000 &&
      (duelLegionFilterMaxAP === duelLegionFilterMaxConstAP
        ? true
        : duel.creatorLegion.attackPower <=
        duelLegionFilterMaxAP.valueOf() * 1000)
      : true;
  });

  const StatusFilterVal = APFilterVal.filter(
    (duel: I_Duel) => duel.status == duelStatus
  );

  const TimeFilterVal = StatusFilterVal.filter((duel: I_Duel) => {
    if (duelStatus == 0) {
      const timeLeft: Number =
        (new Date(duel.endDateTime.valueOf()).getTime() -
          new Date().getTime()) /
        (60 * 1000);
      return (
        timeLeft >= duelJoinLeftMinTime.valueOf() &&
        (duelJoinLeftMaxTime === duelJoinLeftMaxConstTime
          ? true
          : timeLeft <= duelJoinLeftMaxTime.valueOf())
      );
    } else if (duelStatus == 1) {
      const timeLeft: Number =
        (new Date(duel.endDateTime.valueOf()).getTime() -
          new Date().getTime()) /
        (60 * 1000);
      return (
        timeLeft >= duelLeftMinTime.valueOf() &&
        (duelLeftMaxTime === duelLeftMaxConstTime
          ? true
          : timeLeft <= duelLeftMaxTime.valueOf())
      );
    } else {
      const daysAgo: Number =
        (new Date().getTime() -
          new Date(duel.endDateTime.valueOf()).getTime()) /
        (24 * 60 * 60 * 1000);
      return (
        daysAgo >= duelResultFilterStart.valueOf() &&
        (duelResultFilterEnd === duelResultFilterEndConst
          ? true
          : daysAgo <= duelResultFilterEnd.valueOf())
      );
    }
  });

  const OnlyMineFilterVal = StatusFilterVal.filter((duel: I_Duel) =>
    duelShowOnlyMine ? duel.isMine : true
  );

  const DuelTypeFilterVal = OnlyMineFilterVal.filter(
    (duel: I_Duel) => duel.type == duelType
  );

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }} className="bg-c5">
            {allLegions.length == 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "calc(17px + 5 * (100vw - 320px) / 1080)",
                    mr: 1,
                  }}
                >
                  You need to create Legion to start Duel!
                </Box>
                <NavLink to="/createlegions" className="td-none">
                  <FireBtn>
                    <LanguageTranslate translateKey="createLegion" />
                  </FireBtn>
                </NavLink>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={4}>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
                    {duelStatus == 1
                      ? "Duels"
                      : duelStatus == 2
                        ? "Ongoing Duels"
                        : "Duel Results"}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Card
            onClick={() => handleDuelSort(1)}
            className={duelStatus == 1 ? "bg-c5 info-card border-blue" : "bg-c5 info-card"}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography>
              Your Current Invitations: {formatNumber(currentInvitations)}
            </Typography>
            <Typography>
              Your Ongoing Duels: {formatNumber(ongoingDuels)}
            </Typography>
            <Typography>
              Time Until Your Next Duel Results: {leftTimeForNextDuelResult}
            </Typography>
            <Typography mb={1}>
              Your Past Duels: {formatNumber(pastDuels)}
            </Typography>
            <Box mb={1}>
              <FireBtn
                sx={{ width: "150px" }}
                onClick={() => showCreateDuelModal()}
              >
                Create Duel
              </FireBtn>
            </Box>
            <Box mb={1}>
              <FireBtn
                sx={{ width: "150px" }}
                onClick={() => handleDuelSort(1)}
              >
                Available Duel
              </FireBtn>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            onClick={() => handleDuelSort(2)}
            className={duelStatus == 2 ? "bg-c5 info-card border-blue" : "bg-c5 info-card"}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <Typography mb={2}>Total Ongoing Duels</Typography>
            <Typography mb={2} sx={{ fontSize: "2em", textAlign: "center" }}>
              {formatNumber(totalOngoingDuels)}
            </Typography>
            <Box>
              <FireBtn
                sx={{ width: "150px" }}
                onClick={() => handleDuelSort(2)}
              >
                Ongoing Duels
              </FireBtn>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Card
            onClick={() => handleDuelSort(3)}
            className={duelStatus == 3 ? "bg-c5 info-card border-blue" : "bg-c5 info-card"}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography mb={2}>Total Past Duels</Typography>
            <Typography mb={2} sx={{ fontSize: "2em", textAlign: "center" }}>
              {formatNumber(totalPastDuels)}
            </Typography>
            <Box>
              <FireBtn
                sx={{ width: "150px" }}
                onClick={() => handleDuelSort(3)}
              >
                Duel Results
              </FireBtn>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6} lg={3}>
          <DuelLegionAPFilter />
        </Grid>

        {duelStatus == 1 ? (
          <Grid item xs={12} md={6} lg={2}>
            {" "}
            <FormControl>
              <Select
                id="hunt-legion-select"
                value={currentLegionIndex.toString()}
                onChange={handleSelectLegion}
              >
                {allLegions.map((legion: I_Legion, index: number) =>
                  legionsDuelStatus[index] ? (
                    <OrgMenuItem value={index} key={index}>
                      {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                    </OrgMenuItem>
                  ) : legion.attackPower.valueOf() >= 10000 &&
                    legion.attackPower <= 70000 ? (
                    <GreenMenuItem value={index} key={index}>
                      {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                    </GreenMenuItem>
                  ) : (
                    <RedMenuItem value={index} key={index}>
                      {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                    </RedMenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} md={6} lg={3}>
          <DuelLeftTimeSort />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <DuelShowOnlyMineFilter />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <DuelTypeSort />
        </Grid>
      </Grid>
      {
        // getAllDulesLoading.valueOf() || getAllLegionsLoading.valueOf()
        getAllDulesLoading.valueOf() ? (
          <LoadingBloodstone loadingPage="duel" />
        ) : (
          <Box>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {DuelTypeFilterVal.slice(
                pageSize.valueOf() * (currentPage.valueOf() - 1),
                pageSize.valueOf() * currentPage.valueOf()
              ).map((duel, index) =>
                duelStatus == 1 ? (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <DuelCard duel={duel} />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                    <DuelCard duel={duel} />
                  </Grid>
                )
              )}
            </Grid>
            {DuelTypeFilterVal.length > 0 && (
              <Box>
                <ItemPagination totalCount={DuelTypeFilterVal.length} />
              </Box>
            )}
          </Box>
        )
      }
      <CreateDuelModal />
      <JoinDuelModal />
      <UpdatePredictionModal />
    </Box>
  );
};

export default Duel;
