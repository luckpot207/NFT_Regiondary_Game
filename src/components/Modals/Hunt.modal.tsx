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
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUserInfo } from "../../helpers/basicInfo";
import { checkHuntPending } from "../../helpers/hunt";
import { getAllLegionsAct } from "../../helpers/legion";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { formatNumber } from "../../utils/utils";
import {
  getBUSDBalance,
  getLegionBUSDAllowance,
  getWalletHuntPendingLegionId,
  getWalletHuntPendingMonsterId,
  revealHunt,
  setBUSDApprove,
} from "../../web3hooks/contractFunctions";
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
import LanguageTranslate from "../UI/LanguageTranslate";

const HuntModal: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    initialHuntLoading,
    huntVRFPending,
    revealHuntLoading,
    huntPending,
    huntTax,
    allMonsters,
    huntingLegionId,
    huntingMonsterId,
    showAnimation,
    huntingSuccessPercent,
    presentItem,
    itemnames,
    allLegions,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const legionContract = useLegion();
  const busdContract = useBUSD();
  const bloodstoneContract = useBloodstone();
  const rewardpoolContract = useRewardPool();
  const feehandlerContract = useFeeHandler();

  // States
  const [huntFinished, setHuntFinished] = useState(false);
  const [huntResult, setHuntResult] = useState<any>({});
  const [maxRoll, setMaxRoll] = useState(0);

  // Functions
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
      dispatch(updateState({ huntingLegionId, huntingMonsterId }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = () => {
    setHuntFinished(false);
  };

  const handleRevealHunt = async () => {
    try {
      dispatch(updateState({ revealHuntLoading: true }));
      const BUSD = await getBUSDBalance(web3, busdContract, account);
      console.log(BUSD);
      console.log(huntTax);
      console.log(
        (Number(allMonsters[Number(huntingMonsterId) - 1]?.BUSDReward) *
          Number(huntTax)) /
          100
      );
      if (
        BUSD >=
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
        checkHuntPending(dispatch, account, legionContract);
        getAllLegionsAct(dispatch, account, legionContract);
        getUserInfo(
          dispatch,
          web3,
          account,
          bloodstoneContract,
          rewardpoolContract,
          feehandlerContract
        );
        setMaxRoll(0);
        await setHuntResult(result);
        getMaxRoll(huntingLegionId.toString(), huntingMonsterId.toString());
        setHuntFinished(true);
      } else {
        toast.error(<LanguageTranslate translateKey="addBUSD" />);
      }
    } catch (error) {
      toast.error(<LanguageTranslate translateKey="huntTransactionFailed" />);
    }
    dispatch(updateState({ revealHuntLoading: false }));
  };

  const getShareLink = (social: string) => {
    const serverLink = "https://play.cryptolegions.app";
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
      )} $BLST (= ${formatNumber(
        allMonsters[parseInt(huntResult["monsterId"]) - 1].BUSDReward.toFixed(2)
      )} USD) from Monster ${itemnames
        .find(
          (item) =>
            item.type === "monster" &&
            item.number === parseInt(huntResult["monsterId"])
        )
        ?.name.toUpperCase()} in Crypto Legions! Play #CryptoLegions here: https://cryptolegions.app`;
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
      let bonus = 0;
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

  // Use Effect
  useEffect(() => {
    getBalance();
  }, [huntPending]);

  return (
    <Dialog
      open={
        initialHuntLoading.valueOf() ||
        revealHuntLoading.valueOf() ||
        huntPending.valueOf() ||
        huntFinished
      }
    >
      {huntFinished ? (
        huntResult["success"] ? (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <>
                <Box component="p">
                  <LanguageTranslate translateKey="congratulation" />
                </Box>
                <Typography>
                  <LanguageTranslate translateKey="congSubtitle1" />
                </Typography>
                <Box component="p">
                  <LanguageTranslate translateKey="congSubtitle2" />{" "}
                  {allMonsters[
                    parseInt(huntResult["monsterId"]) - 1
                  ].BLSTReward.toFixed(2)}{" "}
                  $BLST
                </Box>
                <Box>
                  <Box sx={{ fontWeight: "bold" }}>
                    <LanguageTranslate translateKey="shareYourSuccess" />
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `
                        <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                          <source src=${
                            huntResult["monsterId"] === 25
                              ? presentItem.diedmp4
                              : huntResult["monsterId"] === 24
                              ? `/monster_dying_end/m24end.mp4`
                              : `/assets/images/characters/mp4/monsters_dying/m${huntResult["monsterId"]}.mp4`
                          } type="video/mp4" />
                          Your browser does not support HTML5 video.
                        </video>
                    `,
                    }}
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
                  <LanguageTranslate translateKey="yourRollTitle" />{" "}
                  {huntResult["roll"]}
                </Typography>
                <Typography>
                  <LanguageTranslate translateKey="congSubtitle3" /> {maxRoll}
                </Typography>
              </Box>
              <FireBtn
                sx={{ paddingX: 3, fontWeight: "bold" }}
                onClick={() => handleContinue()}
              >
                <LanguageTranslate translateKey="continue" />
              </FireBtn>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              <>
                <Box component="p">
                  <LanguageTranslate translateKey="defeatTitle" />
                </Box>
                <LanguageTranslate translateKey="defeatSubtitle1" />
              </>
            </DialogTitle>
            <DialogContent>
              <Box component="div" sx={{ position: "relative" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                        <source src="/assets/images/loosing.mp4" type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>
                    `,
                  }}
                />
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
                  <LanguageTranslate translateKey="yourRollTitle" />{" "}
                  {huntResult["roll"]}
                </Typography>
                <Typography>
                  <LanguageTranslate translateKey="defeatSubtitle2" /> {maxRoll}
                </Typography>
              </Box>
              <FireBtn
                sx={{ paddingX: 3, fontWeight: "bold" }}
                onClick={() => handleContinue()}
              >
                <LanguageTranslate translateKey="continue" />
              </FireBtn>
            </DialogActions>
          </>
        )
      ) : (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            <Box component="p">
              <LanguageTranslate translateKey="huntTime" />
            </Box>
            <LanguageTranslate translateKey="huntTimeSubtitle" />
            <Box component="p">
              #{huntingMonsterId}{" "}
              {
                itemnames.find(
                  (item) =>
                    item.type === "monster" && item.number == huntingMonsterId
                )?.name
              }
              {allMonsters[Number(huntingMonsterId) - 1]?.name.toUpperCase()}
            </Box>
            {huntPending && (
              <FireBtn
                onClick={() => handleRevealHunt()}
                loading={
                  revealHuntLoading.valueOf() || huntVRFPending.valueOf()
                }
              >
                <LanguageTranslate translateKey="revealResult" />
              </FireBtn>
            )}
          </DialogTitle>
          <DialogContent>
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                    <source src="/assets/images/waiting.mp4" type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
                `,
              }}
            />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default HuntModal;
