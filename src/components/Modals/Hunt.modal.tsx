import React, { useEffect, useState } from "react";
import {
  Box,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppSelector } from "../../store";
import { formatNumber, getTranslation } from "../../utils/utils";
import { getLegionAddress } from "../../web3hooks/getAddress";
import {
  useBeast,
  useBloodstone,
  useBUSD,
  useFeeHandler,
  useLegion,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { legionState, updateLegionState } from "../../reducers/legion.reducer";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import { monsterState } from "../../reducers/monster.reducer";
import {
  getWalletHuntPendingLegionId,
  getWalletHuntPendingMonsterId,
  revealHunt,
} from "../../web3hooks/contractFunctions/legion.contract";
import {
  getBUSDBalance,
  getLegionBUSDAllowance,
  setBUSDApprove,
} from "../../web3hooks/contractFunctions/busd.contract";
import HuntService from "../../services/hunt.service";
import LegionService from "../../services/legion.service";
import gameConfig from "../../config/game.config";
import constants from "../../constants";
import { IMonsterId } from "../../types/monster.type";
import VideoNFT from "../UI/VideoNFT";

const HuntModal: React.FC = () => {
  const dispatch = useDispatch();
  const {
    allLegions,
    initialHuntLoading,
    huntVRFPending,
    revealHuntLoading,
    huntPending,
    huntingLegionId,
    huntingMonsterId,
  } = AppSelector(legionState);
  const { allMonsters } = AppSelector(monsterState);
  const { huntTax, presentItem, showAnimation } = AppSelector(commonState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const legionContract = useLegion();
  const busdContract = useBUSD();

  const [huntFinished, setHuntFinished] = useState(false);
  const [huntResult, setHuntResult] = useState<any>({});
  const [maxRoll, setMaxRoll] = useState(0);

  useEffect(() => {
    getBalance();
  }, [huntPending]);

  const getBalance = async () => {
    try {
      const huntingMonsterId = await getWalletHuntPendingMonsterId(
        legionContract,
        account
      );
      const huntingLegionId = await getWalletHuntPendingLegionId(
        legionContract,
        account
      );
      dispatch(updateLegionState({ huntingLegionId, huntingMonsterId }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = () => {
    setHuntFinished(false);
  };

  const handleRevealHunt = async () => {
    try {
      dispatch(updateLegionState({ revealHuntLoading: true }));
      const BUSD = await getBUSDBalance(web3, busdContract, account);
      console.log(BUSD);
      console.log(huntTax);
      console.log(
        (Number(allMonsters[Number(huntingMonsterId) - 1]?.BUSDReward) *
          Number(huntTax)) /
          100
      );
      if (
        Number(BUSD) >=
        (Number(allMonsters[Number(huntingMonsterId) - 1]?.BUSDReward) *
          Number(huntTax)) /
          100
      ) {
        const allowance = await getLegionBUSDAllowance(
          web3,
          busdContract,
          getLegionAddress(),
          account
        );
        if (
          Number(allowance) <
          (Number(allMonsters[Number(huntingMonsterId) - 1]?.BUSDReward) *
            Number(huntTax)) /
            100
        ) {
          await setBUSDApprove(web3, busdContract, getLegionAddress(), account);
        }
        let huntResult = await revealHunt(legionContract, account);
        const result = huntResult.events["Hunted"].returnValues;
        console.log("hunting Result", result);
        HuntService.checkHuntPending(dispatch, account, legionContract);
        LegionService.getAllLegionsAct(dispatch, account, legionContract);
        dispatch(updateCommonState({ reloadStatusTime: new Date().getTime() }));
        setMaxRoll(0);
        await setHuntResult(result);
        getMaxRoll(huntingLegionId.toString(), huntingMonsterId.toString());
        setHuntFinished(true);
      } else {
        toast.error(getTranslation("addBUSD"));
      }
    } catch (error) {
      toast.error(getTranslation("huntTransactionFailed"));
    }
    dispatch(updateLegionState({ revealHuntLoading: false }));
  };

  const getShareLink = (social: string) => {
    const serverLink = gameConfig.gameSiteUrl;
    const shareImgUrl =
      huntResult["monsterId"] == 25
        ? presentItem.diedmp4
        : huntResult["monsterId"] == 24
        ? `${serverLink}/monster_dying_end/m24end.mp4`
        : `${serverLink}/assets/images/characters/mp4/monsters_dying/m${huntResult["monsterId"]}.mp4`;
    const text =
      allMonsters[parseInt(huntResult["monsterId"]) - 1] &&
      `I just won ${formatNumber(
        allMonsters[parseInt(huntResult["monsterId"]) - 1].BLSTReward.toFixed(2)
      )} ${getTranslation("blst")} (= ${formatNumber(
        allMonsters[parseInt(huntResult["monsterId"]) - 1].BUSDReward.toFixed(2)
      )} USD) from the ${
        gameConfig.gameMonsterName
      } ${constants.itemNames.monsters[
        huntResult["monsterId"] as IMonsterId
      ]?.toUpperCase()} in the ${gameConfig.gameLongName}! Play #${
        gameConfig.gameShortName
      } here: ${gameConfig.gameSiteUrl}`;
    const mainLink = `url=${encodeURI(shareImgUrl)}&text=${encodeURI(text)}`;
    const telegramShareLink = `https://xn--r1a.link/share/url?${mainLink}`;
    const twitterShareLink = `https://twitter.com/intent/tweet?${mainLink}`;
    return social == "telegram"
      ? telegramShareLink.replace("#", "%23")
      : twitterShareLink.replace("#", "%23");
  };

  const getMaxRoll = (legionId: string, monsterId: string) => {
    console.log(legionId, monsterId);
    console.log(allLegions, allMonsters);
    if (legionId !== "0" && monsterId !== "0") {
      const legion = allLegions.filter((legion) => legion.id === legionId)[0];
      const monster = allMonsters[parseInt(monsterId) - 1];
      console.log(legion, monster);
      const { attackPower: legionAttackPower } = legion;
      const { attackPower: monsterAttackPower, percent } = monster;

      if (parseFloat(monsterId) < 21) {
        const bonusPercent = Math.floor(
          (Number(legionAttackPower) - Number(monsterAttackPower)) / 2000
        );
        if (Number(percent) + bonusPercent > 89) {
          setMaxRoll(89);
        } else {
          setMaxRoll(Number(percent) + bonusPercent);
        }
      } else {
        setMaxRoll(Number(percent));
      }
    }
  };

  return (
    <Dialog
      open={
        initialHuntLoading.valueOf() ||
        revealHuntLoading.valueOf() ||
        huntPending.valueOf() ||
        huntFinished
      }
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      {huntFinished ? (
        huntResult["success"] ? (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <>
                <Box component="p">{getTranslation("congratulation")}</Box>
                <Typography>{getTranslation("congSubtitle1")}</Typography>
                <Box component="p">
                  {getTranslation("congSubtitle2")}{" "}
                  {allMonsters[
                    parseInt(huntResult["monsterId"]) - 1
                  ].BLSTReward.toFixed(2)}{" "}
                  ${getTranslation("blst")}
                </Box>
                <Box>
                  <Box sx={{ fontWeight: "bold" }}>
                    {getTranslation("shareYourSuccess")}
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                  >
                    <a href={getShareLink("telegram")} target={"_blank"}>
                      <img
                        src={`/assets/images/telegram.png`}
                        style={{
                          width: "40px",
                          height: "40px",
                          marginRight: "30px",
                        }}
                        alt="icon"
                      />
                    </a>
                    <a href={getShareLink("twitter")} target={"_blank"}>
                      <img
                        src={`/assets/images/twitter.png`}
                        style={{
                          width: "40px",
                          height: "40px",
                          marginLeft: "30px",
                        }}
                        alt="icon"
                      />
                    </a>
                  </Box>
                </Box>
              </>
            </DialogTitle>
            <DialogContent>
              <Box component="div" sx={{ position: "relative" }}>
                {showAnimation ? (
                  <VideoNFT
                    src={
                      huntResult["monsterId"] === 25
                        ? presentItem.diedmp4
                        : huntResult["monsterId"] === 24
                        ? `/monster_dying_end/m24end.mp4`
                        : `/assets/images/characters/mp4/monsters_dying/m${huntResult["monsterId"]}.mp4`
                    }
                  />
                ) : (
                  <CardMedia
                    component="img"
                    image={
                      huntResult["monsterId"] == 25
                        ? presentItem.diedjpg
                        : huntResult["monsterId"] == 24
                        ? `/monster_dying_end/m24end.jpg`
                        : `/assets/images/characters/jpg/monsters_dying/m${huntResult["monsterId"]}.jpg`
                    }
                    alt="Monster Image"
                    loading="lazy"
                  />
                )}
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
              }}
            >
              <Box component="div" sx={{ marginRight: 1 }}>
                <Typography>
                  {getTranslation("yourRollTitle")} {huntResult["roll"]}
                </Typography>
                <Typography>
                  {getTranslation("congSubtitle3")} {maxRoll}
                </Typography>
              </Box>
              <FireBtn
                sx={{ paddingX: 3, fontWeight: "bold" }}
                onClick={() => handleContinue()}
              >
                {getTranslation("continue")}
              </FireBtn>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <>
                <Box component="p">{getTranslation("defeatTitle")}</Box>
                {getTranslation("defeatSubtitle1")}
              </>
            </DialogTitle>
            <DialogContent>
              <Box component="div" sx={{ position: "relative" }}>
                <VideoNFT src="/assets/images/loosing.mp4" />
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
              }}
            >
              <Box component="div" sx={{ marginRight: 1 }}>
                <Typography>
                  {getTranslation("yourRollTitle")} {huntResult["roll"]}
                </Typography>
                <Typography>
                  {getTranslation("defeatSubtitle2")} {maxRoll}
                </Typography>
              </Box>
              <FireBtn
                sx={{ paddingX: 3, fontWeight: "bold" }}
                onClick={() => handleContinue()}
              >
                {getTranslation("continue")}
              </FireBtn>
            </DialogActions>
          </>
        )
      ) : (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            <Box component="p">{getTranslation("huntTime")}</Box>
            {getTranslation("huntTimeSubtitle")}
            <Box component="p">
              #{huntingMonsterId}{" "}
              {constants.itemNames.monsters[
                huntingMonsterId as IMonsterId
              ]?.toUpperCase()}
            </Box>
            {huntPending && (
              <FireBtn
                onClick={() => handleRevealHunt()}
                loading={
                  revealHuntLoading.valueOf() || huntVRFPending.valueOf()
                }
              >
                {getTranslation("revealResult")}
              </FireBtn>
            )}
          </DialogTitle>
          <DialogContent>
            <VideoNFT src="/assets/images/waiting.mp4" />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default HuntModal;
