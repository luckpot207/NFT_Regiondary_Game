import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getTranslation } from "../../../utils/utils";
import constants from "../../../constants";
import ToSocial from "./ToSocial";
import QuotesPart from "./Quotes";
import VideoPlayer from "../../../components/UI/VideoPlayer";
import Leaderboard from "./Leaderboard";
import YourInventory from "./YourInventory";
import NadodoWatch from "./Nadodo";
import SamaritanStars from "./SamaritanStars";
import Referrals from "./Referrals";
import TakeAction from "./TakeAction";
import EconomyStatus from "./EconomyStatus";

const Home: React.FC = () => {
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
      <VideoPlayer link={constants.navlink.tutorialVideoLink} />
      <a
        className="td-none"
        href={constants.navlink.whitepaper}
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
          {getTranslation("readInstructionsInWhitePaper")}
        </Typography>
      </a>
    </Box>
  );
};

export default Home;
