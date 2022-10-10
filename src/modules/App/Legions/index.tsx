import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
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
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { getAllBeastsAct } from "../../../helpers/beast";
import {
  getAllLegionsAct,
  handleExecuteLegions,
} from "../../../helpers/legion";
import { getAllWarriorsAct } from "../../../helpers/warrior";
import { I_Legion } from "../../../interfaces";
import {
  changeAllLegionExecuteStatus,
  gameState,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useBloodstone,
  useLegion,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";

const Legions: React.FC = () => {
  // Hook Infos
  const dispatch = useDispatch();
  const {
    language,
    allLegions,
    legionBalance,
    beastBalance,
    warriorBalance,
    getAllLegionsLoading,
    buySuppliesLoading,
    listingLoading,
    executeLegionsLoading,
    legionFilterHuntStatus,
    legionFilterMinAP,
    legionFilterMinConstAP,
    legionFilterMaxAP,
    legionFilterMaxConstAP,
    sortAP,
    hideWeakLegion,
    currentPage,
    pageSize,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();
  console.log(allLegions);
  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const bloodstoneContract = useBloodstone();

  // State
  const warningText = LanguageTranslate({ translateKey: "warning" });
  const massExecuteText = LanguageTranslate({ translateKey: "massExecute" });
  const executeWarningText = LanguageTranslate({
    translateKey: "executeLegionWarning",
  });

  const totalAP = allLegions.reduce((a, b) => a + b.attackPower.valueOf(), 0);

  let HuntStatusFilterVal: any[] = [];
  if (legionFilterHuntStatus === 0) {
    HuntStatusFilterVal = allLegions;
  } else if (legionFilterHuntStatus === 1) {
    HuntStatusFilterVal = allLegions.filter(
      (legion: I_Legion) => legion.huntStatus
    );
  } else if (legionFilterHuntStatus === 2) {
    HuntStatusFilterVal = allLegions.filter(
      (legion: I_Legion) => !legion.huntStatus && legion.supplies > 0
    );
  } else if (legionFilterHuntStatus === 3) {
    HuntStatusFilterVal = allLegions.filter(
      (legion: I_Legion) => legion.supplies === 0
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
        (legion: I_Legion) => legion.attackPower.valueOf() >= 2000
      )
    : APFilterVal;

  const sortedVal = weakLegionFilterVal.sort((a: I_Legion, b: I_Legion) =>
    sortAP === 0
      ? a.attackPower.valueOf() - b.attackPower.valueOf()
      : b.attackPower.valueOf() - a.attackPower.valueOf()
  );

  const isSelectedAll = sortedVal.reduce((a, b) => a && b.executeStatus, true);

  const top3 = sortedVal
    .sort((a, b) => Number(b.attackPower) - Number(a.attackPower))
    .slice(0, 3);

  // Functions
  const getBalance = async () => {
    getAllBeastsAct(dispatch, account, beastContract);
    getAllWarriorsAct(dispatch, account, warriorContract);
    getAllLegionsAct(dispatch, account, legionContract);
  };

  const handleSelectExecuteStatus = (status: boolean) => {
    const ids = sortedVal.map((item: I_Legion) => item.id);
    dispatch(changeAllLegionExecuteStatus({ status, ids }));
  };

  const handleMassExecute = () => {
    const ids = sortedVal
      .filter((item: I_Legion) => item.executeStatus === true)
      .map((item: I_Legion) => item.id);
    if (
      sortedVal.filter(
        (item: I_Legion) =>
          item.executeStatus === true && item.attackPower > 2000
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
          handleExecuteLegions(dispatch, account, legionContract, ids);
        }
      });
    } else {
      handleExecuteLegions(dispatch, account, legionContract, ids);
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
              <LanguageTranslate translateKey="legions" />
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <NavLink to="/createlegions" className="td-none">
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
                <LanguageTranslate translateKey="createLegion" />
              </FireBtn>
            </NavLink>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <LanguageTranslate translateKey="availableWarrior" />
              <span style={{ marginLeft: 8 }} className="fc3">
                {warriorBalance}
              </span>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <LanguageTranslate translateKey="availableBeast" />
              <span style={{ marginLeft: 8 }} className="fc3">
                {beastBalance}
              </span>
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <LanguageTranslate translateKey="currentLegion" />
            </Typography>
            <Typography
              variant="h4"
              className="fc3"
              sx={{ fontWeight: "bold" }}
            >
              {legionBalance}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <LanguageTranslate translateKey="totalAp" />
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {formatNumber(totalAP)}
            </Typography>
            <NavLink to="/hunt" className="td-none">
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
                <LanguageTranslate translateKey="hunt" />
              </FireBtn>
            </NavLink>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <LanguageTranslate translateKey="top3Legions" />
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
                        : "#e89f38",
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
                sortedVal.filter((legion) => legion.executeStatus === true)
                  .length === 0 || getAllLegionsLoading.valueOf()
              }
              loading={executeLegionsLoading.valueOf()}
              onClick={() => handleMassExecute()}
            >
              <LanguageTranslate translateKey="massExecute" />
            </FireBtn>
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
              .map((legion: I_Legion, index: number) => (
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
