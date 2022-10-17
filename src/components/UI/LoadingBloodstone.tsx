import { Card, CardMedia, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { gameState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import LanguageTranslate from "./LanguageTranslate";

type Props = {
  loadingPage: string;
};

const LoadingBloodstone: React.FC<Props> = ({ loadingPage }) => {
  // Hook info
  const {
    language,
    getAllBeastsLoading,
    initialMintBeastLoading,
    mintBeastPending,
    revealBeastLoading,
    executeBeastsLoading,

    getAllWarriorsLoading,
    initialMintWarriorLoading,
    mintWarriorPending,
    revealWarriorLoading,
    executeWarriorsLoading,

    isApprovedBeastForLegion,
    isApprovedWarriorForLegion,

    getAllLegionsLoading,
    executeLegionsLoading,
    buySuppliesLoading,

    getAllMonsterLoading,

    listingLoading,

    getAllBeastsMarketItemsLoading,
    getAllWarriorsMarketItemsLoading,
    getAllLegionsMarketItemsLoading,

    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,

    getAllDulesLoading,
  } = AppSelector(gameState);

  // State
  const [loadingText, setLoadingText] = useState<any>("");

  // Use Effect
  useEffect(() => {
    if (loadingPage === "beasts" || loadingPage === "beastsMarketplace") {
      // Beast
      if (getAllBeastsLoading || getAllBeastsMarketItemsLoading) {
        setLoadingText(<LanguageTranslate translateKey="loadingBeasts" />);
      }
      if (initialMintBeastLoading) {
        setLoadingText(<LanguageTranslate translateKey="summoningBeasts" />);
      }
      if (mintBeastPending) {
        setLoadingText(<LanguageTranslate translateKey="revealTextBeasts" />);
      }
      if (revealBeastLoading) {
        setLoadingText(<LanguageTranslate translateKey="revealingBeasts" />);
      }
    }

    if (loadingPage === "warriors" || loadingPage === "warriorsMarketplace") {
      // Warrior
      if (getAllWarriorsLoading || getAllWarriorsMarketItemsLoading) {
        setLoadingText(<LanguageTranslate translateKey="loadingWarriors" />);
      }
      if (initialMintWarriorLoading) {
        setLoadingText(<LanguageTranslate translateKey="summoningWarriors" />);
      }
      if (mintWarriorPending) {
        setLoadingText(<LanguageTranslate translateKey="revealTextWarriors" />);
      }
      if (revealWarriorLoading) {
        setLoadingText(<LanguageTranslate translateKey="revealingWarriors" />);
      }
    }
    if (
      executeBeastsLoading ||
      executeWarriorsLoading ||
      executeLegionsLoading ||
      listingLoading ||
      buyItemLoading ||
      updatePriceLoading ||
      cancelItemLoading
    ) {
      setLoadingText(<LanguageTranslate translateKey="pleaseWait" />);
    }

    if (loadingPage === "createLegion" || loadingPage === "updateLegion") {
      if (getAllBeastsLoading && getAllWarriorsLoading) {
        setLoadingText(<LanguageTranslate translateKey="loadingTitle" />);
      }
      if (!isApprovedBeastForLegion) {
        setLoadingText(<LanguageTranslate translateKey="approvalAllBeasts" />);
      }
      if (!isApprovedWarriorForLegion) {
        setLoadingText(
          <LanguageTranslate translateKey="approvalAllWarriors" />
        );
      }
      if (!isApprovedBeastForLegion && !isApprovedWarriorForLegion) {
        setLoadingText(
          <LanguageTranslate translateKey="approvalAllBeastsAndWarriors" />
        );
      }
    }

    if (loadingPage === "legions" || loadingPage === "legionsMarketplace") {
      if (getAllLegionsLoading || getAllLegionsMarketItemsLoading) {
        setLoadingText(<LanguageTranslate translateKey="loadingLegions" />);
      }
      if (buySuppliesLoading) {
        setLoadingText(<LanguageTranslate translateKey="buyingSupplies" />);
      }
    }

    if (loadingPage === "hunt") {
      if (getAllMonsterLoading) {
        setLoadingText(<LanguageTranslate translateKey="loadingMonsters" />);
      }
    }

    if (loadingPage == "duel") {
      if (getAllDulesLoading) {
        setLoadingText("Loading Duels...")
      }
    }

    if (loadingPage == "cancelDuel") {
      setLoadingText("Canceling Duel...")
    }
  }, [
    getAllBeastsLoading,
    initialMintBeastLoading,
    mintBeastPending,
    revealBeastLoading,
    executeBeastsLoading,

    getAllWarriorsLoading,
    initialMintWarriorLoading,
    mintWarriorPending,
    revealWarriorLoading,
    executeWarriorsLoading,

    isApprovedBeastForLegion,
    isApprovedWarriorForLegion,

    getAllLegionsLoading,
    buySuppliesLoading,
    executeLegionsLoading,

    getAllMonsterLoading,

    listingLoading,

    getAllBeastsMarketItemsLoading,
    getAllWarriorsMarketItemsLoading,
    getAllLegionsMarketItemsLoading,

    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
  ]);
  return (
    <>
      <Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4">{loadingText}</Typography>
      </Grid>
      <Grid container sx={{ justifyContent: "center" }}>
        <Grid item xs={1}>
          <Card>
            <CardMedia
              component="img"
              image="/assets/images/loading.gif"
              alt="Loading"
              loading="lazy"
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default LoadingBloodstone;
