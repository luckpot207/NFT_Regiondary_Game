import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import FireBtn from "../../../components/Buttons/FireBtn";
import MassHuntModal from "../../../components/Modals/MassHunt.modal";
import SummonBeastPopover from "../../../components/Popover/SummonBeast.popover";
import SummonWarriorPopover from "../../../components/Popover/SummonWarrior.popover";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import Constants from "../../../constants";
import { revealBeast } from "../../../helpers/beast";
import {
  checkMassHuntPending,
  checkMassHuntRevealStatus,
  getAllMonstersAct,
} from "../../../helpers/hunt";
import { revealWarrior } from "../../../helpers/warrior";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  getWalletMassHuntPending,
  initiateMassHunt,
} from "../../../web3hooks/contractFunctions";
import {
  useBeast,
  useLegion,
  useMonster,
  useVRF,
  useWarrior,
} from "../../../web3hooks/useContract";

const TakeAction: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    language,
    mintBeastPending,
    mintBeastVRFPending,
    initialMintBeastLoading,
    revealBeastLoading,
    mintWarriorPending,
    mintWarriorVRFPending,
    initialMintWarriorLoading,
    revealWarriorLoading,
    massHuntPending,
    allLegions,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const vrfContract = useVRF();
  const monsterContract = useMonster();

  // States

  const canMassHunt = allLegions.reduce(
    (a, b) => a || b.huntStatus.valueOf(),
    false
  );

  // Functions
  const getBalance = () => {
    checkMassHuntPending(dispatch, account, legionContract);
    getAllMonstersAct(dispatch, monsterContract);
  };

  const handleSummonWarriorPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (mintWarriorPending) {
      revealWarrior(dispatch, account, warriorContract);
    } else {
      dispatch(updateState({ summonWarriorAnchorEl: event.currentTarget }));
    }
  };

  const handleSummonBeastPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (mintBeastPending) {
      revealBeast(dispatch, account, beastContract);
    } else {
      dispatch(updateState({ summonBeastAnchorEl: event.currentTarget }));
    }
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

  const handleRevealMassHunt = () => {
    dispatch(updateState({ revealMassHuntLoading: true }));
  };

  // UseEffect
  useEffect(() => {
    getBalance();
  }, []);

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
          <LanguageTranslate translateKey="takeAction" />
        </Typography>
        <Box>
          <Grid container spacing={{ xs: 2, sm: 2, md: 1, lg: 2 }}>
            <Grid
              item
              xs={6}
              md={12}
              lg={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  aria-describedby="summon-warrior-btn"
                  onClick={handleSummonWarriorPopover}
                  loading={
                    initialMintWarriorLoading.valueOf() ||
                    revealWarriorLoading.valueOf() ||
                    mintWarriorVRFPending.valueOf()
                  }
                >
                  <img
                    src={`/assets/images/dashboard/warrior.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  />
                  {mintWarriorPending ? (
                    <LanguageTranslate translateKey="revealWarriors" />
                  ) : (
                    <LanguageTranslate translateKey="summonWarriors" />
                  )}
                </FireBtn>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  aria-describedby="summon-beast-btn"
                  onClick={handleSummonBeastPopover}
                  loading={
                    initialMintBeastLoading.valueOf() ||
                    revealBeastLoading.valueOf() ||
                    mintBeastVRFPending.valueOf()
                  }
                >
                  <img
                    src={`/assets/images/dashboard/beast.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  />
                  {mintBeastPending ? (
                    <LanguageTranslate translateKey="revealBeasts" />
                  ) : (
                    <LanguageTranslate translateKey="summonBeasts" />
                  )}
                </FireBtn>
                <NavLink to="/createlegions" className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/legion.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="createLegion" />
                  </FireBtn>
                </NavLink>
                <NavLink to="/hunt" className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/hunt.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="hunt" />
                  </FireBtn>
                </NavLink>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  disabled={!canMassHunt}
                  onClick={() => {
                    !massHuntPending
                      ? handleInitialMassHunt()
                      : handleRevealMassHunt();
                  }}
                >
                  <img
                    src={`/assets/images/dashboard/masshuntIcon.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  />
                  <LanguageTranslate translateKey="massHunt" />
                </FireBtn>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={12}
              lg={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box>
                <NavLink to="/createlegions" className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/marketWarrior.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="warriorsMarket" />
                  </FireBtn>
                </NavLink>
                <NavLink to="/createlegions" className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/marketBeast.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="beastsMarket" />
                  </FireBtn>
                </NavLink>
                <NavLink to="/createlegions" className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/marketLegion.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="legionsMarket" />
                  </FireBtn>
                </NavLink>
                <a
                  href={Constants.navlink.dextool}
                  target="_blank"
                  className="td-none"
                >
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/chart.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="dextoolsChart" />
                  </FireBtn>
                </a>
                <a
                  href={Constants.navlink.pancake}
                  target="_blank"
                  className="td-none"
                >
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/pancake.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    <LanguageTranslate translateKey="buyBLST" />
                  </FireBtn>
                </a>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <SummonWarriorPopover />
      <SummonBeastPopover />
      <MassHuntModal />
    </Card>
  );
};

export default TakeAction;
