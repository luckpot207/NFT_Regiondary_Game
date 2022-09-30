import {
  Button,
  Card,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkHuntRevealStatus } from "../../helpers/hunt";
import { I_Legion, I_Monster } from "../../interfaces";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import {
  formatNumber,
  getMonsterGifImage,
  getMonsterJpgImage,
  getTranslation,
  toCapitalize,
} from "../../utils/utils";
import {
  getCanAttackMonster25,
  getWalletHuntPending,
  getWalletHuntPendingLegionId,
  getWalletHuntPendingMonsterId,
  getWarriorCountForMonster25,
  initiateHunt,
} from "../../web3hooks/contractFunctions";
import { useLegion, useVRF, useWeb3 } from "../../web3hooks/useContract";
import Tutorial from "../Tutorial/Tutorial";
import LanguageTranslate from "../UI/LanguageTranslate";

type Props = {
  monster: I_Monster;
  isHuntable: Boolean;
  legion: I_Legion;
};

const MonsterCard: React.FC<Props> = ({ monster, isHuntable, legion }) => {
  // Hook info
  const dispatch = useDispatch();
  const { language, showAnimation, itemnames, presentItem } =
    AppSelector(gameState);

  // Account & web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const legionContract = useLegion();
  const vrfContract = useVRF();

  // State
  const {
    id: monsterID,
    percent,
    attackPower,
    BLSTReward,
    BUSDReward,
  } = monster;

  const name = itemnames.find(
    (item) => item.type === "monster" && item.number === monsterID
  )?.name;

  let legionID = "0";
  let legionAttackPower = 0;
  if (legion) {
    legionID = legion.id.valueOf();
    legionAttackPower = Number(legion.attackPower);
  }

  const [canHuntMonster25, setCanHuntMonster25] = useState(false);
  const [warriorCnt, setWarriorCnt] = useState(0);
  const [warriorBaseCnt, setWarriorBaseCnt] = useState(0);
  const [loaded, setLoaded] = useState(false);

  let bonus = 0;
  if (monsterID < 21) {
    const expBonus = Math.floor(
      (Number(legionAttackPower) - Number(attackPower)) / 2000 < 0
        ? 0
        : (Number(legionAttackPower) - Number(attackPower)) / 2000
    );
    bonus = expBonus + Number(percent) > 89 ? 89 - Number(percent) : expBonus;
  }

  // Functions
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const getBalance = async () => {
    try {
      if (monsterID === 25) {
        setCanHuntMonster25(
          (await getCanAttackMonster25(legionContract, account)).status
        );
        setWarriorCnt(
          (await getCanAttackMonster25(legionContract, account)).count
        );
        setWarriorBaseCnt(await getWarriorCountForMonster25(legionContract));
      }
    } catch (error) {}
  };

  const handleInitialHunt = async () => {
    try {
      let huntPending = await getWalletHuntPending(legionContract, account);
      dispatch(
        updateState({
          huntPending,
          huntingLegionId: parseInt(legionID),
          huntingMonsterId: monsterID,
        })
      );
      if (!huntPending) {
        dispatch(
          updateState({
            initialHuntLoading: true,
          })
        );
        await initiateHunt(legionContract, account, legionID, monsterID);
        let huntPending = await getWalletHuntPending(legionContract, account);

        const huntingMonsterId = await getWalletHuntPendingMonsterId(
          legionContract,
          account
        );
        const huntingLegionId = await getWalletHuntPendingLegionId(
          legionContract,
          account
        );
        console.log(huntingLegionId, huntingMonsterId);
        dispatch(
          updateState({
            huntPending,
            initialHuntLoading: false,
            huntingLegionId,
            huntingMonsterId,
            huntingSuccessPercent: Number(percent) + Number(bonus),
          })
        );
        checkHuntRevealStatus(dispatch, account, legionContract, vrfContract);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(
      updateState({
        initialHuntLoading: false,
      })
    );
  };

  // Use Effect
  useEffect(() => {
    getBalance();
  }, [monsterID]);

  return (
    <Card sx={{ position: "relative", textAlign: "center" }}>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{ fontWeight: "800", color: "darkgrey" }}
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
            #{monsterID} {monsterID === 25 ? name : toCapitalize(name)}
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ justifyContent: "space-around" }}>
          <Grid item>
            <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
              <LanguageTranslate translateKey="min" />{" "}
              <LanguageTranslate translateKey="ap" />
            </Typography>
            <Typography variant="h6">{attackPower}</Typography>
          </Grid>
          {monsterID !== 25 && (
            <Grid item>
              <Typography variant="h6">
                <LanguageTranslate translateKey="base" /> %
              </Typography>
              <Typography variant="h6">{percent}</Typography>
            </Grid>
          )}
          <Grid item>
            <Typography variant="h6">
              {monsterID === 25 ? (
                <LanguageTranslate translateKey="unlockStatus" />
              ) : (
                <>
                  <LanguageTranslate translateKey="bonus" /> %
                </>
              )}
            </Typography>
            <Typography variant="h6">
              {monsterID === 25 ? (
                <>
                  {warriorCnt}/{warriorBaseCnt}{" "}
                  <LanguageTranslate translateKey="warriorsUsed" />
                </>
              ) : (
                bonus
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {showAnimation ? (
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                <source src=${
                  monsterID === 25
                    ? presentItem.mp4
                    : `/assets/images/characters/mp4/monsters/m${monsterID}.mp4`
                } type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
          `,
          }}
        />
      ) : (
        <>
          <CardMedia
            component="img"
            image={
              monsterID === 25
                ? presentItem.jpg
                : `/assets/images/characters/jpg/monsters/m${monsterID}.jpg`
            }
            alt="Monster Image"
            loading="lazy"
            onLoad={handleImageLoaded}
          />
          {loaded === false && (
            <React.Fragment>
              <Skeleton variant="rectangular" width="100%" height="350px" />
              <Skeleton />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </React.Fragment>
          )}
        </>
      )}
      <Grid
        container
        sx={
          monsterID === 25
            ? {
                position: "absolute",
                bottom: "0px",
                color: "white",
                fontWeight: "bold",
                justifyContent: "space-around",
                background: "#333",
                paddingTop: 1,
                paddingBottom: 1,
              }
            : {
                position: "absolute",
                bottom: "15px",
                color: "white",
                fontWeight: "bold",
                justifyContent: "space-around",
              }
        }
        alignItems="unset"
        columns={60}
      >
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {Number(percent) + Number(bonus)}%{" "}
            <LanguageTranslate translateKey="toWin" />
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {formatNumber(BLSTReward.toFixed(2))} $BLST
          </Typography>
          <Typography
            sx={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}
          >
            (= {formatNumber(BUSDReward)} USD)
          </Typography>
        </Grid>
        <Grid item>
          {monsterID === 1 ? (
            <Tutorial
              curStep={18}
              placement="bottom-end"
              isHuntable={isHuntable}
            >
              <Button
                variant="outlined"
                disabled={!isHuntable}
                onClick={() => handleInitialHunt()}
                id="hunt-monster1"
              >
                <LanguageTranslate translateKey="hunt" />
              </Button>
            </Tutorial>
          ) : (
            <Button
              variant="outlined"
              disabled={
                monsterID === 25
                  ? !isHuntable || !canHuntMonster25
                  : !isHuntable
              }
              onClick={() => handleInitialHunt()}
            >
              <LanguageTranslate translateKey="hunt" />
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default MonsterCard;
