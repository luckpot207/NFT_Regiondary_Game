import React, { useState, useEffect } from "react";
import { Box, Card, Typography } from "@mui/material";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
  useBeast,
  useBloodstone,
  useFeeHandler,
  useLegion,
  useMonster,
  useRewardPool,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import HomeTypo from "../../../components/UI/HomeTypo";
import { getInventory } from "../../../helpers/basicInfo";
import { getAllLegionsAct } from "../../../helpers/legion";
import { getLegionLastHuntTime } from "../../../web3hooks/contractFunctions";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { useMoralis } from "react-moralis";
import gameVersion from "../../../constants/gameVersion";

const YourInventory: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    reloadContractStatus,
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
    allLegions,
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
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contract
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const rewardpoolContract = useRewardPool();
  const bloodstoneContract = useBloodstone();
  const feehandlerContract = useFeeHandler();
  const monsterContract = useMonster();

  // State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [firstHuntTime, setFirstHuntTime] = useState(0);
  const [totalWon, setTotalWon] = useState("0");
  const [totalLost, setTotalLost] = useState("0");

  const claimTaxAmount =
    ((Number(claimMinTaxPercent) + 2 * Number(taxLeftDaysForClaim)) *
      Number(unclaimedBLST)) /
    100;

  // Functions
  const getBalance = async () => {
    try {
      getInventory(
        dispatch,
        web3,
        account,
        bloodstoneContract,
        beastContract,
        warriorContract,
        legionContract,
        rewardpoolContract,
        feehandlerContract
      );
      getAllLegionsAct(dispatch, account, legionContract);
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

  // UseEffect
  useEffect(() => {
    getBalance();
  }, [reloadContractStatus]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, [currentTime]);

  useEffect(() => {
    getLastHuntTimes();
  }, [allLegions]);

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
          <LanguageTranslate translateKey="yourInventory" />
        </Typography>
        <Box>
          <HomeTypo
            title={LanguageTranslate({ translateKey: "warriors" }) + ":"}
            info={warriorBalance}
          />
          <HomeTypo
            title={LanguageTranslate({ translateKey: "beasts" }) + ":"}
            info={beastBalance}
          />
          <HomeTypo
            title={
              LanguageTranslate({ translateKey: "availableLegions" }) + ":"
            }
            info={availableLegionsCount + " / " + legionBalance}
          />
          <HomeTypo
            title={
              LanguageTranslate({ translateKey: "waitingTimeToHunt" }) + ":"
            }
            info={calcHuntTime(firstHuntTime)}
          />
          <HomeTypo
            title={LanguageTranslate({ translateKey: "yourMaxAp" }) + ":"}
            info={maxAttackPower}
          />
          <HomeTypo
            title={LanguageTranslate({ translateKey: "unClaimed" }) + ":"}
            info={Number(unclaimedBLST).toFixed(2)}
          />
          <Box hidden={unclaimedBLST === 0}>
            <HomeTypo
              title={LanguageTranslate({ translateKey: "claimTax" }) + ":"}
              info={`
                ${claimTaxAmount.toFixed(2)} ${LanguageTranslate({
                translateKey: "claimTaxVal",
              })}`}
            />
          </Box>
          <HomeTypo
            title={LanguageTranslate({ translateKey: "taxDaysLeft" }) + ":"}
            info={taxLeftDaysForClaim}
          />
          <HomeTypo
            title={
              LanguageTranslate({ translateKey: "BLSTInYourWallet" }) + ":"
            }
            info={
              Number(BLSTBalance).toFixed(2) +
              " ( = " +
              Number(BUSDForTotalBLST).toFixed(2) +
              " USD)"
            }
          />
          <HomeTypo title={"1 USD = "} info={Number(USDToBLST).toFixed(2)} />
          <HomeTypo title={"1 BLST = "} info={Number(BLSTToUSD).toFixed(2)} />
          <HomeTypo title={"Your Total Won: "} info={`${totalWon} BUSD`} />
          <HomeTypo
            title={"Inside the game our $BLV3 token symbol is called $BLST"}
            info={""}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default YourInventory;
