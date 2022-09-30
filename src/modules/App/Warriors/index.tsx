import { Box, Card, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  changeAllWarriorExecuteStatus,
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  getAllWarriorsAct,
  handleExecuteWarriors,
  revealWarrior,
} from "../../../helpers/warrior";
import { useBeast, useWarrior, useWeb3 } from "../../../web3hooks/useContract";

import { AppSelector } from "../../../store";
import FireBtn from "../../../components/Buttons/FireBtn";
import { I_Warrior } from "../../../interfaces";
import ListOnMarketplaceModal from "../../../components/Modals/ListOnMarketplace.modal";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { NavLink } from "react-router-dom";
import RevealWarriorModal from "../../../components/Modals/RevealWarrior.modal";
import SummonWarriorPopover from "../../../components/Popover/SummonWarrior.popover";
import WarriorAPFilter from "../../../components/Filters/WarriorAP.filter";
import WarriorCard from "../../../components/Cards/Warrior.card";
import WarriorLevelFilter from "../../../components/Filters/WarriorLevel.filter";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import ItemPagination from "../../../components/Pagination/Pagination";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Warriors: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    warriorBalance,
    allWarriors,
    getAllWarriorsLoading,
    initialMintWarriorLoading,
    mintWarriorPending,
    revealWarriorLoading,
    mintWarriorVRFPending,
    executeWarriorsLoading,
    listingLoading,
    currentPage,
    pageSize,
    warriorFilterLevel,
    warriorFilterMinAP,
    warriorFilterMaxAP,
    warriorFilterMinConstAP,
    warriorFilterMaxConstAP,
  } = AppSelector(gameState);

  // Account
  const { account } = useWeb3React();

  // Contracts
  const warriorContract = useWarrior();

  // States
  const warningText = LanguageTranslate({ translateKey: "warning" });
  const massExecuteText = LanguageTranslate({ translateKey: "massExecute" });
  const executeWarningText = LanguageTranslate({
    translateKey: "executeWarning",
  });

  const totalAttackPower = allWarriors.reduce(
    (a, b) => a + b.attackPower.valueOf(),
    0
  );
  const levelFilterVal =
    warriorFilterLevel === 0
      ? allWarriors
      : allWarriors.filter(
          (warrior) => warrior.strength === warriorFilterLevel
        );
  const APFilterVal = levelFilterVal.filter(
    (warrior) =>
      warrior.attackPower >= warriorFilterMinAP &&
      (warriorFilterMaxAP === warriorFilterMaxConstAP
        ? true
        : warrior.attackPower <= warriorFilterMaxAP)
  );

  const isSelectedAll = APFilterVal.reduce(
    (a, b) => a && b.executeStatus,
    true
  );

  // Functions
  const getBalance = async () => {
    getAllWarriorsAct(dispatch, account, warriorContract);
  };

  const handleSelectExecuteStatus = (status: boolean) => {
    const ids = APFilterVal.map((warrior: I_Warrior) => warrior.id);
    dispatch(changeAllWarriorExecuteStatus({ status, ids }));
  };

  const handleMassExecute = () => {
    const ids = APFilterVal.filter(
      (item: I_Warrior) => item.executeStatus === true
    ).map((item: I_Warrior) => item.id);

    if (
      APFilterVal.filter(
        (item: I_Warrior) => item.executeStatus === true && item.strength > 2
      ).length > 0
    ) {
      Swal.fire({
        title: warningText,
        text: executeWarningText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f66810",
        cancelButtonColor: "#d33",
        confirmButtonText: massExecuteText,
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          handleExecuteWarriors(dispatch, account, warriorContract, ids);
        }
      });
    } else {
      handleExecuteWarriors(dispatch, account, warriorContract, ids);
    }
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

  // Use Effect
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }} className="bg-c5">
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              <LanguageTranslate translateKey="warriors" />
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              <LanguageTranslate translateKey="summonWarriors" />
            </Typography>
            <FireBtn
              sx={{
                mb: 1,
                wordBreak: "break-word",
                px: 2,
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
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              <LanguageTranslate translateKey="currentWarriors" />
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
              className="fc2"
            >
              {warriorBalance}
            </Typography>
            <NavLink to="/createlegions" className="td-none">
              <FireBtn
                sx={{
                  mb: 1,
                  wordBreak: "break-word",
                  px: 2,
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
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              <LanguageTranslate translateKey="totalAttackPower" />
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
              className="fc2"
            >
              {formatNumber(totalAttackPower)}
            </Typography>
            <FireBtn
              sx={{
                mb: 1,
                wordBreak: "break-word",
                px: 2,
              }}
              onClick={() => handleSelectExecuteStatus(!isSelectedAll)}
            >
              {isSelectedAll ? (
                <LanguageTranslate translateKey="deSelectAll" />
              ) : (
                <LanguageTranslate translateKey="selectAll" />
              )}
            </FireBtn>
            <FireBtn
              sx={{
                mb: 1,
                wordBreak: "break-word",
                px: 2,
              }}
              disabled={
                APFilterVal.filter((warrior) => warrior.executeStatus === true)
                  .length === 0 || getAllWarriorsLoading.valueOf()
              }
              loading={executeWarriorsLoading.valueOf()}
              onClick={() => handleMassExecute()}
            >
              <LanguageTranslate translateKey="massExecute" />
            </FireBtn>
          </Card>
        </Grid>
      </Grid>
      {getAllWarriorsLoading ||
      executeWarriorsLoading ||
      mintWarriorPending ||
      initialMintWarriorLoading ||
      revealWarriorLoading ||
      listingLoading ? (
        <LoadingBloodstone loadingPage="warriors" />
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <WarriorLevelFilter showSmall={false} />
              </Grid>
              <Grid item xs={12} md={4}></Grid>
              <Grid item xs={12} md={4}>
                <WarriorAPFilter />
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {APFilterVal.slice(
              pageSize.valueOf() * (currentPage.valueOf() - 1),
              pageSize.valueOf() * currentPage.valueOf()
            ).map((warrior: I_Warrior, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <WarriorCard warrior={warrior} isActionBtns={true} />
              </Grid>
            ))}
          </Grid>
          {APFilterVal.length > 0 ? (
            <Box>
              <ItemPagination totalCount={APFilterVal.length} />
            </Box>
          ) : (
            <Card sx={{ p: 4 }}>
              <Typography variant="h6">
                {warriorFilterLevel === 0 &&
                warriorFilterMinAP === warriorFilterMinConstAP &&
                warriorFilterMaxAP === warriorFilterMaxConstAP ? (
                  <LanguageTranslate translateKey="nowarriors" />
                ) : (
                  <LanguageTranslate translateKey="nowarriorswithlevelandap" />
                )}
              </Typography>
            </Card>
          )}
        </Box>
      )}
      <SummonWarriorPopover />
      <RevealWarriorModal />
      <ListOnMarketplaceModal />
    </Box>
  );
};

export default Warriors;
