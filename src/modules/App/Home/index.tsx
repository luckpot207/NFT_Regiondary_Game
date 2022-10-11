import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import VideoPlayer from "../../../components/UI/VideoPlayer";
import Constants from "../../../constants";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import EconomyStatus from "./EconomyStatus";
import Leaderboard from "./Leaderboard";
import NadodoWatch from "./Nadodo";
import QuotesPart from "./Quotes";
import Referrals from "./Referrals";
import SamaritanStars from "./SamaritanStars";
import TakeAction from "./TakeAction";
import ToSocial from "./ToSocial";
import YourInventory from "./YourInventory";

const Home: React.FC = () => {
  // Hook
  const { language } = AppSelector(gameState);

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12} md={4}>
          <YourInventory />
        </Grid>
        <Grid item xs={12} md={4}>
          <TakeAction />
        </Grid>
        <Grid item xs={12} md={4}>
          <NadodoWatch />
        </Grid>
        <Grid item xs={12} md={4}>
          <SamaritanStars />
        </Grid>
        <Grid item xs={12} md={4}>
          <Referrals />
        </Grid>
        <Grid item xs={12} md={4}>
          <EconomyStatus />
        </Grid>
      </Grid>
      <Leaderboard />
      <ToSocial />
      <QuotesPart />
      <VideoPlayer link={Constants.tutorialVideoLink} />
      <a
        className="td-none"
        href={
          language === "es"
            ? "https://docs-es.cryptolegions.app/"
            : "https://docs.cryptolegions.app/"
        }
        target="_blank"
        style={{ color: "white", border: "none" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 2,
            "&:hover": {
              color: "#f66810",
              transition: ".4s all",
            },
          }}
        >
          <LanguageTranslate translateKey="readInstructionsInWhitePaper" />
        </Typography>
      </a>
    </Box>
  );
};

export default Home;
