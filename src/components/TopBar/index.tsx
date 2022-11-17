import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import MenuIcon from "@mui/icons-material/Menu";
import BadgeIcon from "@mui/icons-material/Badge";
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

import { navConfig, navLinks } from "../../config/nav.config";
import FireBtn from "../Buttons/FireBtn";
import { AppDispatch, AppSelector } from "../../store";
import { formatNumber, getTranslation, showWallet } from "../../utils/utils";
import NavList from "../Nav/NavList";
import {
  useBeast,
  useBloodstone,
  useFeeHandler,
  useRewardPool,
  useVRF,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import BeastService from "../../services/beast.service";
import WarriorService from "../../services/warrior.service";
import { getVoteByAddress, getVoteStatus } from "../../reducers/vote.reducer";
import CommonService from "../../services/common.service";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import { updateModalState } from "../../reducers/modal.reducer";
import { inventoryState } from "../../reducers/inventory.reducer";
import InventoryService from "../../services/inventory.service";
import ClaimAndReinvestModal from "../Modals/ClaimAndReinvest.modal";
import ClaimToWalletModal from "../Modals/ClaimToWallet.modal";
import constants from "../../constants";

const TopBar: React.FC = () => {
  let getBalanceTimer: any = 0;

  const dispatch: AppDispatch = useDispatch();
  const theme: any = useTheme();
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));
  const { isSideBarOpen, reloadStatusTime } = AppSelector(commonState);

  const {
    BLSTBalance,
    unclaimedBLST,
    claimedBLST,
    reinvestedWalletBLST,
    currentSamaritanStars,
  } = AppSelector(inventoryState);

  const unclaimedBLSTFromWei = Number(unclaimedBLST) / 10 ** 18;

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

  useEffect(() => {
    accountRef.current = account;
    getBalance();
  }, [account]);

  useEffect(() => {
    getBalance();
  }, [reloadStatusTime]);

  useEffect(() => {
    dispatch(getVoteByAddress({ address: account as string }));
    CommonService.getNadodoWatch(
      dispatch,
      feehandlerContract,
      bloodstoneContract
    );
    getBalance();
    getBalanceTimer = setInterval(() => {
      getBalance();
      console.log("I am in the timer!");
    }, 5000);
    return () => {
      clearInterval(getBalanceTimer);
    };
  }, []);

  const getBalance = async () => {
    const getAccount = () => accountRef.current;
    CommonService.getSummonPrices(dispatch, web3, feehandlerContract);
    InventoryService.getWalletAndUnclaimedBalance(
      dispatch,
      web3,
      getAccount(),
      bloodstoneContract,
      rewardpoolContract,
      feehandlerContract
    );
    InventoryService.getReinvestedAndVoucherBalance(
      dispatch,
      web3,
      getAccount(),
      rewardpoolContract,
      feehandlerContract
    );
    InventoryService.getClaimAndReinvestInfo(
      dispatch,
      getAccount(),
      rewardpoolContract
    );
    BeastService.checkMintBeastPending(dispatch, getAccount(), beastContract);
    WarriorService.checkMintWarriorPending(
      dispatch,
      getAccount(),
      warriorContract
    );
    dispatch(getVoteStatus());
  };

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    dispatch(updateCommonState({ isSideBarOpen: open }));
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
    dispatch(updateModalState({ claimAndReinvestModalOpen: true }));
  };

  const handleClaimToWalletModalOpen = () => {
    dispatch(updateModalState({ claimToWalletModalOpen: true }));
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
            to={navLinks.home}
            className="non-style"
            style={{
              color: "inherit",
              textDecoration: "none",
              minWidth: "250px",
            }}
          >
            <img
              src="/assets/images/logo.png"
              style={{ height: "55px" }}
              alt="logo"
            />
          </NavLink>
          <Box sx={{ flexGrow: 0, ml: { xs: "auto" } }}>
            {isSmallerThanMD ? (
              <Box>
                <Box sx={{ mb: 1, display: "flex", justifyContent: "center" }}>
                  <FireBtn
                    sx={{
                      mr: { xs: 1, md: 1 },
                      fontSize: { xs: "0.7rem", md: "1rem" },
                      px: 2,
                      "&:hover": {
                        background: constants.color.bg6,
                      },
                      background: constants.color.bg6,
                    }}
                    size="small"
                  >
                    {renderStars()}
                    {formatNumber(Number(reinvestedWalletBLST).toFixed(2))}
                  </FireBtn>
                  <FireBtn
                    sx={{
                      mr: { xs: 1, md: 1 },
                      fontSize: { xs: "0.7rem", md: "1rem" },
                      px: 2,
                    }}
                    onClick={() => handleClaimToWalletModalOpen()}
                    size="small"
                  >
                    {getTranslation("claim")}{" "}
                    {formatNumber(Number(Number(claimedBLST)).toFixed(2))}
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
                    {getTranslation("unclaimedwallet")}{" "}
                    {formatNumber(
                      Number(Number(unclaimedBLSTFromWei)).toFixed(2)
                    )}
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
                  <Button
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      ml: 1,
                      color: "white",
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
                      to={navLinks.home}
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
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    px: 2,
                    "&:hover": {
                      background: constants.color.bg6,
                    },
                    background: constants.color.bg6,
                  }}
                  size="small"
                >
                  {renderStars()}
                  {formatNumber(Number(reinvestedWalletBLST).toFixed(2))} $
                  {getTranslation("blst")}
                </FireBtn>
                <FireBtn
                  sx={{
                    mr: { xs: 0, md: 1 },
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    px: 2,
                  }}
                  onClick={() => handleClaimToWalletModalOpen()}
                  size="small"
                >
                  {getTranslation("claim")}{" "}
                  {formatNumber(Number(Number(claimedBLST)).toFixed(2))} $
                  {getTranslation("blst")}
                </FireBtn>
                <FireBtn
                  sx={{
                    mr: { xs: 0, md: 5 },
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    px: 2,
                  }}
                  onClick={() => handleOpenModal()}
                  size="small"
                >
                  {getTranslation("unclaimedwallet")}{" "}
                  {formatNumber(
                    Number(Number(unclaimedBLSTFromWei)).toFixed(2)
                  )}{" "}
                  ${getTranslation("blst")}
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
                        {formatNumber(Number(BLSTBalance).toFixed(2))} $
                        {getTranslation("blst")}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
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
                        to={navLinks.home}
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
      <ClaimToWalletModal />
    </AppBar>
  );
};

export default TopBar;
