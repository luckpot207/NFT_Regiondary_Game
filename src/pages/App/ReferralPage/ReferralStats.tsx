import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatNumber, getTranslation, showWallet } from "../../../utils/utils";
import constants from "../../../constants";

const useStyles = makeStyles({
  leaderboard: {
    border: `3px solid ${constants.color.color2}`,
    borderRadius: 5,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#16161699",
    position: "relative",
  },
});

interface IProps {
  title: string;
  commissionTitle: string;
  data: any[];
}
const ReferralTable: React.FC<IProps> = (props) => {
  const { title, commissionTitle, data } = props;
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const classes = useStyles();
  return (
    <Box>
      <Box sx={{ width: "100%", mb: 2, position: "relative" }}>
        <Box sx={{ position: "absolute" }}></Box>
        <Grid spacing={2} container>
          <Grid item md={1} sm={0} xs={0}></Grid>
          <Grid item md={10} sm={12} xs={12}>
            <Box className={classes.leaderboard}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "1px solid #fff",
                  marginBottom: 3,
                }}
              >
                {title}
              </Typography>

              <Box sx={{ textAlign: "center" }}>
                <Grid
                  spacing={2}
                  container
                  className=""
                  style={{ fontWeight: "bold" }}
                >
                  <Grid item xs={3}>
                    {getTranslation("rank")}
                  </Grid>
                  <Grid item xs={3}>
                    {getTranslation("wallet")}
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      paddingLeft: "2px",
                      paddingRight: "2px",
                      wordBreak: "break-word",
                    }}
                  >
                    {getTranslation("#PlayersReferred")}
                  </Grid>
                  <Grid item xs={3}>
                    {getTranslation("busdEarned")}
                  </Grid>
                </Grid>
                {data.slice(0, 20).map((user: any, index: number) => (
                  <Grid spacing={2} container className="fc1" key={index}>
                    <Grid item xs={3}>
                      #{index + 1}
                    </Grid>
                    <Grid item xs={3}>
                      {showWallet(2, 1, user.address)}
                    </Grid>
                    <Grid item xs={3}>
                      {formatNumber(user.layer1ReferralCount)}
                    </Grid>
                    <Grid item xs={3}>
                      ${user.totalComission.toFixed(2)}
                    </Grid>
                  </Grid>
                ))}
              </Box>
              <Grid sx={{ marginTop: "10px" }} spacing={2} container>
                <Grid item md={9} sm={7} xs={8}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "500",
                      textAlign: "left",
                      marginBottom: 3,
                    }}
                  >
                    {commissionTitle}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={5} xs={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "500",
                      textAlign: "center",
                      marginBottom: 3,
                      wordBreak: "break-word",
                    }}
                  >
                    ${" "}
                    {data
                      .reduce(
                        (total, current) => total + current.totalComission,
                        0
                      )
                      .toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item md={1} sm={0} xs={0}></Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ReferralTable;
