import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import BeastMarketCard from "../../../components/Cards/BeastMarket.card";
import BeastCapacityFilter from "../../../components/Filters/BeastCapacity.filter";
import MarketplacePriceSort from "../../../components/Filters/MarketplacePrice.sort";
import ShowOnlyMineFilter from "../../../components/Filters/ShowOnlyMine.filter";
import ShowOnlyNewFilter from "../../../components/Filters/ShowOnlyNew.filter";
import UpdatePriceModal from "../../../components/Modals/UpdatePrice.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { getAllBeastMarketItemsAct } from "../../../helpers/marketplace";
import { I_Beast_Market } from "../../../interfaces";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import { getMarketplaceAddress } from "../../../web3hooks/getAddress";
import {
  useBeast,
  useMarketplace,
  useMarketplaceEvent,
  useWeb3,
} from "../../../web3hooks/useContract";

const BeastsMarketplace: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    language,
    getAllBeastsMarketItemsLoading,
    allBeastsMarketItems,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
    currentPage,
    pageSize,
    beastFilterCapacity,
    sortPrice,
    showOnlyMine,
    showOnlyNew,
  } = AppSelector(gameState);

  // Account and Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const beastContract = useBeast();
  const marketplaceContract = useMarketplace();
  const marketplaceEventContract = useMarketplaceEvent();

  // States
  const capacityFilterVal =
    beastFilterCapacity === 0
      ? allBeastsMarketItems.map((beast) => beast)
      : allBeastsMarketItems.filter(
          (beast: I_Beast_Market) => beast.capacity === beastFilterCapacity
        );

  const ShowOnlyMineFilterVal = showOnlyMine
    ? capacityFilterVal.filter(
        (beast: I_Beast_Market) =>
          beast.seller.toLowerCase() === account?.toLowerCase()
      )
    : capacityFilterVal;

  const ShowOnlyNewFilterVal = showOnlyNew
    ? ShowOnlyMineFilterVal.filter((beast: I_Beast_Market) => beast.newItem)
    : ShowOnlyMineFilterVal;

  const sortedVal = ShowOnlyNewFilterVal.sort(
    (a: I_Beast_Market, b: I_Beast_Market) =>
      sortPrice === 0
        ? a.price.valueOf() - b.price.valueOf()
        : b.price.valueOf() - a.price.valueOf()
  );

  // Functions
  const getBalance = async () => {
    getAllBeastMarketItemsAct(
      dispatch,
      web3,
      beastContract,
      marketplaceContract
    );
  };

  // Use Effect
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              <LanguageTranslate translateKey="beasts" />{" "}
              <LanguageTranslate translateKey="marketplace" />
            </Typography>
          </Card>
        </Grid>
      </Grid>
      {getAllBeastsMarketItemsLoading.valueOf() ||
      buyItemLoading.valueOf() ||
      updatePriceLoading.valueOf() ||
      cancelItemLoading.valueOf() ? (
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
