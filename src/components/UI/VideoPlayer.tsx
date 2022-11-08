import React from "react";
import ReactPlayer from "react-player";
import { Box, Grid } from "@mui/material";

type Props = {
  link: string | undefined;
};

const VideoPlayer: React.FC<Props> = ({ link }) => {
  return (
    <Grid spacing={2} container>
      <Grid item md={3} sm={2} xs={1}></Grid>
      <Grid item md={6} sm={8} xs={10}>
        <Box
          sx={{
            width: "100%",
            paddingTop: "56.25%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ReactPlayer url={link} width="100%" height="100%" />
          </Box>
        </Box>
      </Grid>
      <Grid item md={3} sm={2} xs={1}></Grid>
    </Grid>
  );
};

export default VideoPlayer;
