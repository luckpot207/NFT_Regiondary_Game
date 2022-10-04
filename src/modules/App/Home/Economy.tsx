import { Box, Card, Typography } from "@mui/material";
import { current } from "@reduxjs/toolkit";
import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import HomeTypo from "../../../components/UI/HomeTypo";
import gameVersion from "../../../constants/gameVersion";
import ApiService from "../../../services/api.service";
import { formatNumber } from "../../../utils/utils";
import {
  getBloodstoneBalance,
  getBUSDBalance,
} from "../../../web3hooks/contractFunctions";
import { getRewardPoolAddress } from "../../../web3hooks/getAddress";
import {
  useBloodstone,
  useBUSD,
  useWeb3,
} from "../../../web3hooks/useContract";

const Economy: React.FC = () => {
  const web3 = useWeb3();
  const busdContract = useBUSD();
  const blstContract = useBloodstone();

  const liquidityPoolAddress = "0x13fade99f5d7038cd53261770d80902c8756adae";

  const [liquidityBUSD, setLiquidityBUSD] = useState(0);
  const [rewardpoolBLST, setRewardpoolBLST] = useState(0);

  const [warriorCtn, setWarriorCtn] = useState(0);
  const [beastCtn, setBeastCtn] = useState(0);
  const [legionCtn, setLegionCtn] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [reinvestAmount, setReinvestAmount] = useState(0);
  const [totalPlayerCtn, setTotalPlayerCtn] = useState(0);

  const getLiquidityBUSD = async () => {
    try {
      const liquidityBUSD = await getBUSDBalance(
        web3,
        busdContract,
        liquidityPoolAddress
      );
      setLiquidityBUSD(liquidityBUSD);
    } catch (error) {
      console.log(error);
    }
  };

  const getRewardpoolBLST = async () => {
    try {
      const rewardpoolBLST = await getBloodstoneBalance(
        web3,
        blstContract,
        getRewardPoolAddress()
      );
      setRewardpoolBLST(parseFloat(rewardpoolBLST));
    } catch (error) {
      console.log(error);
    }
  };

  const getEconomyInfo = async () => {
    try {
      const { data } = await ApiService.getEconomyStatus();
      console.log('economy', data)
      const {
        warriorCtn,
        beastCtn,
        legionCtn,
        claimAmount,
        reinvestAmount,
        taxAmount,
        totalPlayerCtn,
      } = data.data;
      if (warriorCtn.length > 0) setWarriorCtn(warriorCtn[0].totalCount);
      if (beastCtn.length > 0) setBeastCtn(beastCtn[0].totalCount);
      if (legionCtn.length > 0) setLegionCtn(legionCtn[0].totalCount);
      if (claimAmount.length > 0) setClaimAmount(claimAmount[0].claimAmount);
      if (reinvestAmount.length > 0)
        setReinvestAmount(reinvestAmount[0].reinvestAmount);
      if (taxAmount.length > 0) setTaxAmount(taxAmount[0].taxSum);
      setTotalPlayerCtn(totalPlayerCtn);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      getLiquidityBUSD();
      getRewardpoolBLST();
      getEconomyInfo();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
    realTimeUpdate();
  }, []);

  const realTimeUpdate = () => {
    setTimeout(() => {
      getBalance();
      realTimeUpdate();
    }, 10000);
  };

  return (
    <Box>
      <HomeTypo
        title={"BUSD amount of the Liquidity Pool: "}
        info={formatNumber(Number(liquidityBUSD).toFixed(2))}
      />
      <HomeTypo
        title={"$BLST amount of the Reward Pool: "}
        info={formatNumber(Number(rewardpoolBLST).toFixed(2))}
      />
      <HomeTypo title={"Warrior summons in last 24h: "} info={warriorCtn} />
      <HomeTypo title={"Beast summons in last 24h: "} info={beastCtn} />
      <HomeTypo title={"Legions created in last 24h: "} info={legionCtn} />
      <HomeTypo
        title={"BUSD claimed in last 1h: "}
        info={formatNumber(Number(claimAmount).toFixed(2))}
      />
      <HomeTypo
        title={"BUSD reinvested in last 1h: "}
        info={formatNumber(Number(reinvestAmount).toFixed(2))}
      />
      <HomeTypo
        title={"BUSD taxed in last 1h: "}
        info={formatNumber(Number(taxAmount).toFixed(2))}
      />
      <HomeTypo title={"Total Player: "} info={formatNumber(totalPlayerCtn)} />
    </Box>
  );
};

export default Economy;
