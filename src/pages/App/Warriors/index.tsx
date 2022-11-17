import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Swal from "sweetalert2";
import { Box, Card, Grid, Typography } from "@mui/material";

import { formatNumber, getTranslation } from "../../../utils/utils";
import { useWarrior } from "../../../web3hooks/useContract";

import { AppSelector } from "../../../store";
import FireBtn from "../../../components/Buttons/FireBtn";
import ListOnMarketplaceModal from "../../../components/Modals/ListOnMarketplace.modal";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import RevealWarriorModal from "../../../components/Modals/RevealWarrior.modal";
import SummonWarriorPopover from "../../../components/Popover/SummonWarrior.popover";
import WarriorAPFilter from "../../../components/Filters/WarriorAP.filter";
import WarriorCard from "../../../components/Cards/Warrior.card";
import WarriorLevelFilter from "../../../components/Filters/WarriorLevel.filter";
import ItemPagination from "../../../components/Pagination/Pagination";
import {
  commonState,
  updateCommonState,
} from "../../../reducers/common.reduer";
import { inventoryState } from "../../../reducers/inventory.reducer";
import {
  changeAllWarriorExecuteStatus,
  warriorState,
} from "../../../reducers/warrior.reducer";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import { marketplaceState } from "../../../reducers/marketplace.reducer";
import { IWarrior } from "../../../types";
import WarriorService from "../../../services/warrior.service";
import constants from "../../../constants";

const Warriors: React.FC = () => {
  const dispatch = useDispatch();
  const { reloadStatusTime } = AppSelector(commonState);
  const { warriorBalance } = AppSelector(inventoryState);
  const {
    allWarriors,
    getAllWarriorsLoading,
    initialMintWarriorLoading,
    mintWarriorPending,
    revealWarriorLoading,
    mintWarriorVRFPending,
    executeWarriorsLoading,
  } = AppSelector(warriorState);
  const {
    currentPage,
    pageSize,
    warriorFilterLevel,
    warriorFilterMinAP,
    warriorFilterMaxAP,
    warriorFilterMinConstAP,
    warriorFilterMaxConstAP,
  } = AppSelector(filterAndPageState);
  const { listingLoading } = AppSelector(marketplaceState);

  // Account
  const { account } = useWeb3React();

  // Contracts
  const warriorContract = useWarrior();

  const totalAttackPower = allWarriors.reduce(
    (a, b) => a + Number(b.attackPower),
    0
  );
  const levelFilterVal =
    warriorFilterLevel === 0
      ? allWarriors
      : allWarriors.filter(
          (warrior: IWarrior) => warrior.strength === warriorFilterLevel
        );
  const APFilterVal = levelFilterVal.filter(
    (warrior: IWarrior) =>
      warrior.attackPower >= warriorFilterMinAP &&
      (warriorFilterMaxAP === warriorFilterMaxConstAP
        ? true
        : warrior.attackPower <= warriorFilterMaxAP)
  );

  const isSelectedAll = APFilterVal.reduce(
    (a, b) => a && b.executeStatus,
    true
  );

  // Use Effect
  useEffect(() => {
    getBalance();
  }, [account, reloadStatusTime]);

  // Functions
  const getBalance = async () => {
    WarriorService.getAllWarriorsAct(dispatch, account, warriorContract);
  };

  const handleSelectExecuteStatus = (status: boolean) => {
    const ids = APFilterVal.map((warrior: IWarrior) => warrior.id);
    dispatch(changeAllWarriorExecuteStatus({ status, ids }));
  };

  const handleMassExecute = () => {
    const ids = APFilterVal.filter(
      (item: IWarrior) => item.executeStatus === true
    ).map((item: IWarrior) => item.id);

    if (
      APFilterVal.filter(
        (item: IWarrior) => item.executeStatus === true && item.strength > 2
      ).length > 0
    ) {
      Swal.fire({
        title: getTranslation("warning"),
        text: getTranslation("executeWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: constants.color.color2,
        cancelButtonColor: "#d33",
        confirmButtonText: getTranslation("massExecute"),
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          WarriorService.handleExecuteWarriors(
            dispatch,
            account,
            warriorContract,
            ids
          );
        }
      });
    } else {
      WarriorService.handleExecuteWarriors(
        dispatch,
        account,
        warriorContract,
        ids
      );
    }
  };

  const handleSummonWarriorPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (mintWarriorPending) {
      WarriorService.revealWarrior(dispatch, account, warriorContract);
    } else {
      dispatch(
        updateCommonState({ summonWarriorAnchorEl: event.currentTarget })
      );
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }} className="bg-c5">
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("warriors")}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {getTranslation("summonWarriors")}
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
              {mintWarriorPending
                ? getTranslation("revealWarriors")
                : getTranslation("summonWarriors")}
            </FireBtn>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {getTranslation("currentWarriors")}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
              className="fc2"
            >
              {warriorBalance}
            </Typography>
            <NavLink to="/createcybers" className="td-none">
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
                {getTranslation("createLegion")}
              </FireBtn>
            </NavLink>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {getTranslation("totalAttackPower")}
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
              {isSelectedAll
                ? getTranslation("deSelectAll")
                : getTranslation("selectAll")}
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
              {getTranslation("massExecute")}
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
            ).map((warrior: IWarrior, index: number) => (
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
                warriorFilterMaxAP === warriorFilterMaxConstAP
                  ? getTranslation("nowarriors")
                  : getTranslation("nowarriorswithlevelandap")}
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
