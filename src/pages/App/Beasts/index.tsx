import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Swal from "sweetalert2";

import { AppSelector } from "../../../store";
import { useBeast } from "../../../web3hooks/useContract";
import FireBtn from "../../../components/Buttons/FireBtn";
import BeastCard from "../../../components/Cards/Beast.card";
import ListOnMarketplaceModal from "../../../components/Modals/ListOnMarketplace.modal";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import RevealBeastModal from "../../../components/Modals/RevealBeast.modal";
import SummonBeastPopover from "../../../components/Popover/SummonBeast.popover";

import BeastCapacityFilter from "../../../components/Filters/BeastCapacity.filter";
import ItemPagination from "../../../components/Pagination/Pagination";
import {
  beastState,
  changeAllBeastExecuteStatus,
} from "../../../reducers/beast.reducer";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import { marketplaceState } from "../../../reducers/marketplace.reducer";
import { inventoryState } from "../../../reducers/inventory.reducer";
import BeastService from "../../../services/beast.service";
import {
  commonState,
  updateCommonState,
} from "../../../reducers/common.reduer";
import { formatNumber, getTranslation } from "../../../utils/utils";
import { IBeast } from "../../../types";

const Beasts: React.FC = () => {
  const dispatch = useDispatch();

  const { reloadStatusTime } = AppSelector(commonState);
  const { beastBalance } = AppSelector(inventoryState);
  const {
    mintBeastPending,
    initialMintBeastLoading,
    revealBeastLoading,
    mintBeastVRFPending,
    allBeasts,
    getAllBeastsLoading,
    executeBeastsLoading,
  } = AppSelector(beastState);
  const { currentPage, pageSize, beastFilterCapacity } =
    AppSelector(filterAndPageState);
  const { listingLoading } = AppSelector(marketplaceState);

  const { account } = useWeb3React();

  const beastContract = useBeast();

  const totalCapacity = allBeasts.reduce((a, b) => a + Number(b.capacity), 0);
  const capacityFilterVal =
    beastFilterCapacity === 0
      ? allBeasts
      : allBeasts.filter(
          (beast) => Number(beast.capacity) === Number(beastFilterCapacity)
        );

  const isSelectedAll = capacityFilterVal.reduce(
    (a, b) => a && b.executeStatus,
    true
  );

  useEffect(() => {
    getBalance();
  }, [account, reloadStatusTime]);

  const getBalance = async () => {
    BeastService.getAllBeastsAct(dispatch, account, beastContract);
  };

  const handleSelectExecuteStatus = (status: boolean) => {
    const ids = capacityFilterVal.map((beast: IBeast) => beast.id);
    dispatch(changeAllBeastExecuteStatus({ ids, status }));
  };

  const handleMassExecute = () => {
    const ids = capacityFilterVal
      .filter((item: IBeast) => item.executeStatus === true)
      .map((item: IBeast) => item.id);
    if (
      capacityFilterVal.filter(
        (item: IBeast) => item.executeStatus === true && item.capacity > 2
      ).length > 0
    ) {
      Swal.fire({
        title: getTranslation("warning"),
        text: getTranslation("executeWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f66810",
        cancelButtonColor: "#d33",
        confirmButtonText: getTranslation("massExecute"),
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          BeastService.handleExecuteBeasts(
            dispatch,
            account,
            beastContract,
            ids
          );
        }
      });
    } else {
      BeastService.handleExecuteBeasts(dispatch, account, beastContract, ids);
    }
  };

  const handleSummonBeastPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (mintBeastPending) {
      BeastService.revealBeast(dispatch, account, beastContract);
    } else {
      dispatch(updateCommonState({ summonBeastAnchorEl: event.currentTarget }));
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }} className="bg-c5">
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("beasts")}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {getTranslation("summonBeasts")}
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
                initialMintBeastLoading ||
                revealBeastLoading ||
                mintBeastVRFPending
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
              {mintBeastPending
                ? getTranslation("revealBeasts")
                : getTranslation("summonBeasts")}
            </FireBtn>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {getTranslation("currentBeasts")}
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
                {getTranslation("createLegion")}
              </FireBtn>
            </NavLink>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-c5 info-card">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {getTranslation("warriorCapacity")}
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
                capacityFilterVal.filter(
                  (beast) => beast.executeStatus === true
                ).length === 0 || getAllBeastsLoading.valueOf()
              }
              loading={executeBeastsLoading.valueOf()}
              onClick={() => handleMassExecute()}
            >
              {getTranslation("massExecute")}
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
              .map((beast: IBeast, index: number) => (
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
                {beastFilterCapacity === 0
                  ? getTranslation("nobeasts")
                  : getTranslation("nobeastswithcapacity")}
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
