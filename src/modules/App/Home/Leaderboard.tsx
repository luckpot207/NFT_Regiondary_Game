import { Box } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";

const Leaderboard: React.FC = () => {
  // Hook Info

  // Account & Web3
  const { account } = useWeb3React();

  // Functions
  const getBalance = async () => {};

  // UseEffect
  useEffect(() => {
    getBalance();
  }, []);
  return <Box>Leaderboard</Box>;
};

export default Leaderboard;
