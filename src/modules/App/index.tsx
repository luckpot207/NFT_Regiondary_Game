import React, { Suspense, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router";
import {
  Box,
  CssBaseline,
  Drawer,
  LinearProgress,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "./index.css";
import { navConfig } from "../../config/nav.config";
import TopBar from "../../components/TopBar";
import NavList from "../../components/Nav/NavList";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import {
  gameState,
  getAllItemnames,
  getAllLanguageTexts,
  getContactInfo,
  getPresentItem,
  updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppDispatch, AppSelector } from "../../store";
import LanguageTranslate from "../../components/UI/LanguageTranslate";
// import "sweetalert2/src/sweetalert2.css";

const GameView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const routing = useRoutes(navConfig.routes());
  const theme = useTheme();
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));

  const { initialDataLoading } = AppSelector(gameState);
  const { account } = useWeb3React();

  const getBalance = async () => {
    dispatch(updateState({ initialDataLoading: true }));
    try {
      await dispatch(getAllLanguageTexts());
      await dispatch(getContactInfo(account?.toLowerCase()));
      await dispatch(getAllItemnames());
      await dispatch(getPresentItem());
    } catch (error) {}
    dispatch(updateState({ initialDataLoading: false }));
  };

  useEffect(() => {
    getBalance();
  }, [account]);

  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <Box className={"main-view"}>
      <CssBaseline />
      <TopBar />
      {!isSmallerThanMD && (
        <Drawer
          variant="permanent"
          sx={{
            width: navConfig.drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: navConfig.drawerWidth,
              boxSizing: "border-box",
              background: "#161616",
            },
          }}
        >
          <NavList />
        </Drawer>
      )}
      <Box
        component={"main"}
        id={"main"}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${navConfig.drawerWidth}px)` },
          paddingTop: { xs: 8, md: 4, lg: 4 },
        }}
      >
        <Toolbar />
        <Suspense fallback={<h3>Loading</h3>}>{routing}</Suspense>
      </Box>
      {initialDataLoading && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            paddingLeft: 10,
            paddingRight: 10,
            display: "flex",
            alignItems: "center",
            background: "#222222ee",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Box sx={{ width: "50%" }}>
            <Box sx={{ textAlign: "center", marginBottom: 1 }}>
              Loading Initial Data...
            </Box>
            <LinearProgress sx={{ width: "100%" }} color="success" />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GameView;
