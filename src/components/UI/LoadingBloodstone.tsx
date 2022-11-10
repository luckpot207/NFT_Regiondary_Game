import React, { useEffect, useState } from "react";
import { Card, CardMedia, Grid, Typography } from "@mui/material";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { beastState } from "../../reducers/beast.reducer";
import { warriorState } from "../../reducers/warrior.reducer";
import { legionState } from "../../reducers/legion.reducer";
import { marketplaceState } from "../../reducers/marketplace.reducer";
import { monsterState } from "../../reducers/monster.reducer";

type Props = {
  loadingPage: string;
};

const LoadingBloodstone: React.FC<Props> = ({ loadingPage }) => {
  const {
    getAllBeastsLoading,
    initialMintBeastLoading,
    mintBeastPending,
    revealBeastLoading,
    executeBeastsLoading,
  } = AppSelector(beastState);
  const {
    getAllWarriorsLoading,
    initialMintWarriorLoading,
    mintWarriorPending,
    revealWarriorLoading,
    executeWarriorsLoading,
  } = AppSelector(warriorState);
  const {
    isApprovedBeastForLegion,
    isApprovedWarriorForLegion,
    getAllLegionsLoading,
    executeLegionsLoading,
    buySuppliesLoading,
  } = AppSelector(legionState);
  const { getAllMonsterLoading } = AppSelector(monsterState);
  const {
    listingLoading,
    getAllBeastsMarketItemsLoading,
    getAllWarriorsMarketItemsLoading,
    getAllLegionsMarketItemsLoading,
    buyItemLoading,
    updatePriceLoading,
    cancelItemLoading,
  } = AppSelector(marketplaceState);

  // State
  const [loadingText, setLoadingText] = useState<any>("");

  // Use Effect
  useEffect(() => {
    if (loadingPage === "beasts" || loadingPage === "beastsMarketplace") {
      // Beast
      if (getAllBeastsLoading || getAllBeastsMarketItemsLoading) {
        setLoadingText(getTranslation("loadingBeasts"));
      }
      if (initialMintBeastLoading) {
        setLoadingText(getTranslation("summoningBeasts"));
      }
      if (mintBeastPending) {
        setLoadingText(getTranslation("revealTextBeasts"));
      }
      if (revealBeastLoading) {
        setLoadingText(getTranslation("revealingBeasts"));
      }
    }

    if (loadingPage === "warriors" || loadingPage === "warriorsMarketplace") {
      // Warrior
      if (getAllWarriorsLoading || getAllWarriorsMarketItemsLoading) {
        setLoadingText(getTranslation("loadingWarriors"));
      }
      if (initialMintWarriorLoading) {
        setLoadingText(getTranslation("summoningWarriors"));
      }
      if (mintWarriorPending) {
        setLoadingText(getTranslation("revealTextWarriors"));
      }
      if (revealWarriorLoading) {
        setLoadingText(getTranslation("revealingWarriors"));
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
      setLoadingText(getTranslation("pleaseWait"));
    }

    if (loadingPage === "createLegion" || loadingPage === "updateLegion") {
      if (getAllBeastsLoading && getAllWarriorsLoading) {
        setLoadingText(getTranslation("loadingTitle"));
      }
      if (!isApprovedBeastForLegion) {
        setLoadingText(getTranslation("approvalAllBeasts"));
      }
      if (!isApprovedWarriorForLegion) {
        setLoadingText(getTranslation("approvalAllWarriors"));
      }
      if (!isApprovedBeastForLegion && !isApprovedWarriorForLegion) {
        setLoadingText(getTranslation("approvalAllBeastsAndWarriors"));
      }
    }

    if (loadingPage === "legions" || loadingPage === "legionsMarketplace") {
      if (getAllLegionsLoading || getAllLegionsMarketItemsLoading) {
        setLoadingText(getTranslation("loadingLegions"));
      }
      if (buySuppliesLoading) {
        setLoadingText(getTranslation("buyingSupplies"));
      }
    }

    if (loadingPage === "hunt") {
      if (getAllMonsterLoading) {
        setLoadingText(getTranslation("loadingMonsters"));
      }
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
          <div
            dangerouslySetInnerHTML={{
              __html: `
                  <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                    <source src=${`/assets/images/loading.mp4`} type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
              `,
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LoadingBloodstone;
