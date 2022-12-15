import React, { useEffect } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";

import BeastMarketCard from "../../../components/Cards/BeastMarket.card";
import BeastCapacityFilter from "../../../components/Filters/BeastCapacity.filter";
import MarketplacePriceSort from "../../../components/Filters/MarketplacePrice.sort";
import ShowOnlyMineFilter from "../../../components/Filters/ShowOnlyMine.filter";
import ShowOnlyNewFilter from "../../../components/Filters/ShowOnlyNew.filter";
import UpdatePriceModal from "../../../components/Modals/UpdatePrice.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import { marketplaceState } from "../../../reducers/marketplace.reducer";
import MarketplaceService from "../../../services/marketplace.service";
import { AppSelector } from "../../../store";
import { IBeastMarket } from "../../../types";
import { getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useMarketplace,
  useWeb3,
} from "../../../web3hooks/useContract";

const BeastsMarketplace: React.FC = () => {
  const dispatch = useDispatch();

  const {
    allBeastsMarketItems,
    getAllBeastsMarketItemsLoading,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
  } = AppSelector(marketplaceState);
  const {
    currentPage,
    pageSize,
    beastFilterCapacity,
    sortPrice,
    showOnlyMine,
    showOnlyNew,
  } = AppSelector(filterAndPageState);

  console.log("beast filter capacity: ", beastFilterCapacity);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const beastContract = useBeast();
  const marketplaceContract = useMarketplace();

  console.log("all beasts marketplace items: ", allBeastsMarketItems);

  const capacityFilterVal =
    beastFilterCapacity === 0
      ? allBeastsMarketItems.map((beast) => beast)
      : allBeastsMarketItems.filter(
          (beast: IBeastMarket) =>
            Number(beast.capacity) === Number(beastFilterCapacity)
        );

  const ShowOnlyMineFilterVal = showOnlyMine
    ? capacityFilterVal.filter(
        (beast: IBeastMarket) =>
          beast.seller.toLowerCase() === account?.toLowerCase()
      )
    : capacityFilterVal;

  const ShowOnlyNewFilterVal = showOnlyNew
    ? ShowOnlyMineFilterVal.filter((beast: IBeastMarket) => beast.newItem)
    : ShowOnlyMineFilterVal;

  const sortedVal = ShowOnlyNewFilterVal.sort(
    (a: IBeastMarket, b: IBeastMarket) =>
      sortPrice === 0
        ? a.price.valueOf() - b.price.valueOf()
        : b.price.valueOf() - a.price.valueOf()
  );

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    MarketplaceService.getAllBeastMarketItemsAct(
      dispatch,
      web3,
      beastContract,
      marketplaceContract
    );
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("beasts")} {getTranslation("marketplace")}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      {getAllBeastsMarketItemsLoading ||
      buyItemLoading ||
      updatePriceLoading ||
      cancelItemLoading ? (
        <LoadingBloodstone loadingPage="beastsMarketplace" />
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={3}>
                <BeastCapacityFilter showSmall={false} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MarketplacePriceSort />
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
              .map((beast, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <BeastMarketCard beast={beast} />
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

export default BeastsMarketplace;
