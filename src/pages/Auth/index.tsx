import * as React from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { Box, Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { injected } from "../../wallet";
import { addNetwork, switchNetwork } from "../../wallet";
import gameConfig from "../../config/game.config";
import constants from "../../constants";

const gameVersion = gameConfig.version;

const useStyles = makeStyles({
  loginToWhitePaperBtn: {
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 18,
    color: "#565656",
    textDecoration: "none",
    transition: ".4s all",
    "&:hover": {
      transition: ".4s all",
      color: "#f89c35",
    },
  },
  logo: {
    animation: `$LogoBang linear 1s`,
  },
  fadeAnimation: {
    animation: `$fadeIn cubic-bezier(0.4, 0, 1, 1) 3s`,
  },
  "@keyframes LogoBang": {
    "0%": {
      transform: "scale(12)",
    },
    "15%": {
      transform: "scale(1)",
    },
    "35%": {
      transform: "translate(5px, 0px)",
    },
    "55%": {
      transform: "translate(-5px, 0px)",
    },
    "70%": {
      transform: "translate(5px, 0px)",
    },
    "80%": {
      transform: "translate(-5px, 0px)",
    },
    "90%": {
      transform: "translate(0px, 0px)",
    },
    "100%": {
      opacity: 1,
      transform: "translate(0px, 0px)",
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: "0",
    },
    "100%": {
      opacity: "1",
    },
  },
});

const image = {
  METAMASK: "/assets/images/metamask.jpg",
  METAMASK_WINK: "/assets/images/metamask2.jpg",
  FOX_FAILED: "/assets/images/metamask-logo-bw.png",
  FOX_LOADING: "/assets/images/metamask-front.png",
  FOX_INIT: "/assets/images/metamask-logo.png",
  DRAGON_INIT: "/assets/images/login_page_without_mouse.jpg",
  DRAGON_HOVER: "/assets/images/login_page_with_mouse_hovering_over_dragon.jpg",
  LOGO: "/assets/images/logo.png",
};

const Login: React.FC = () => {
  const { activate, active, error } = useWeb3React();

  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);

  const [mouseOver, setMouseOver] = React.useState(false);

  const [logoImage] = React.useState(image.LOGO);

  const handleCloseClick = () => {
    setLoading(true);
    activate(injected);
  };

  React.useEffect(() => {
    if (error) {
      if (error.toString().indexOf("No Ethereum") > -1) {
        toast.error("Please Install MetaMask!");
      }
      if (error.toString().indexOf("Unsupported") > -1) {
        addNetwork();
        switchNetwork();
        toast.error(
          gameVersion.chain === "mainnet"
            ? "Please choose BSC Network!"
            : "Please choose BSC TEST Network!"
        );
      }
    }
    setLoading(false);
  }, [active, activate, error]);

  return (
    <Box
      style={{
        background: "black",
        position: "fixed",
        top: "0",
        left: "0",
        bottom: "0",
        right: "0",
      }}
    >
      <Container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <img
            src={logoImage}
            style={{ width: "40%" }}
            className={classes.logo}
            alt="logo"
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}></Grid>
          <Grid item md={6} xs={12}>
            <Grid
              container
              spacing={2}
              onMouseOver={() => {
                setMouseOver(true);
              }}
              onMouseLeave={() => {
                setMouseOver(false);
              }}
              onClick={handleCloseClick}
            >
              <Grid item xs={12} sm={12}>
                <Box sx={{ paddingTop: "64%", position: "relative" }}>
                  {
                    <Box
                      sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
                      className={classes.fadeAnimation}
                    >
                      <img
                        src={image.DRAGON_HOVER}
                        style={{ width: "100%" }}
                        hidden={!(loading || mouseOver)}
                        alt="dragon"
                      />
                      <img
                        src={image.DRAGON_INIT}
                        style={{ width: "100%" }}
                        hidden={loading || mouseOver}
                        alt="dragon"
                      />
                    </Box>
                  }
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} xs={12}></Grid>
        </Grid>
        <Box
          sx={{ marginTop: 2, textAlign: "center" }}
          className={classes.fadeAnimation}
        >
          <a
            href={constants.navlink.whitepaper}
            className={classes.loginToWhitePaperBtn}
            target={"blank"}
          >
            Need instructions? Read our Whitepaper
          </a>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
