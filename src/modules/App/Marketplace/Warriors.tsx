import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import BeastMarketCard from "../../../components/Cards/BeastMarket.card";
import WarriorMarketCard from "../../../components/Cards/WarriorMarket.card";
import MarketplacePriceAndAPSort from "../../../components/Filters/MarketplacePriceAndAP.sort";
import ShowOnlyMineFilter from "../../../components/Filters/ShowOnlyMine.filter";
import ShowOnlyNewFilter from "../../../components/Filters/ShowOnlyNew.filter";
import WarriorAPFilter from "../../../components/Filters/WarriorAP.filter";
import WarriorLevelFilter from "../../../components/Filters/WarriorLevel.filter";
import UpdatePriceModal from "../../../components/Modals/UpdatePrice.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { getAllWarriorMarketItemsAct } from "../../../helpers/marketplace";
import { I_Warrior_Market } from "../../../interfaces";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";

const WarriorsMarketplace: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    language,
    getAllWarriorsMarketItemsLoading,
    allWarriorsMarketItems,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
    currentPage,
    pageSize,
    warriorFilterLevel,
    warriorFilterMaxAP,
    warriorFilterMaxConstAP,
    warriorFilterMinAP,
    warriorFilterMinConstAP,
    showOnlyMine,
    showOnlyNew,
    sortAPandPrice,
  } = AppSelector(gameState);

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
          (warrior: I_Warrior_Market) => warrior.strength === warriorFilterLevel
        );
  const APFilterVal = levelFilterVal.filter(
    (warrior: I_Warrior_Market) =>
      warrior.attackPower >= warriorFilterMinAP &&
      (warriorFilterMaxAP === warriorFilterMaxConstAP
        ? true
        : warrior.attackPower <= warriorFilterMaxAP)
  );

  const ShowOnlyMineFilterVal = showOnlyMine
    ? APFilterVal.filter(
        (warrior: I_Warrior_Market) =>
          warrior.seller.toLowerCase() === account?.toLowerCase()
      )
    : APFilterVal;

  const ShowOnlyNewFilterVal = showOnlyNew
    ? ShowOnlyMineFilterVal.filter(
        (warrior: I_Warrior_Market) => warrior.newItem
      )
    : ShowOnlyMineFilterVal;

  const sortedVal = ShowOnlyNewFilterVal.sort(
    (a: I_Warrior_Market, b: I_Warrior_Market) => {
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
    getAllWarriorMarketItemsAct(
      dispatch,
      web3,
      warriorContract,
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
              <LanguageTranslate translateKey="warriors" />{" "}
              <LanguageTranslate translateKey="marketplace" />
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
