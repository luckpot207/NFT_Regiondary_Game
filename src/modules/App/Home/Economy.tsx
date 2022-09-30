import { Box, Card, Typography } from "@mui/material";
import { current } from "@reduxjs/toolkit";
import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import HomeTypo from "../../../components/UI/HomeTypo";
import gameVersion from "../../../constants/gameVersion";
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
  const { Moralis } = useMoralis();
  Moralis.masterKey = gameVersion.moralisMasterKey;
  let mintWarriorQuery = new Moralis.Query("MintWarrior");
  let mintBeastQuery = new Moralis.Query("MintBeast");
  let createLegionQuery = new Moralis.Query("CreateLegion");
  let buyTokenQuery = new Moralis.Query("BuyToken");
  let claimOrReinvestQuery = new Moralis.Query("ClaimOrReinvest");

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

  const getWarriorCtn = async (comparisonTime: Date) => {
    try {
      const warriorPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
          },
        },
        {
          count: "totalCount",
        },
      ];
      const warriorCtn = await mintWarriorQuery.aggregate(warriorPipeLine);
      if (warriorCtn.length > 0) {
        setWarriorCtn(warriorCtn[0].totalCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBeastCtn = async (comparisonTime: Date) => {
    try {
      const beastPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
          },
        },
        {
          count: "totalCount",
        },
      ];
      const beastCtn = await mintBeastQuery.aggregate(beastPipeLine);
      if (beastCtn.length > 0) {
        setBeastCtn(beastCtn[0].totalCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLegionCtn = async (comparisonTime: Date) => {
    try {
      const legionPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
          },
        },
        {
          count: "totalCount",
        },
      ];
      const legionCtn = await createLegionQuery.aggregate(legionPipeLine);
      if (legionCtn.length > 0) {
        setLegionCtn(legionCtn[0].totalCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getClaimAmount = async (comparisonTime: Date) => {
    try {
      const claimPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
            claimStatus: {
              $eq: true,
            },
          },
        },
        {
          group: {
            objectId: "$claimStatus",
            claimAmount: { $sum: "$realAmount_decimal" },
          },
        },
      ];
      const claimAmount = await claimOrReinvestQuery.aggregate(claimPipeLine);
      console.log("claimAmount: ", claimAmount);
      if (claimAmount.length > 0) {
        setClaimAmount(
          parseFloat(web3.utils.fromWei(claimAmount[0].claimAmount, "ether"))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getReinvestAmount = async (comparisonTime: Date) => {
    try {
      const reinvestPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
            claimStatus: {
              $eq: false,
            },
          },
        },
        {
          group: {
            objectId: "$claimStatus",
            reinvestAmount: { $sum: "$realAmount_decimal" },
          },
        },
      ];
      const reinvestAmount = await claimOrReinvestQuery.aggregate(
        reinvestPipeLine
      );
      console.log("reinvestAmount: ", reinvestAmount);
      if (reinvestAmount.length > 0) {
        setReinvestAmount(
          parseFloat(
            web3.utils.fromWei(reinvestAmount[0].reinvestAmount, "ether")
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTax = async (comparisonTime: Date) => {
    try {
      const claimOrReinvestPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
          },
        },
        {
          group: {
            objectId: null,
            taxSum: {
              $sum: {
                $subtract: ["$totalAmount_decimal", "$realAmount_decimal"],
              },
            },
          },
        },
      ];
      const claimOrReinvestTax = await claimOrReinvestQuery.aggregate(
        claimOrReinvestPipeLine as any
      );
      console.log("claimOrReinvestTax: ", claimOrReinvestTax);

      const buyTokenPipeLine = [
        {
          match: {
            block_timestamp: {
              $gte: comparisonTime,
            },
          },
        },
        {
          group: {
            objectId: null,
            taxSum: {
              $sum: "$amountToRewardPool_decimal",
            },
          },
        },
      ];
      const marketplaceTax = await buyTokenQuery.aggregate(
        buyTokenPipeLine as any
      );

      let taxSum = 0;
      if (claimOrReinvestTax.length > 0) {
        taxSum += parseFloat(
          web3.utils.fromWei(claimOrReinvestTax[0].taxSum, "ether")
        );
      }
      if (marketplaceTax.length > 0) {
        taxSum += parseFloat(
          web3.utils.fromWei(marketplaceTax[0].taxSum, "ether")
        );
      }
      setTaxAmount(taxSum);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const currentTime = (await web3.eth.getBlock("latest")).timestamp;
      const comparisonTime1h = new Date((Number(currentTime) - 3600) * 1000);
      const comparisonTime24h = new Date(
        (Number(currentTime) - 24 * 3600) * 1000
      );
      getLiquidityBUSD();
      getRewardpoolBLST();
      // getWarriorCtn(comparisonTime24h);
      // getBeastCtn(comparisonTime24h);
      // getLegionCtn(comparisonTime24h);
      // getClaimAmount(comparisonTime1h);
      // getReinvestAmount(comparisonTime1h);
      // getTax(comparisonTime1h);
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
        info={formatNumber(claimAmount.toFixed(2))}
      />
      <HomeTypo
        title={"BUSD reinvested in last 1h: "}
        info={formatNumber(reinvestAmount.toFixed(2))}
      />
      <HomeTypo
        title={"BUSD taxed in last 1h: "}
        info={formatNumber(taxAmount.toFixed(2))}
      />
    </Box>
  );
};

export default Economy;
