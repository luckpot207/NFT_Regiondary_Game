import {
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import FireBtn from "../../../components/Buttons/FireBtn";
import MonsterCard from "../../../components/Cards/Monster.card";
import BuySupppliesModal from "../../../components/Modals/BuySupplies.modal";
import HuntModal from "../../../components/Modals/Hunt.modal";
import MassHuntModal from "../../../components/Modals/MassHunt.modal";
import GreenMenuItem from "../../../components/UI/GreenMenuItem";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import OrgMenuItem from "../../../components/UI/OrgMenuItem";
import RedMenuItem from "../../../components/UI/RedMenuItem";
import {
  checkHuntPending,
  checkMassHuntPending,
  checkMassHuntRevealStatus,
  getAllMonstersAct,
} from "../../../helpers/hunt";
import { getAllLegionsAct } from "../../../helpers/legion";
import { I_Legion, I_Monster } from "../../../interfaces";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import {
  getBeastToken,
  getLegionLastHuntTime,
  getWalletMassHuntPending,
  initiateMassHunt,
} from "../../../web3hooks/contractFunctions";
import {
  useBeast,
  useLegion,
  useMonster,
  useVRF,
  useWeb3,
} from "../../../web3hooks/useContract";

const useStyles = makeStyles(() => ({
  Card: {
    position: "sticky",
    zIndex: 99,
    marginTop: "24px",
    marginBottom: "4px",
    padding: 10,
    paddingTop: "20px",
    "@media(min-width: 0px)": {
      top: "115px",
    },
    "@media(min-width: 358px)": {
      top: "66px",
    },
    "@media(min-width: 813px)": {
      top: "15px",
    },
    "@media(min-width: 900px)": {
      top: "49px",
    },
  },
}));

const Hunt: React.FC = () => {
  // Hook Info
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    language,
    allLegions,
    allMonsters,
    getAllLegionsLoading,
    getAllMonsterLoading,
    buySuppliesLoading,
  } = AppSelector(gameState);
  console.log(AppSelector(gameState), "geame")
  // Account & Web3
  const { account } = useWeb3React();

  // Contracts
  const legionContract = useLegion();
  const monsterContract = useMonster();
  const beastContract = useBeast();
  const vrfContract = useVRF();

  // States
  const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);
  const [totalBeastsCapacity, setTotalBeastsCapacity] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastHuntTime, setLastHuntTime] = useState(0);

  const canMassHunt = allLegions.reduce(
    (a, b) => a || b.huntStatus.valueOf(),
    false
  );

  // Functions
  const getBalance = async () => {
    getAllLegionsAct(dispatch, account, legionContract);
    getAllMonstersAct(dispatch, monsterContract);
    checkHuntPending(dispatch, account, legionContract);
    checkMassHuntPending(dispatch, account, legionContract);
  };

  const handleSelectLegion = (e: SelectChangeEvent) => {
    const legionIndex = parseInt(e.target.value);
    setCurrentLegionIndex(legionIndex);
  };

  const getTotalBeastsCapacity = async () => {
    try {
      let warriorCapacity = 0;
      for (
        let i = 0;
        i < allLegions[currentLegionIndex]?.beastIds.length;
        i++
      ) {
        const beast = await getBeastToken(
          beastContract,
          allLegions[currentLegionIndex]?.beastIds[i]
        );
        warriorCapacity += beast.capacity;
      }
      setTotalBeastsCapacity(warriorCapacity);
    } catch (error) {}
  };

  const getLastHuntTime = async () => {
    try {
      const lastHuntTime = await getLegionLastHuntTime(
        legionContract,
        allLegions[currentLegionIndex]?.id
      );
      setLastHuntTime(lastHuntTime);
    } catch (error) {}
  };

  const calcHuntTime = () => {
    const date = new Date(lastHuntTime * 1000);
    const diff = currentTime.getTime() - date.getTime();
    const diffSecs = (24 * 3600 * 1000 - diff) / 1000;
    const diff_in_hours = Math.floor(diffSecs / 3600).toFixed(0);
    const diff_in_mins = Math.floor((diffSecs % 3600) / 60).toFixed(0);
    const diff_in_secs = Math.floor(diffSecs % 3600) % 60;
    if (lastHuntTime !== 0) {
      if (diff / (1000 * 3600 * 24) >= 1) {
        return "00h 00m 00s";
      }
    } else if (lastHuntTime === 0) {
      return "00h 00m 00s";
    }
    return `${diff_in_hours}h ${diff_in_mins}m ${diff_in_secs}s`;
  };

  const checkHuntTime = () => {
    var diff = currentTime.getTime() - lastHuntTime * 1000;
    if (diff / 1000 / 3600 >= 24) {
    } else {
      var totalSecs = parseInt(((24 * 1000 * 3600 - diff) / 1000).toFixed(2));
      var hours = Math.floor(totalSecs / 3600).toFixed(0);
      var mins = Math.floor((totalSecs % 3600) / 60).toFixed(0);
      var secs = (Math.floor(totalSecs % 3600) % 60).toFixed(0);
      if (parseInt(hours) == 0 && parseInt(mins) == 0 && parseInt(secs) == 0) {
        getAllLegionsAct(dispatch, account, legionContract);
      }
    }
  };

  const handleBuySupplies = () => {
    dispatch(
      updateState({
        isShowBuySuppliesModal: true,
        legionForSupplies: allLegions[currentLegionIndex],
      })
    );
  };

  const handleInitialMassHunt = async () => {
    try {
      let massHuntPending = await getWalletMassHuntPending(
        legionContract,
        account
      );
      dispatch(updateState({ massHuntPending }));
      if (!massHuntPending) {
        dispatch(updateState({ initialMassHuntLoading: true }));
        await initiateMassHunt(legionContract, account);
        let massHuntPending = await getWalletMassHuntPending(
          legionContract,
          account
        );
        dispatch(updateState({ massHuntPending }));
        checkMassHuntRevealStatus(
          dispatch,
          account,
          legionContract,
          vrfContract
        );
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ initialMassHuntLoading: false }));
  };

  const scrollTo = (attackPower: Number) => {
    let monsterId = 0;
    for (let i = 0; i < allMonsters.length; i++) {
      const monster = allMonsters[i];
      if (monster.attackPower <= attackPower) {
        monsterId = monster.id as number;
      } else {
        break;
      }
    }
    document
      .getElementById(`monster${monsterId}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Use Effect
  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    getTotalBeastsCapacity();
    getLastHuntTime();
  }, [allLegions, currentLegionIndex]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
    checkHuntTime();
  }, [currentTime]);

  return (
    <Box sx={{ position: "relative" }} component="div">
      <Card sx={{ p: 2, my: 2 }} className={classes.Card}>
        {allLegions.length === 0 ? (
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
              <LanguageTranslate translateKey="noMintedLegion" />
            </Box>
            <NavLink to="/createlegions" className="td-none">
              <FireBtn>
                <LanguageTranslate translateKey="createLegion" />
              </FireBtn>
            </NavLink>
          </Box>
        ) : (
          <Grid container spacing={2} alignItems="center" columns={80}>
            <Grid item xs={80} sm={80} md={20}>
              <FormControl fullWidth>
                <InputLabel id="hunt-legion-select-label">
                  <LanguageTranslate translateKey="legions" />
                </InputLabel>
                <Select
                  labelId="hunt-legion-select-label"
                  id="hunt-legion-select"
                  value={currentLegionIndex.toString()}
                  onChange={handleSelectLegion}
                >
                  {allLegions.map((legion: I_Legion, index: number) =>
                    legion.huntStatus ? (
                      <GreenMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                      </GreenMenuItem>
                    ) : legion.supplies > 0 ? (
                      <OrgMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                      </OrgMenuItem>
                    ) : (
                      <RedMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                      </RedMenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={40} sm={40} md={9}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: {
                    xs: 14,
                    sm: 16,
                    md: 20,
                  },
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() =>
                  scrollTo(allLegions[currentLegionIndex]?.attackPower)
                }
              >
                {allLegions[currentLegionIndex]?.attackPower.toFixed(0)} AP
              </Typography>
            </Grid>
            <Grid item xs={40} sm={40} md={7}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 20 },
                }}
              >
                W {allLegions[currentLegionIndex]?.warriorIds.length}/
                {totalBeastsCapacity}
              </Typography>
            </Grid>
            <Grid item xs={40} sm={40} md={7}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 20 },
                }}
              >
                B {allLegions[currentLegionIndex]?.beastIds.length}/ 10
              </Typography>
            </Grid>
            <Grid item xs={40} sm={40} md={7}>
              <Typography
                variant="h5"
                sx={{
                  color: allLegions[currentLegionIndex]?.huntStatus
                    ? "#18e001"
                    : allLegions[currentLegionIndex]?.supplies > 0
                    ? "#ae7c00"
                    : "#fd3742",
                  fontWeight: 1000,
                  fontSize: { xs: 14, sm: 16, md: 20 },
                  cursor: "pointer",
                }}
                onClick={() => handleBuySupplies()}
              >
                {allLegions[currentLegionIndex]?.supplies}
                <LanguageTranslate translateKey="hSymbol" />{" "}
                {allLegions[currentLegionIndex]?.supplies === 0 && (
                  <LanguageTranslate translateKey="suppliesNeeded" />
                )}
              </Typography>
            </Grid>
            <Grid item xs={40} sm={40} md={10}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 20 },
                }}
              >
                {calcHuntTime()}
              </Typography>
            </Grid>
            <Grid item xs={40} sm={40} md={10} sx={{ marginRight: "auto" }}>
              <FireBtn
                onClick={() => handleInitialMassHunt()}
                disabled={!canMassHunt}
              >
                <LanguageTranslate translateKey="massHunt" />{" "}
              </FireBtn>
            </Grid>
            <Grid item xs={40} sm={40} md={10}>
              <LanguageTranslate translateKey="huntHistory" /> (Coming Soon)
              {/* <NavLink to="/hunthistory" className="td-none">
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: 12, sm: 14, md: 16 },
                    textAlign: "center",
                    color: "darkgrey",
                  }}
                >
                  <LanguageTranslate translateKey="huntHistory" />
                </Typography>
              </NavLink> */}
            </Grid>
          </Grid>
        )}
        {(buySuppliesLoading || getAllLegionsLoading) && (
          <Box
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              paddingLeft: 10,
              paddingRight: 10,
              display: "flex",
              alignItems: "center",
              background: "#222222ee",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ textAlign: "center", marginBottom: 1 }}>
                {getAllLegionsLoading && (
                  <LanguageTranslate translateKey="loadingLegions" />
                )}
                {buySuppliesLoading && (
                  <LanguageTranslate translateKey="buyingSupplies" />
                )}
              </Box>
              <LinearProgress sx={{ width: "100%" }} color="success" />
            </Box>
          </Box>
        )}
      </Card>
      {getAllMonsterLoading ? (
        <LoadingBloodstone loadingPage="hunt" />
      ) : (
        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ paddingTop: "2%" }}
          spacing={4}
        >
          {allMonsters.map((monster: I_Monster, index: number) => (
            <Grid
              item
              key={index}
              sx={{
                width: "500px",
                maxHeight: "700px",
                margin: "auto",
                marginBottom: "200px",
              }}
              id={`monster${index + 1}`}
            >
              <MonsterCard
                monster={monster}
                isHuntable={
                  allLegions[currentLegionIndex]?.huntStatus &&
                  monster.attackPower <=
                    allLegions[currentLegionIndex]?.attackPower
                }
                legion={allLegions[currentLegionIndex]}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <BuySupppliesModal />
      <HuntModal />
      <MassHuntModal />
    </Box>
  );
};

export default Hunt;
