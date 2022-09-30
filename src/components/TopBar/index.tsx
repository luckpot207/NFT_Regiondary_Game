import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { navConfig } from "../../config/nav.config";
import { NavLink } from "react-router-dom";
import Tutorial from "../Tutorial/Tutorial";
import FireBtn from "../Buttons/FireBtn";
import { AppDispatch, AppSelector } from "../../store";
import {
  gameState,
  updateState,
  confirmSamaritanStarHolder,
  getVoteStatus,
  addSamaritanStarHolder,
  getReincarnation,
  getVoteByAddress,
} from "../../reducers/cryptolegions.reducer";
import { formatNumber, getTranslation, showWallet } from "../../utils/utils";
import MenuIcon from "@mui/icons-material/Menu";
import BadgeIcon from "@mui/icons-material/Badge";
import { useWeb3React } from "@web3-react/core";
import NavList from "../Nav/NavList";
import { useDispatch } from "react-redux";
import {
  useBeast,
  useBloodstone,
  useFeeHandler,
  useRewardPool,
  useVRF,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import {
  getNadodoWatch,
  getSummonPrices,
  getUserInfo,
} from "../../helpers/basicInfo";
import { checkMintBeastPending } from "../../helpers/beast";
import { checkMintWarriorPending } from "../../helpers/warrior";
import StarRateIcon from "@mui/icons-material/StarRate";
import ClaimAndReinvestModal from "../Modals/ClaimAndReinvest.modal";
import LanguageTranslate from "../UI/LanguageTranslate";

const TopBar: React.FC = () => {
  // Hooks
  const dispatch: AppDispatch = useDispatch();
  const theme: any = useTheme();
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));
  const {
    language,
    isSideBarOpen,
    BLSTBalance,
    unclaimedBLST,
    reloadContractStatus,
    reinvestedWalletBLST,
    reinvestedWalletUSD,
    currentSamaritanStars,
    hadSamaritanStar,
    unclaimedUSD,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const accountRef = useRef(account);
  const web3 = useWeb3();

  // Contracts
  const feehandlerContract = useFeeHandler();
  const rewardpoolContract = useRewardPool();
  const bloodstoneContract = useBloodstone();
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const vrfContract = useVRF();

  // States
  useEffect(() => {
    accountRef.current = account;
  }, [account]);
  // Functions
  const getBalance = async () => {
    const getAccount = () => accountRef.current;
    getSummonPrices(dispatch, web3, feehandlerContract);
    getUserInfo(
      dispatch,
      web3,
      getAccount(),
      bloodstoneContract,
      rewardpoolContract,
      feehandlerContract
    );
    getNadodoWatch(dispatch, feehandlerContract, bloodstoneContract);
    checkMintBeastPending(dispatch, account, beastContract);
    checkMintWarriorPending(dispatch, account, warriorContract);
    dispatch(getReincarnation({ version: 3 }));
    dispatch(getVoteStatus());

    ///
    if (!hadSamaritanStar && currentSamaritanStars >= 4) {
      dispatch(addSamaritanStarHolder({ account: account as string }));
    } else if (hadSamaritanStar) {
      dispatch(confirmSamaritanStarHolder({ account: account as string }));
    }
  };

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    dispatch(updateState({ isSideBarOpen: open }));
  };

  const renderStars = () => {
    let samaritanStarsRender = [];
    for (let i = 0; i < 5; i++) {
      if (i < currentSamaritanStars) {
        samaritanStarsRender.push(
          <img
            key={i}
            src="/assets/images/samaritan-star-full.png"
            style={{ height: isSmallerThanMD ? 10 : 15, marginRight: 4 }}
            alt="icon"
          />
        );
      } else {
        samaritanStarsRender.push(
          <img
            key={i}
            src="/assets/images/samaritan-star-empty.png"
            style={{ height: isSmallerThanMD ? 10 : 15, marginRight: 4 }}
            alt="icon"
          />
        );
      }
    }
    return samaritanStarsRender;
  };

  const handleOpenModal = () => {
    dispatch(updateState({ claimAndReinvestModalOpen: true }));
  };

  // UseEffect
  useEffect(() => {
    getBalance();
  }, [reloadContractStatus]);

  React.useEffect(() => {
    dispatch(getVoteByAddress({ address: account as string }));
    realTimeUpdate();
  }, []);

  const realTimeUpdate = () => {
    console.log("-----------realTimeUpdate----------");
    setTimeout(() => {
      getBalance();
      realTimeUpdate();
    }, 20000);
  };

  return (
    <AppBar
      position="fixed"
      className="bg-c3"
      sx={{
        maxWidth: `100%`,
        ml: { sm: `${navConfig.drawerWidth}px` },
        py: 1,
        zIndex: (theme: any) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ flexFlow: "wrap" }}>
          {isSmallerThanMD && (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                anchor="left"
                open={isSideBarOpen.valueOf()}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={{
                  [`& .MuiDrawer-paper`]: {
                    background: "#161616",
                  },
                }}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onKeyDown={toggleDrawer(false)}
                >
                  <NavList />
                </Box>
              </SwipeableDrawer>
            </Box>
          )}
          <Box sx={{ marginLeft: { md: 0, xs: "auto" } }}></Box>
          <NavLink
            to="/"
            className="non-style"
            style={{
              color: "inherit",
              textDecoration: "none",
              minWidth: "250px",
            }}
          >
            <img
              src="/assets/images/logo_dashboard.png"
              style={{ height: "55px" }}
              alt="logo"
            />
          </NavLink>
          <Box sx={{ flexGrow: 0, ml: { xs: "auto" } }}>
            {isSmallerThanMD ? (
              <Box>
                <Box sx={{ mb: 1 }}>
                  <FireBtn
                    sx={{
                      mr: { xs: 1, md: 1 },
                      fontSize: { xs: "0.7rem", md: "1rem" },
                      px: 2,
                      "&:hover": {
                        background:
                          "linear-gradient(360deg, #622500, #ffffff29),radial-gradient(#953e0a, #9ca90b)",
                      },
                      background:
                        "linear-gradient(360deg, #622500, #ffffff29),radial-gradient(#953e0a, #9ca90b)",
                    }}
                    size="small"
                  >
                    {renderStars()}
                    {formatNumber(Number(reinvestedWalletBLST).toFixed(2))}{" "}
                    $BLST
                  </FireBtn>
                  <FireBtn
                    sx={{
                      mr: { xs: 0, md: 5 },
                      fontSize: { xs: "0.7rem", md: "1rem" },
                      px: 2,
                    }}
                    onClick={() => handleOpenModal()}
                    size="small"
                  >
                    <LanguageTranslate translateKey="claim" />{" "}
                    {formatNumber(Number(unclaimedBLST).toFixed(2))} $ BLST
                  </FireBtn>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/assets/images/bloodstone.png"
                    style={{ height: "20px", marginRight: 4 }}
                    alt="bloodstone"
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        md: "1rem",
                      },
                    }}
                  >
                    {formatNumber(Number(BLSTBalance).toFixed(2))}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        md: "1rem",
                      },
                    }}
                  >
                    $BLST
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      background: "#622f11",
                      ml: 1,
                    }}
                    size="small"
                  >
                    <IconButton
                      aria-label="claim"
                      component="span"
                      sx={{ p: 0, mr: 1, color: "white" }}
                      size="small"
                    >
                      <BadgeIcon />
                    </IconButton>
                    <NavLink
                      to="/"
                      className="non-style"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            md: "1rem",
                          },
                        }}
                      >
                        {showWallet(6, 4, account)}
                      </Typography>
                    </NavLink>
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "inherit" },
                }}
              >
                <FireBtn
                  sx={{
                    mr: { xs: 0, md: 1 },
                    fontSize: { xs: "0.7rem", md: "1rem" },
                    px: 2,
                    "&:hover": {
                      background:
                        "linear-gradient(360deg, #622500, #ffffff29),radial-gradient(#953e0a, #9ca90b)",
                    },
                    background:
                      "linear-gradient(360deg, #622500, #ffffff29),radial-gradient(#953e0a, #9ca90b)",
                  }}
                  size="small"
                >
                  {renderStars()}
                  {formatNumber(Number(reinvestedWalletBLST).toFixed(2))} $BLST
                </FireBtn>
                <FireBtn
                  sx={{
                    mr: { xs: 0, md: 5 },
                    fontSize: { xs: "0.7rem", md: "1rem" },
                    px: 2,
                  }}
                  onClick={() => handleOpenModal()}
                  size="small"
                >
                  <LanguageTranslate translateKey="claim" />{" "}
                  {formatNumber(Number(unclaimedBLST).toFixed(2))} $ BLST
                </FireBtn>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: { xs: 2, md: 0 },
                  }}
                >
                  <img
                    src="/assets/images/bloodstone.png"
                    style={{ height: "55px" }}
                    alt="bloodstone"
                  />
                  <Box sx={{ ml: { xs: 1, md: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            md: "1rem",
                          },
                        }}
                      >
                        {formatNumber(Number(BLSTBalance).toFixed(2))}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            md: "1rem",
                          },
                        }}
                      >
                        $BLST
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        fontWeight: "bold",
                        background: "#622f11",
                      }}
                    >
                      <IconButton
                        aria-label="claim"
                        component="span"
                        sx={{ p: 0, mr: 1, color: "white" }}
                      >
                        <BadgeIcon />
                      </IconButton>
                      <NavLink
                        to="/"
                        className="non-style"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              md: "1rem",
                            },
                          }}
                        >
                          {showWallet(6, 4, account)}
                        </Typography>
                      </NavLink>
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      <ClaimAndReinvestModal />
    </AppBar>
  );
};

export default TopBar;
