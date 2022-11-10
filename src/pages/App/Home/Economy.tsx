import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { Box, Stack } from "@mui/material";
import Axios from "axios";

import HomeTypo from "../../../components/UI/HomeTypo";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  getLiquidityPoolAddress,
  getRewardPoolAddress,
} from "../../../web3hooks/getAddress";
import {
  useBloodstone,
  useBUSD,
  useWeb3,
} from "../../../web3hooks/useContract";
import { AppDispatch, AppSelector } from "../../../store";
import FireBtn from "../../../components/Buttons/FireBtn";
import GreyBtn from "../../../components/Buttons/GreyBtn";
import RedBtn from "../../../components/Buttons/RedBtn";
import { voteState } from "../../../reducers/vote.reducer";
import {
  getClaimedBUSDAlertAmount,
  inventoryState,
} from "../../../reducers/inventory.reducer";
import { updateModalState } from "../../../reducers/modal.reducer";
import { legionState } from "../../../reducers/legion.reducer";
import { getBUSDBalance } from "../../../web3hooks/contractFunctions/busd.contract";
import { getBloodstoneBalance } from "../../../web3hooks/contractFunctions/blst.contract";
import ClaimedBUSDAlertAmountModal from "../../../components/Modals/ClaimedBUSDAlertAmount.modal";
import ClaimedBUSDAlertModal from "../../../components/Modals/ClaimedBUSDAlert.modal";
import { apiConfig } from "../../../config/api.config";

const Economy: React.FC = () => {
  const comparision24Time = Math.floor(new Date().getTime() / 1000) - 24 * 3600;

  const comparision1Time = Math.floor(new Date().getTime() / 1000) - 3600;

  const dispatch: AppDispatch = useDispatch();
  const { alreadyVoted, voteExpired } = AppSelector(voteState);
  const { allLegions } = AppSelector(legionState);
  const { claimedBUSDAlertAmount } = AppSelector(inventoryState);
  const web3 = useWeb3();
  const busdContract = useBUSD();
  const blstContract = useBloodstone();
  const { account } = useWeb3React();

  const liquidityPoolAddress = getLiquidityPoolAddress();

  const [liquidityBUSD, setLiquidityBUSD] = useState(0);
  const [rewardpoolBLST, setRewardpoolBLST] = useState(0);

  const [warriorCtn, setWarriorCtn] = useState(0);
  const [beastCtn, setBeastCtn] = useState(0);
  const [legionCtn, setLegionCtn] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [reinvestAmount, setReinvestAmount] = useState(0);
  const [totalPlayerCtn, setTotalPlayerCtn] = useState(0);
  const [prevClaimAmount, setPrevClaimAmount] = useState(0);
  const [last3DaysPlayerCtn, setLast3DaysPlayerCtn] = useState(0);

  useEffect(() => {
    if (
      prevClaimAmount < claimedBUSDAlertAmount &&
      claimAmount >= claimedBUSDAlertAmount
    ) {
      dispatch(
        updateModalState({
          claimedBUSDAlertModalOpen: true,
        })
      );
    }
    setPrevClaimAmount(claimAmount);
  }, [claimAmount]);

  useEffect(() => {
    if (claimedBUSDAlertAmount > 0 && claimAmount >= claimedBUSDAlertAmount) {
      dispatch(
        updateModalState({
          claimedBUSDAlertModalOpen: true,
        })
      );
    }
  }, [claimedBUSDAlertAmount]);

  useEffect(() => {
    getBalance();
    realTimeUpdate();
    getAlertAmount();
  }, []);

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

  const getWarriorCtn = async () => {
    try {
      let count = 0;
      while (true) {
        const query = `
          {
            warriors (
              where: {
                createdAt_gt: ${comparision24Time}
              }
              first: 1000
              skip: ${count}
            ) {
              id
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.warriors;
        if (data.length == 0) {
          break;
        }
        count += data.length;
      }
      setWarriorCtn(count);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const canVote = async () => {
    try {
      const totalAP = allLegions
        .map((legion) => legion.attackPower)
        .reduce((prev, curr) => Number(prev) + Number(curr), 0);
      if (totalAP < 10000) {
        return false;
      }
      const timestamp = new Date().getTime() - 3 * 24 * 60 * 60 * 1000;
      const query = `
      {
        user(id: ${`"` + account?.toLowerCase() + `"`}){
          huntHistory(
            timestamp_gt: ${timestamp}
            orderBy: timestamp
          ) {
            name
            legionId
            timestamp
          }
        }
      }
      `;
      let graphRes = await Axios.post(apiConfig.subgraphServer, {
        query: query,
      });
      const data = graphRes.data.data.user.huntHistory;
      if (data.length == 0) {
        return false;
      }
      return true;
    } catch (error) {}
  };

  const getBeastCtn = async () => {
    try {
      let count = 0;
      while (true) {
        const query = `
          {
            beasts (
              where: {
                createdAt_gt: ${comparision24Time}
              }
              first: 1000
              skip: ${count}
            ) {
              id
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.beasts;
        if (data.length == 0) {
          break;
        }
        count += data.length;
      }

      setBeastCtn(count);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getLegionCtn = async () => {
    try {
      let count = 0;
      while (true) {
        const query = `
          {
            legions (
              where: {
                createdAt_gt: ${comparision24Time}
              }
              first: 1000
              skip: ${count}
            ) {
              id
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.legions;
        if (data.length == 0) {
          break;
        }
        count += data.length;
      }
      setLegionCtn(count);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getClaimAmount = async () => {
    try {
      let temp: any = [];
      while (true) {
        const query = `
          {
            claimOrReinvestEvents (
              where: {
                claimStatus: ${true}
                timestamp_gt: ${comparision1Time}
              }
              first: 1000
              skip: ${temp.length}
            ) {
              id
              realAmount
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.claimOrReinvestEvents;
        if (data.length == 0) {
          break;
        }
        temp = [...temp, ...data];
      }
      let claimAmount = temp.reduce(
        (a: any, b: any) => a + Number(b.realAmount) / 10 ** 18,
        0
      );
      setClaimAmount(claimAmount);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getReinvestAmount = async () => {
    try {
      let temp: any = [];
      while (true) {
        const query = `
          {
            claimOrReinvestEvents (
              where: {
                claimStatus: ${false}
                timestamp_gt: ${comparision1Time}
              }
              first: 1000
              skip: ${temp.length}
            ) {
              id
              realAmount
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.claimOrReinvestEvents;
        if (data.length == 0) {
          break;
        }
        temp = [...temp, ...data];
      }
      let claimAmount = temp.reduce(
        (a: any, b: any) => a + Number(b.realAmount) / 10 ** 18,
        0
      );
      setReinvestAmount(claimAmount);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getTaxAmount = async () => {
    try {
      let temp: any = [];
      while (true) {
        const query = `
          {
            claimOrReinvestEvents (
              where: {
                timestamp_gt: ${comparision1Time}
              }
              first: 1000
              skip: ${temp.length}
            ) {
              id
              realAmount
              totalAmount
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.claimOrReinvestEvents;
        if (data.length == 0) {
          break;
        }
        temp = [...temp, ...data];
      }
      let realAmount = temp.reduce(
        (a: any, b: any) => a + Number(b.realAmount) / 10 ** 18,
        0
      );
      let totalAmount = temp.reduce(
        (a: any, b: any) => a + Number(b.totalAmount) / 10 ** 18,
        0
      );
      setTaxAmount(totalAmount - realAmount);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getPlayerCtn = async () => {
    try {
      let count = 0;
      while (true) {
        const query = `
          {
            users (
              first: 1000
              skip: ${count}
            ) {
              id
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.users;
        if (data.length == 0) {
          break;
        }
        count += data.length;
      }
      setTotalPlayerCtn(count);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getLast3DaysPlayerCtn = async () => {
    try {
      let count = 0;
      let comparisionTimestamp =
        Math.floor(new Date().getTime() / 1000) - 24 * 3600 * 3;
      while (true) {
        const query = `
          {
            users (
              first: 1000
              skip: ${count}
              where: {
                timestamp_gt: ${comparisionTimestamp}
              }
            ) {
              id
            }
          }
        `;
        const graphRes = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const data = graphRes.data.data.users;
        if (data.length == 0) {
          break;
        }
        count += data.length;
      }
      setLast3DaysPlayerCtn(count);
    } catch (error) {
      console.log("get economy: ", error);
    }
  };

  const getBalance = async () => {
    try {
      getLiquidityBUSD();
      getRewardpoolBLST();
      getWarriorCtn();
      getBeastCtn();
      getLegionCtn();
      getClaimAmount();
      getReinvestAmount();
      getTaxAmount();
      getPlayerCtn();
      getLast3DaysPlayerCtn();
    } catch (error) {
      console.log(error);
    }
  };

  const getAlertAmount = async () => {
    dispatch(getClaimedBUSDAlertAmount({ address: account as string }));
  };

  const realTimeUpdate = () => {
    setTimeout(() => {
      getBalance();
      realTimeUpdate();
    }, 10000);
  };

  const handleSetAlertAmount = () => {
    dispatch(
      updateModalState({
        claimedBUSDAlertAmountModalOpen: true,
      })
    );
  };

  return (
    <Box>
      <HomeTypo
        title={`${getTranslation("LiquidityPool")}:`}
        info={formatNumber(Number(liquidityBUSD).toFixed(2)) + " BUSD"}
      />
      <HomeTypo
        title={`${getTranslation("RewardPool")}:`}
        info={`
          ${formatNumber(Number(rewardpoolBLST).toFixed(2))} $${getTranslation(
          "blst"
        )}`}
      />
      <HomeTypo
        title={`${getTranslation("warriorSummonsInLast24h")}:`}
        info={warriorCtn}
      />
      <HomeTypo
        title={`${getTranslation("beastSummonsInLast24h")}:`}
        info={beastCtn}
      />
      <HomeTypo
        title={`${getTranslation("legionsCreatedInLast24h")}:`}
        info={legionCtn}
      />
      <Stack flexDirection="row" sx={{ flexWrap: "wrap" }}>
        <Box>
          <HomeTypo
            title={`${getTranslation("busdClaimedInLast1h")}:`}
            info={formatNumber(Number(claimAmount).toFixed(2))}
          />
        </Box>
        <Box sx={{ width: "10px" }}></Box>
        {alreadyVoted && !voteExpired && claimedBUSDAlertAmount == 0 && (
          <Box sx={{ marginTop: "0px" }}>
            <FireBtn
              sx={{ paddingTop: "2px", paddingBottom: "2px" }}
              onClick={handleSetAlertAmount}
            >
              Set Alert
            </FireBtn>
          </Box>
        )}
        {alreadyVoted &&
          !voteExpired &&
          claimedBUSDAlertAmount > 0 &&
          claimAmount < claimedBUSDAlertAmount && (
            <Box sx={{ marginTop: "0px" }}>
              <GreyBtn
                sx={{ paddingTop: "2px", paddingBottom: "2px" }}
                onClick={handleSetAlertAmount}
              >
                Alert set to {claimedBUSDAlertAmount} BUSD
              </GreyBtn>
            </Box>
          )}
        {alreadyVoted &&
          !voteExpired &&
          claimedBUSDAlertAmount > 0 &&
          claimAmount >= claimedBUSDAlertAmount && (
            <Box sx={{ marginTop: "0px" }}>
              <RedBtn
                sx={{ paddingTop: "2px", paddingBottom: "2px" }}
                onClick={handleSetAlertAmount}
              >
                Alert of {claimedBUSDAlertAmount} BUSD reached
              </RedBtn>
            </Box>
          )}
      </Stack>
      <HomeTypo
        title={`${getTranslation("busdReinvestedInLast1h")}:`}
        info={formatNumber(Number(reinvestAmount).toFixed(2))}
      />
      <HomeTypo
        title={`${getTranslation("busdTaxedInLast1h")}:`}
        info={formatNumber(Number(taxAmount).toFixed(2))}
      />
      <HomeTypo
        title={`${getTranslation("newPlayersInTheLast3Days")}:`}
        info={formatNumber(last3DaysPlayerCtn)}
      />
      <HomeTypo
        title={`${getTranslation("totalPlayers")}:`}
        info={formatNumber(totalPlayerCtn)}
      />
      <ClaimedBUSDAlertAmountModal />
      <ClaimedBUSDAlertModal />
    </Box>
  );
};

export default Economy;
