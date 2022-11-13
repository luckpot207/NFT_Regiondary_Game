import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { Box, Card, Typography } from "@mui/material";
import Axios from "axios";

import { AppSelector } from "../../../store";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useFeeHandler,
  useLegion,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import HomeTypo from "../../../components/UI/HomeTypo";
import { inventoryState } from "../../../reducers/inventory.reducer";
import { commonState } from "../../../reducers/common.reduer";
import { legionState } from "../../../reducers/legion.reducer";
import InventoryService from "../../../services/inventory.service";
import LegionService from "../../../services/legion.service";
import { apiConfig } from "../../../config/api.config";
import { getLegionLastHuntTime } from "../../../web3hooks/contractFunctions/legion.contract";

const YourInventory: React.FC = () => {
  let clockTimer: any = 0;
  // Hook Info
  const dispatch = useDispatch();
  const { reloadStatusTime } = AppSelector(commonState);
  const { allLegions } = AppSelector(legionState);
  const {
    BLSTBalance,
    beastBalance,
    warriorBalance,
    legionBalance,
    availableLegionsCount,
    unclaimedBLST,
    taxLeftDaysForClaim,
    maxAttackPower,
    BUSDForTotalBLST,
    USDToBLST,
    BLSTToUSD,
    startupInvestment,
    reinvestedTotalUSD,
    totalClaimedUSD,
    currentSamaritanStars,
    remainUnclaimedUSDWhenClaim,
    remainUnclaimedUSDWhenReinvest,
    currentReinvestPercent,
    futureReinvestPercentWhenClaim,
    futureReinvestPercentWhenReinvest,
    futureSamaritanStarsWhenClaim,
    futureSamaritanStarsWhenReinvest,
    reinvestingUSDWithoutTax,
    claimingUSDWithoutTax,
    additionalInvestment,
    daysLeftUntilAbove3Stars,
    claimMinTaxPercent,
    taxLeftDaysForReinvest,
  } = AppSelector(inventoryState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contract
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const feehandlerContract = useFeeHandler();

  // State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [firstHuntTime, setFirstHuntTime] = useState(0);
  const [totalWon, setTotalWon] = useState("0");

  const claimTaxAmount =
    ((Number(claimMinTaxPercent) + 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLST)) /
    100 /
    10 ** 18;

  // UseEffect
  useEffect(() => {
    clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    getBalance();
  }, [reloadStatusTime, account]);

  useEffect(() => {
    getLastHuntTimes();
  }, [allLegions]);

  // Functions
  const getBalance = async () => {
    try {
      InventoryService.getInventory(
        dispatch,
        web3,
        account,
        beastContract,
        warriorContract,
        legionContract,
        feehandlerContract
      );
      LegionService.getAllLegionsAct(dispatch, account, legionContract);
      if (account) {
        const query = `
          {
            user(id: ${`"` + account?.toLowerCase() + `"`}) {
              totalWon
            }
          }
        `;
        const res = await Axios.post(apiConfig.subgraphServer, {
          query: query,
        });
        const totalWon = res.data.data.user.totalWon;
        setTotalWon((Number(totalWon) / 10 ** 18).toFixed(2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLastHuntTimes = async () => {
    let availableLegionIds = allLegions
      .filter((legion) => legion.supplies > 0 && legion.attackPower >= 2000)
      .map((item) => item.id);
    let remainTimes = [];
    for (let i = 0; i < availableLegionIds.length; i++) {
      const legionId = availableLegionIds[i];
      const lastHuntTime = await getLegionLastHuntTime(
        legionContract,
        legionId
      );
      remainTimes.push(lastHuntTime);
    }
    if (remainTimes.length > 0) {
      var first = Math.min(...remainTimes);
      setFirstHuntTime(first);
    } else {
      setFirstHuntTime(0);
    }
  };

  const calcHuntTime = (firstHuntTime: number) => {
    const date = new Date(firstHuntTime * 1000);
    const diff = currentTime.getTime() - date.getTime();
    const diffSecs = (24 * 3600 * 1000 - diff) / 1000;
    const diff_in_hours = Math.floor(diffSecs / 3600).toFixed(0);
    const diff_in_mins = Math.floor((diffSecs % 3600) / 60).toFixed(0);
    const diff_in_secs = (Math.floor(diffSecs % 3600) % 60).toFixed(0);
    if (firstHuntTime !== 0) {
      if (diff / (1000 * 3600 * 24) >= 1) {
        return "00h 00m 00s";
      }
    } else if (firstHuntTime === 0) {
      return "00h 00m 00s";
    }
    if (
      parseInt(diff_in_hours) == 0 &&
      parseInt(diff_in_mins) == 0 &&
      parseInt(diff_in_secs) == 0
    ) {
      getBalance();
    }
    return `${diff_in_hours}h ${diff_in_mins}m ${diff_in_secs}s`;
  };

  return (
    <Card
      className="bg-c4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 4, justifyContent: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #fff",
            marginBottom: 3,
          }}
        >
          {getTranslation("yourInventory")}
        </Typography>
        <Box>
          <HomeTypo
            title={getTranslation("warriors") + ":"}
            info={warriorBalance}
          />
          <HomeTypo
            title={getTranslation("beasts") + ":"}
            info={beastBalance}
          />
          <HomeTypo
            title={getTranslation("availableLegions") + ":"}
            info={availableLegionsCount + " / " + legionBalance}
          />
          <HomeTypo
            title={getTranslation("waitingTimeToHunt") + ":"}
            info={calcHuntTime(firstHuntTime)}
          />
          <HomeTypo
            title={getTranslation("yourMaxAp") + ":"}
            info={maxAttackPower}
          />
          <HomeTypo
            title={getTranslation("unClaimed") + ":"}
            info={formatNumber(
              Number(Number(unclaimedBLST) / 10 ** 18).toFixed(2)
            )}
          />
          <Box hidden={unclaimedBLST === 0}>
            <HomeTypo
              title={getTranslation("claimTaxWhenClaim") + ":"}
              info={`
                ${claimTaxAmount.toFixed(2)} ${getTranslation("claimTaxVal")}`}
            />
          </Box>
          <HomeTypo
            title={getTranslation("taxDaysLeft") + ":"}
            info={taxLeftDaysForClaim}
          />
          <HomeTypo
            title={getTranslation("BLSTInYourWallet") + ":"}
            info={
              Number(BLSTBalance).toFixed(2) +
              " ( = " +
              Number(BUSDForTotalBLST).toFixed(2) +
              " USD)"
            }
          />
          <HomeTypo title={"1 USD = "} info={Number(USDToBLST).toFixed(2)} />
          <HomeTypo
            title={`1 ${getTranslation("blst")} = `}
            info={Number(BLSTToUSD).toFixed(2)}
          />
          <HomeTypo
            title={getTranslation("yourTotalWon") + ":"}
            info={`${totalWon} BUSD`}
          />
          -------------------------------------
          <HomeTypo
            title={"Claim Tax Left Days: "}
            info={taxLeftDaysForClaim}
          />
          <HomeTypo
            title={"Reinvest Tax Left Days: "}
            info={taxLeftDaysForReinvest}
          />
          <HomeTypo
            title={"Startup Investment: "}
            info={Number(startupInvestment).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={"Reinvested Total USD: "}
            info={Number(reinvestedTotalUSD).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={"Invested Total USD: "}
            info={
              Number(
                Number(reinvestedTotalUSD) + Number(additionalInvestment)
              ).toFixed(2) + " USD"
            }
          />
          <HomeTypo
            title={"Additional Investment USD: "}
            info={Number(additionalInvestment).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={"Total Claimed USD: "}
            info={Number(totalClaimedUSD).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={"Total Earned USD: "}
            info={`${(
              Number(totalClaimedUSD) + Number(reinvestedTotalUSD)
            ).toFixed(2)} = ${Number(totalClaimedUSD).toFixed(2)} + ${Number(
              reinvestedTotalUSD
            ).toFixed(2)}`}
          />
          <HomeTypo
            title={"Days Left until I can go above 3 stars: "}
            info={daysLeftUntilAbove3Stars + " Days"}
          />
          ---------------------------------
          <HomeTypo
            title={"Potential Claiming USD without Tax When Claim: "}
            info={claimingUSDWithoutTax}
          />
          <HomeTypo
            title={"Potential Reinvesting USD without Tax When Reinvest: "}
            info={reinvestingUSDWithoutTax}
          />
          ---------------------------------
          <HomeTypo
            title={
              "Remaining Amount in unclaimed wallet without tax when claim: "
            }
            info={remainUnclaimedUSDWhenClaim}
          />
          <HomeTypo
            title={
              "Remaining Amount in unclaimed wallet without tax when reinvest: "
            }
            info={remainUnclaimedUSDWhenReinvest}
          />
          ---------------------------------
          <HomeTypo
            title={"Current Samaritan Stars: "}
            info={currentSamaritanStars}
          />
          <HomeTypo
            title={"Reinvest Percent of Current Stars: "}
            info={currentReinvestPercent}
          />
          ---------------------------------
          <HomeTypo
            title={"Future Samaritan Stars When Claim: "}
            info={futureSamaritanStarsWhenClaim}
          />
          <HomeTypo
            title={"Reinvest Percent of Future Stars When Claim: "}
            info={`${futureReinvestPercentWhenClaim} = ${(
              ((Number(reinvestedTotalUSD) + Number(additionalInvestment)) /
                (Number(totalClaimedUSD) + Number(reinvestedTotalUSD)) +
                Number(claimingUSDWithoutTax)) *
              100
            ).toFixed(2)} = ${(
              Number(reinvestedTotalUSD) + Number(additionalInvestment)
            ).toFixed(2)} * 100 / ${(
              Number(totalClaimedUSD) +
              Number(reinvestedTotalUSD) +
              Number(claimingUSDWithoutTax)
            ).toFixed(2)} = (${Number(reinvestedTotalUSD).toFixed(
              2
            )} + ${Number(additionalInvestment).toFixed(2)}) * 100 / (${Number(
              reinvestedTotalUSD
            ).toFixed(2)} + ${Number(totalClaimedUSD).toFixed(2)} + ${Number(
              claimingUSDWithoutTax
            ).toFixed(2)})`}
          />
          ---------------------------------
          <HomeTypo
            title={"Future Samaritan Stars When Reinvest: "}
            info={futureSamaritanStarsWhenReinvest}
          />
          <HomeTypo
            title={"Reinvest Percent of Future Stars When Reinvest: "}
            info={`${futureReinvestPercentWhenReinvest} = ${(
              ((Number(reinvestedTotalUSD) +
                Number(additionalInvestment) +
                Number(reinvestingUSDWithoutTax)) /
                (Number(totalClaimedUSD) +
                  Number(reinvestedTotalUSD) +
                  Number(reinvestingUSDWithoutTax))) *
              100
            ).toFixed(2)} = ${(
              Number(reinvestedTotalUSD) +
              Number(additionalInvestment) +
              Number(reinvestingUSDWithoutTax)
            ).toFixed(2)} * 100 / ${(
              Number(totalClaimedUSD) +
              Number(additionalInvestment) +
              Number(reinvestingUSDWithoutTax)
            ).toFixed(2)} = (${Number(reinvestedTotalUSD).toFixed(
              2
            )} + ${Number(additionalInvestment).toFixed(2)} + ${Number(
              reinvestingUSDWithoutTax
            ).toFixed(2)}) * 100 / (${Number(reinvestedTotalUSD).toFixed(
              2
            )} + ${Number(reinvestingUSDWithoutTax).toFixed(2)}+${Number(
              totalClaimedUSD
            ).toFixed(2)})`}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default YourInventory;
