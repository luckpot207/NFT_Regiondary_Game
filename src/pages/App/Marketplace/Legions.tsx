import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import LegionMarketCard from "../../../components/Cards/LegionMarket.card";
import LegionAPFilter from "../../../components/Filters/LegionAP.filter";
import LegionSuppliesFilter from "../../../components/Filters/LegionSupplies.filter";
import MarketplacePriceAndAPSort from "../../../components/Filters/MarketplacePriceAndAP.sort";
import ShowOnlyMineFilter from "../../../components/Filters/ShowOnlyMine.filter";
import ShowOnlyNewFilter from "../../../components/Filters/ShowOnlyNew.filter";
import UpdatePriceModal from "../../../components/Modals/UpdatePrice.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useLegion,
  useMarketplace,
  useWeb3,
} from "../../../web3hooks/useContract";
import { marketplaceState } from "../../../reducers/marketplace.reducer";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import { ILegionMarket } from "../../../types";
import MarketplaceService from "../../../services/marketplace.service";

const LegionsMarketplace: React.FC = () => {
  const dispatch = useDispatch();
  const {
    getAllLegionsMarketItemsLoading,
    allLegionsMarketItems,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
  } = AppSelector(marketplaceState);
  const {
    currentPage,
    pageSize,
    legionFilterMinAP,
    legionFilterMaxAP,
    legionFilterMaxConstAP,
    legionFilterMinSupplies,
    legionFilterMaxSupplies,
    legionFilterMaxConstSupplies,
    showOnlyMine,
    showOnlyNew,
    sortAPandPrice,
  } = AppSelector(filterAndPageState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const legionContract = useLegion();
  const marketplaceContract = useMarketplace();

  const APFilterVal = allLegionsMarketItems.filter(
    (legion: ILegionMarket) =>
      legion.attackPower >= legionFilterMinAP &&
      (legionFilterMaxAP === legionFilterMaxConstAP
        ? true
        : legion.attackPower <= legionFilterMaxAP)
  );

  const SuppliesFilterVal = APFilterVal.filter(
    (legion: ILegionMarket) =>
      legion.supplies >= legionFilterMinSupplies &&
      (legionFilterMaxSupplies === legionFilterMaxConstSupplies
        ? true
        : legion.supplies <= legionFilterMaxSupplies)
  );

  const ShowOnlyMineFilterVal = showOnlyMine
    ? SuppliesFilterVal.filter(
        (legion: ILegionMarket) =>
          legion.seller.toLowerCase() === account?.toLowerCase()
      )
    : SuppliesFilterVal;

  const ShowOnlyNewFilterVal = showOnlyNew
    ? ShowOnlyMineFilterVal.filter((legion: ILegionMarket) => legion.newItem)
    : ShowOnlyMineFilterVal;

  const sortedVal = ShowOnlyNewFilterVal.sort(
    (a: ILegionMarket, b: ILegionMarket) => {
      if (sortAPandPrice === 0) {
        return a.price.valueOf() - b.price.valueOf();
      } else if (sortAPandPrice === 1) {
        return b.price.valueOf() - a.price.valueOf();
      } else if (sortAPandPrice === 2) {
        return a.attackPower.valueOf() - b.attackPower.valueOf();
      } else {
        return b.attackPower.valueOf() - a.attackPower.valueOf();
      }
    }
  );

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    MarketplaceService.getAllLegionsMarketItemsAct(
      dispatch,
      web3,
      account,
      legionContract,
      marketplaceContract
    );
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("legions")} {getTranslation("marketplace")}{" "}
              (Coming Soon)
            </Typography>
          </Card>
        </Grid>
      </Grid>
      {getAllLegionsMarketItemsLoading ||
      buyItemLoading ||
      updatePriceLoading ||
      cancelItemLoading ? (
        <LoadingBloodstone loadingPage="legionsMarketplace" />
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={3}>
                <LegionAPFilter />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MarketplacePriceAndAPSort />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <LegionSuppliesFilter />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ShowOnlyNewFilter />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ShowOnlyMineFilter />
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {sortedVal
              .slice(
                pageSize.valueOf() * (currentPage.valueOf() - 1),
                pageSize.valueOf() * currentPage.valueOf()
              )
              .map((legion, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <LegionMarketCard legion={legion} />
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
      <UpdatePriceModal />
    </Box>
  );
};

export default LegionsMarketplace;
