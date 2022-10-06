import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import BeastMarketCard from "../../../components/Cards/BeastMarket.card";
import LegionMarketCard from "../../../components/Cards/LegionMarket.card";
import LegionAPFilter from "../../../components/Filters/LegionAP.filter";
import LegionSuppliesFilter from "../../../components/Filters/LegionSupplies.filter";
import MarketplacePriceAndAPSort from "../../../components/Filters/MarketplacePriceAndAP.sort";
import ShowOnlyMineFilter from "../../../components/Filters/ShowOnlyMine.filter";
import ShowOnlyNewFilter from "../../../components/Filters/ShowOnlyNew.filter";
import UpdatePriceModal from "../../../components/Modals/UpdatePrice.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { getAllLegionsMarketItemsAct } from "../../../helpers/marketplace";
import { I_Legion_Market } from "../../../interfaces";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useLegion,
  useMarketplace,
  useWeb3,
} from "../../../web3hooks/useContract";

const LegionsMarketplace: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    language,
    getAllLegionsMarketItemsLoading,
    allLegionsMarketItems,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
    currentPage,
    pageSize,

    legionFilterMinAP,
    legionFilterMinConstAP,
    legionFilterMaxAP,
    legionFilterMaxConstAP,
    legionFilterMinSupplies,
    legionFilterMinConstSupplies,
    legionFilterMaxSupplies,
    legionFilterMaxConstSupplies,
    showOnlyMine,
    showOnlyNew,
    sortAPandPrice,
  } = AppSelector(gameState);
  // Account and Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const legionContract = useLegion();
  const marketplaceContract = useMarketplace();

  // States

  const APFilterVal = allLegionsMarketItems.filter(
    (legion: I_Legion_Market) =>
      legion.attackPower >= legionFilterMinAP &&
      (legionFilterMaxAP === legionFilterMaxConstAP
        ? true
        : legion.attackPower <= legionFilterMaxAP)
  );

  const SuppliesFilterVal = APFilterVal.filter(
    (legion: I_Legion_Market) =>
      legion.supplies >= legionFilterMinSupplies &&
      (legionFilterMaxSupplies === legionFilterMaxConstSupplies
        ? true
        : legion.supplies <= legionFilterMaxSupplies)
  );

  const ShowOnlyMineFilterVal = showOnlyMine
    ? SuppliesFilterVal.filter(
        (legion: I_Legion_Market) =>
          legion.seller.toLowerCase() === account?.toLowerCase()
      )
    : SuppliesFilterVal;

  const ShowOnlyNewFilterVal = showOnlyNew
    ? ShowOnlyMineFilterVal.filter((legion: I_Legion_Market) => legion.newItem)
    : ShowOnlyMineFilterVal;

  const sortedVal = ShowOnlyNewFilterVal.sort(
    (a: I_Legion_Market, b: I_Legion_Market) => {
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

  // Functions
  const getBalance = async () => {
    getAllLegionsMarketItemsAct(
      dispatch,
      web3,
      legionContract,
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
              <LanguageTranslate translateKey="legions" />{" "}
              <LanguageTranslate translateKey="marketplace" />
            </Typography>
          </Card>
        </Grid>
      </Grid>
      {getAllLegionsMarketItemsLoading.valueOf() ||
      buyItemLoading.valueOf() ||
      updatePriceLoading.valueOf() ||
      cancelItemLoading.valueOf() ? (
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
