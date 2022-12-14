import React, { useEffect } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

import FireBtn from "../../../components/Buttons/FireBtn";
import LegionCard from "../../../components/Cards/Legion.card";
import HideWeakLegionsFilter from "../../../components/Filters/HideWeakLegions.filter";
import HuntStatusFilter from "../../../components/Filters/HuntStatus.filter";
import LegionAPFilter from "../../../components/Filters/LegionAP.filter";
import LegionAPSort from "../../../components/Filters/LegionAP.sort";
import BuySupppliesModal from "../../../components/Modals/BuySupplies.modal";
import ListOnMarketplaceModal from "../../../components/Modals/ListOnMarketplace.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { AppSelector } from "../../../store";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useLegion,
  useWarrior,
} from "../../../web3hooks/useContract";
import {
  changeAllLegionExecuteStatus,
  legionState,
} from "../../../reducers/legion.reducer";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import { inventoryState } from "../../../reducers/inventory.reducer";
import { marketplaceState } from "../../../reducers/marketplace.reducer";
import { commonState } from "../../../reducers/common.reduer";
import { ILegion } from "../../../types";
import BeastService from "../../../services/beast.service";
import WarriorService from "../../../services/warrior.service";
import LegionService from "../../../services/legion.service";
import constants from "../../../constants";
import { navLinks } from "../../../config/nav.config";
import RedBtn from "../../../components/Buttons/RedBtn";

const Legions: React.FC = () => {
  const dispatch = useDispatch();

  const { reloadStatusTime } = AppSelector(commonState);
  const { legionBalance, beastBalance, warriorBalance } =
    AppSelector(inventoryState);
  const {
    allLegions,
    getAllLegionsLoading,
    buySuppliesLoading,
    executeLegionsLoading,
  } = AppSelector(legionState);
  const {
    legionFilterHuntStatus,
    legionFilterMinAP,
    legionFilterMaxAP,
    legionFilterMaxConstAP,
    sortAP,
    hideWeakLegion,
    currentPage,
    pageSize,
  } = AppSelector(filterAndPageState);
  const { listingLoading } = AppSelector(marketplaceState);

  // Account & Web3
  const { account } = useWeb3React();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();

  // State
  const totalAP = allLegions.reduce((a, b) => a + b.attackPower.valueOf(), 0);

  let HuntStatusFilterVal: any[] = [];
  if (legionFilterHuntStatus === 0) {
    HuntStatusFilterVal = allLegions;
  } else if (legionFilterHuntStatus === 1) {
    HuntStatusFilterVal = allLegions.filter(
      (legion: ILegion) => legion.huntStatus
    );
  } else if (legionFilterHuntStatus === 2) {
    HuntStatusFilterVal = allLegions.filter(
      (legion: ILegion) => !legion.huntStatus && legion.supplies > 0
    );
  } else if (legionFilterHuntStatus === 3) {
    HuntStatusFilterVal = allLegions.filter(
      (legion: ILegion) => legion.supplies === 0
    );
  }

  const APFilterVal = HuntStatusFilterVal.filter(
    (legion) =>
      legion.attackPower >= legionFilterMinAP &&
      (legionFilterMaxAP === legionFilterMaxConstAP
        ? true
        : legion.attackPower <= legionFilterMaxAP)
  );

  const weakLegionFilterVal = hideWeakLegion
    ? APFilterVal.filter(
        (legion: ILegion) => legion.attackPower.valueOf() >= 2000
      )
    : APFilterVal;

  const top3 = weakLegionFilterVal
    .sort((a, b) => Number(b.attackPower) - Number(a.attackPower))
    .slice(0, 3);

  const sortedVal = weakLegionFilterVal.sort((a: ILegion, b: ILegion) => {
    if (sortAP === 0) {
      return a.attackPower.valueOf() - b.attackPower.valueOf();
    } else {
      return b.attackPower.valueOf() - a.attackPower.valueOf();
    }
  });

  const isSelectedAll = sortedVal.reduce((a, b) => a && b.executeStatus, true);

  // Use Effect
  useEffect(() => {
    getBalance();
  }, [account, reloadStatusTime]);
  // Functions
  const getBalance = async () => {
    BeastService.getAllBeastsAct(dispatch, account, beastContract);
    WarriorService.getAllWarriorsAct(dispatch, account, warriorContract);
    LegionService.getAllLegionsAct(dispatch, account, legionContract);
  };

  const handleSelectExecuteStatus = (status: boolean) => {
    const ids = sortedVal.map((item: ILegion) => item.id);
    dispatch(changeAllLegionExecuteStatus({ status, ids }));
  };

  const handleMassExecute = () => {
    const ids = sortedVal
      .filter((item: ILegion) => item.executeStatus === true)
      .map((item: ILegion) => item.id);
    if (
      sortedVal.filter(
        (item: ILegion) =>
          item.executeStatus === true && item.attackPower > 2000
      ).length > 0
    ) {
      Swal.fire({
        title: getTranslation("warning"),
        text: getTranslation("executeLegionWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: constants.color.color2,
        cancelButtonColor: "#d33",
        confirmButtonText: getTranslation("massExecute"),
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          LegionService.handleExecuteLegions(
            dispatch,
            account,
            legionContract,
            ids
          );
        }
      });
    } else {
      LegionService.handleExecuteLegions(
        dispatch,
        account,
        legionContract,
        ids
      );
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }} className="bg-c5">
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("legions")}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <NavLink to={navLinks.createlegion} className="td-none">
              <FireBtn
                sx={{
                  mb: 2,
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
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {getTranslation("availableWarrior")}
              <span style={{ marginLeft: 8 }} className="fc3">
                {warriorBalance}
              </span>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {getTranslation("availableBeast")}
              <span style={{ marginLeft: 8 }} className="fc3">
                {beastBalance}
              </span>
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {getTranslation("currentLegion")}
            </Typography>
            <Typography
              variant="h4"
              className="fc3"
              sx={{ fontWeight: "bold" }}
            >
              {legionBalance}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {getTranslation("totalAp")}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {formatNumber(totalAP)}
            </Typography>
            <NavLink to={navLinks.hunt} className="td-none">
              <FireBtn
                sx={{
                  mb: 2,
                  wordBreak: "break-word",
                  px: 2,
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
                {getTranslation("hunt")}
              </FireBtn>
            </NavLink>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {getTranslation("top3Legions")}
            </Typography>
            {top3.map((item, index) => (
              <Typography variant="subtitle1" key={index}>
                {item.name}&nbsp;&nbsp;&nbsp;
                <span
                  style={{
                    color:
                      item.supplies == 0
                        ? "red"
                        : item.huntStatus
                        ? "green"
                        : "orange",
                  }}
                >
                  {formatNumber(item.attackPower)} AP
                </span>
              </Typography>
            ))}
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
            <RedBtn
              sx={{
                mb: 1,
                wordBreak: "break-word",
                px: 2,
              }}
              disabled={
                sortedVal.filter((legion) => legion.executeStatus === true)
                  .length === 0 || getAllLegionsLoading.valueOf()
              }
              loading={executeLegionsLoading.valueOf()}
              onClick={() => handleMassExecute()}
            >
              {getTranslation("massExecute")}
            </RedBtn>
          </Card>
        </Grid>
      </Grid>
      {getAllLegionsLoading ||
      buySuppliesLoading ||
      listingLoading ||
      executeLegionsLoading ? (
        <LoadingBloodstone loadingPage="legions" />
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={3}>
                <LegionAPFilter />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <LegionAPSort />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <HuntStatusFilter />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <HideWeakLegionsFilter />
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {sortedVal
              .slice(
                pageSize.valueOf() * (currentPage.valueOf() - 1),
                pageSize.valueOf() * currentPage.valueOf()
              )
              .map((legion: ILegion, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <LegionCard legion={legion} index={index} />
                </Grid>
              ))}
          </Grid>
          {sortedVal.length > 0 && (
            <Box>
              <ItemPagination totalCount={sortedVal.length} />
            </Box>
          )}
        </Box>
      )}
      <BuySupppliesModal />
      <ListOnMarketplaceModal />
    </Box>
  );
};

export default Legions;
