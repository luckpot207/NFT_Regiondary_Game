import { Box, Card, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  changeAllBeastExecuteStatus,
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { formatNumber } from "../../../utils/utils";
import {
  getAllBeastsAct,
  handleExecuteBeasts,
  revealBeast,
} from "../../../helpers/beast";
import { useBeast, useWeb3 } from "../../../web3hooks/useContract";

import { AppSelector } from "../../../store";
import BeastCard from "../../../components/Cards/Beast.card";
import FireBtn from "../../../components/Buttons/FireBtn";
import { I_Beast } from "../../../interfaces";
import ListOnMarketplaceModal from "../../../components/Modals/ListOnMarketplace.modal";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { NavLink } from "react-router-dom";
import RevealBeastModal from "../../../components/Modals/RevealBeast.modal";
import SummonBeastPopover from "../../../components/Popover/SummonBeast.popover";
import Tutorial from "../../../components/Tutorial/Tutorial";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import BeastCapacityFilter from "../../../components/Filters/BeastCapacity.filter";
import ItemPagination from "../../../components/Pagination/Pagination";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import Swal from "sweetalert2";

const Beasts: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    mintBeastPending,
    initialMintBeastLoading,
    revealBeastLoading,
    mintBeastVRFPending,
    beastBalance,
    allBeasts,
    getAllBeastsLoading,
    executeBeastsLoading,
    listingLoading,
    beastFilterCapacity,
    currentPage,
    pageSize,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const beastContract = useBeast();

  // States
  const warningText = LanguageTranslate({ translateKey: "warning" });
  const massExecuteText = LanguageTranslate({ translateKey: "massExecute" });
  const executeWarningText = LanguageTranslate({
    translateKey: "executeWarning",
  });

  const totalCapacity = allBeasts.reduce((a, b) => a + b.capacity.valueOf(), 0);
  const capacityFilterVal =
    beastFilterCapacity === 0
      ? allBeasts
      : allBeasts.filter((beast) => beast.capacity === beastFilterCapacity);

  const isSelectedAll = capacityFilterVal.reduce(
    (a, b) => a && b.executeStatus,
    true
  );

  // Functions
  const getBalance = async () => {
    getAllBeastsAct(dispatch, account, beastContract);
  };

  const handleSelectExecuteStatus = (status: boolean) => {
    const ids = capacityFilterVal.map((beast: I_Beast) => beast.id);
    dispatch(changeAllBeastExecuteStatus({ ids, status }));
  };

  const handleMassExecute = () => {
    const ids = capacityFilterVal
      .filter((item: I_Beast) => item.executeStatus === true)
      .map((item: I_Beast) => item.id);
    if (
      capacityFilterVal.filter(
        (item: I_Beast) => item.executeStatus === true && item.capacity > 2
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
          handleExecuteBeasts(dispatch, account, beastContract, ids);
        }
      });
    } else {
      handleExecuteBeasts(dispatch, account, beastContract, ids);
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
              <LanguageTranslate translateKey="beasts" />
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              <LanguageTranslate translateKey="summonBeasts" />
            </Typography>
            <FireBtn
              sx={{
                mb: 1,
                wordBreak: "break-word",
                px: 2,
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
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              <LanguageTranslate translateKey="currentBeasts" />
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
              className="fc2"
            >
              {beastBalance}
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
              <LanguageTranslate translateKey="warriorCapacity" />
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
              className="fc2"
            >
              {formatNumber(totalCapacity)}
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
                capacityFilterVal.filter(
                  (beast) => beast.executeStatus === true
                ).length === 0 || getAllBeastsLoading.valueOf()
              }
              loading={executeBeastsLoading.valueOf()}
              onClick={() => handleMassExecute()}
            >
              <LanguageTranslate translateKey="massExecute" />
            </FireBtn>
          </Card>
        </Grid>
      </Grid>
      {getAllBeastsLoading ||
      executeBeastsLoading ||
      mintBeastPending ||
      initialMintBeastLoading ||
      revealBeastLoading ||
      listingLoading ? (
        <LoadingBloodstone loadingPage="beasts" />
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <BeastCapacityFilter showSmall={false} />
          </Box>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {capacityFilterVal
              .slice(
                pageSize.valueOf() * (currentPage.valueOf() - 1),
                pageSize.valueOf() * currentPage.valueOf()
              )
              .map((beast: I_Beast, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <BeastCard beast={beast} isActionBtns={true} />
                </Grid>
              ))}
          </Grid>
          {capacityFilterVal.length > 0 ? (
            <Box>
              <ItemPagination totalCount={capacityFilterVal.length} />
            </Box>
          ) : (
            <Card sx={{ p: 4 }}>
              <Typography variant="h6">
                {beastFilterCapacity === 0 ? (
                  <LanguageTranslate translateKey="nobeasts" />
                ) : (
                  <LanguageTranslate translateKey="nobeastswithcapacity" />
                )}
              </Typography>
            </Card>
          )}
        </Box>
      )}
      <SummonBeastPopover />
      <RevealBeastModal />
      <ListOnMarketplaceModal />
    </Box>
  );
};

export default Beasts;
