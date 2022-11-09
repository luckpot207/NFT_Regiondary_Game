import React, { Suspense, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useNavigate, useRoutes } from "react-router";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { navConfig } from "../../config/nav.config";
import { getContactInfo, getPresentItem } from "../../reducers/common.reduer";
import { AppDispatch } from "../../store";

import "./index.css";
import NavList from "../../components/Nav/NavList";
import TopBar from "../../components/TopBar";

const GameView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const routing = useRoutes(navConfig.routes());
  const theme = useTheme();
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));
  const { account } = useWeb3React();

  useEffect(() => {
    navigate("/");
    getBalance();
  }, [account]);

  const getBalance = async () => {
    try {
      dispatch(getContactInfo(account?.toLowerCase()));
      dispatch(getPresentItem());
    } catch (error) {}
  };

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
    </Box>
  );
};

export default GameView;
