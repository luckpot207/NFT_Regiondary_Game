import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import WarriorMarketCard from "../../../components/Cards/WarriorMarket.card";
import MarketplacePriceAndAPSort from "../../../components/Filters/MarketplacePriceAndAP.sort";
import ShowOnlyMineFilter from "../../../components/Filters/ShowOnlyMine.filter";
import ShowOnlyNewFilter from "../../../components/Filters/ShowOnlyNew.filter";
import WarriorAPFilter from "../../../components/Filters/WarriorAP.filter";
import WarriorLevelFilter from "../../../components/Filters/WarriorLevel.filter";
import UpdatePriceModal from "../../../components/Modals/UpdatePrice.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import { marketplaceState } from "../../../reducers/marketplace.reducer";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import { IWarriorMarket } from "../../../types";
import MarketplaceService from "../../../services/marketplace.service";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";

const WarriorsMarketplace: React.FC = () => {
  const dispatch = useDispatch();
  const {
    getAllWarriorsMarketItemsLoading,
    allWarriorsMarketItems,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
  } = AppSelector(marketplaceState);
  const {
    currentPage,
    pageSize,
    warriorFilterLevel,
    warriorFilterMaxAP,
    warriorFilterMaxConstAP,
    warriorFilterMinAP,
    showOnlyMine,
    showOnlyNew,
    sortAPandPrice,
  } = AppSelector(filterAndPageState);

  // Account and Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const warriorContract = useWarrior();
  const marketplaceContract = useMarketplace();

  // States

  const levelFilterVal =
    warriorFilterLevel === 0
      ? allWarriorsMarketItems
      : allWarriorsMarketItems.filter(
          (warrior: IWarriorMarket) => warrior.strength === warriorFilterLevel
        );
  const APFilterVal = levelFilterVal.filter(
    (warrior: IWarriorMarket) =>
      warrior.attackPower >= warriorFilterMinAP &&
      (warriorFilterMaxAP === warriorFilterMaxConstAP
        ? true
        : warrior.attackPower <= warriorFilterMaxAP)
  );

  const ShowOnlyMineFilterVal = showOnlyMine
    ? APFilterVal.filter(
        (warrior: IWarriorMarket) =>
          warrior.seller.toLowerCase() === account?.toLowerCase()
      )
    : APFilterVal;

  const ShowOnlyNewFilterVal = showOnlyNew
    ? ShowOnlyMineFilterVal.filter((warrior: IWarriorMarket) => warrior.newItem)
    : ShowOnlyMineFilterVal;

  const sortedVal = ShowOnlyNewFilterVal.sort(
    (a: IWarriorMarket, b: IWarriorMarket) => {
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
    MarketplaceService.getAllWarriorMarketItemsAct(
      dispatch,
      web3,
      warriorContract,
      marketplaceContract
    );
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("warriors")} {getTranslation("marketplace")}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      {getAllWarriorsMarketItemsLoading.valueOf() ||
      buyItemLoading.valueOf() ||
      updatePriceLoading.valueOf() ||
      cancelItemLoading.valueOf() ? (
        <LoadingBloodstone loadingPage="warriorsMarketplace" />
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={3}>
                <WarriorLevelFilter showSmall={false} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <WarriorAPFilter />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MarketplacePriceAndAPSort />
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
              .map((warrior, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <WarriorMarketCard warrior={warrior} />
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

export default WarriorsMarketplace;
