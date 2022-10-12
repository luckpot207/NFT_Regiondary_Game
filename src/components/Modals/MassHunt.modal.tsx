import {
  Box,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getInventory, getUserInfo } from "../../helpers/basicInfo";
import { checkHuntPending, checkMassHuntPending } from "../../helpers/hunt";
import { getAllLegionsAct } from "../../helpers/legion";
import {
  gameState,
  initMassHuntResult,
  setMassHuntResult,
  updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { formatNumber, toCapitalize } from "../../utils/utils";
import {
  getBUSDBalance,
  getLegionBUSDAllowance,
  getWalletHuntPendingLegionId,
  getWalletHuntPendingMonsterId,
  revealHunt,
  revealMassHunt,
  setBUSDApprove,
} from "../../web3hooks/contractFunctions";
import { getLegionAddress } from "../../web3hooks/getAddress";
import {
  useBeast,
  useBloodstone,
  useBUSD,
  useFeeHandler,
  useLegion,
  useLegionEvent,
  useRewardPool,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import LanguageTranslate from "../UI/LanguageTranslate";

const useStyles = makeStyles(() => ({
  MassHuntItemLose: {
    boxShadow:
      "rgb(0 0 0 / 37%) 0px 2px 4px 0px, rgb(14 30 37 / 85%) 0px 2px 16px 0px",
    borderRadius: 5,
    background: "#630000",
  },
  MassHuntItemWin: {
    boxShadow:
      "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    animation: `$Flash linear 2s infinite`,
    borderRadius: 5,
    background: "#074900",
  },
}));

const MassHuntModal: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    showAnimation,
    initialMassHuntLoading,
    revealMassHuntLoading,
    massHuntPending,
    massHuntVRFPending,
    massHuntResult,
    allMonsters,
    allLegions,
    huntTax,
    itemnames,
    presentItem,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const busdContract = useBUSD();
  const bloodstoneContract = useBloodstone();
  const rewardpoolContract = useRewardPool();
  const feehandlerContract = useFeeHandler();

  // States
  const [massHuntFinished, setMassHuntFinished] = useState(false);
  const classes = useStyles();

  // Functions
  const checkMassHuntBUSD = () => {
    let total = 0;
    if (
      allMonsters.length > 0 &&
      allLegions.filter((item) => item.huntStatus === true).length > 0
    ) {
      allLegions
        .filter((legion) => legion.huntStatus === true)
        .forEach((legion) => {
          let availableMonsters = allMonsters.filter(
            (monster) => monster.attackPower <= legion.attackPower
          );
          let lastMonster = availableMonsters[availableMonsters.length - 1];
          console.log(lastMonster);
          total += (Number(lastMonster.BUSDReward) * Number(huntTax)) / 100;
        });
    }
    return total;
  };

  const handleRevealMassHunt = async () => {
    try {
      dispatch(updateState({ revealMassHuntLoading: true }));
      dispatch(initMassHuntResult());
      const BUSD = await getBUSDBalance(web3, busdContract, account);
      const payBUSD = checkMassHuntBUSD();
      if (BUSD >= payBUSD) {
        const allowance = await getLegionBUSDAllowance(
          web3,
          busdContract,
          getLegionAddress(),
          account
        );
        if (allowance < payBUSD) {
          await setBUSDApprove(web3, busdContract, getLegionAddress(), account);
        }
        let huntResult = await revealMassHunt(legionContract, account);
        console.log(huntResult);
        const events = huntResult.events["Hunted"];
        console.log(events);
        console.log(typeof events);
        console.log(events.length);
        if (events.length) {
          events.forEach((event: any) => {
            if (
              account == event.returnValues.addr &&
              massHuntResult.filter(
                (item: any) => item.legionId == event.returnValues.legionId
              ).length == 0
            ) {
              let huntResult = {
                legionId: event.returnValues.legionId,
                monsterId: event.returnValues.monsterId,
                roll: event.returnValues.roll,
                success: event.returnValues.success,
                legionName: event.returnValues.name,
                reward: (event.returnValues.reward / Math.pow(10, 18)).toFixed(
                  2
                ),
              };
              dispatch(setMassHuntResult(huntResult));
            }
          });
        } else {
          if (
            account == events.returnValues.addr &&
            massHuntResult.filter(
              (item: any) => item.legionId == events.returnValues.legionId
            ).length == 0
          ) {
            let huntResult = {
              legionId: events.returnValues.legionId,
              monsterId: events.returnValues.monsterId,
              roll: events.returnValues.roll,
              success: events.returnValues.success,
              legionName: events.returnValues.name,
              reward: (events.returnValues.reward / Math.pow(10, 18)).toFixed(
                2
              ),
            };
            dispatch(setMassHuntResult(huntResult));
          }
        }
        checkMassHuntPending(dispatch, account, legionContract);
        getAllLegionsAct(dispatch, account, legionContract);
        getUserInfo(
          dispatch,
          web3,
          account,
          bloodstoneContract,
          rewardpoolContract,
          feehandlerContract
        );
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
        setMassHuntFinished(true);
      } else {
        toast.error(<LanguageTranslate translateKey="addBUSD" />);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ revealMassHuntLoading: false }));
  };

  const getMaxRoll = (legionId: string, monsterId: string) => {
    console.log(legionId, monsterId);
    console.log(allLegions, allMonsters);
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
        return 89;
      } else {
        return Number(percent) + bonusPercent;
      }
    } else {
      return Number(percent);
    }
  };

  return (
    <Dialog
      open={
        initialMassHuntLoading.valueOf() ||
        revealMassHuntLoading.valueOf() ||
        massHuntPending.valueOf() ||
        massHuntFinished
      }
    >
      {massHuntPending ? (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            <LanguageTranslate translateKey="massHunt" />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
              <FireBtn
                loading={
                  revealMassHuntLoading.valueOf() ||
                  massHuntVRFPending.valueOf()
                }
                onClick={() => handleRevealMassHunt()}
              >
                <LanguageTranslate translateKey="revealResult" />
              </FireBtn>
            </Box>
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
      ) : massHuntFinished ? (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            <LanguageTranslate translateKey="massHuntResult" />
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                p: 1,
                display: "flex",
                flexWrap: "wrap",
                maxHeight: 500,
                overflowY: "auto",
                justifyContent: "space-around",
              }}
            >
              {massHuntResult.map((item: any, index: any) => (
                <Box
                  key={index}
                  className={
                    item.success
                      ? classes.MassHuntItemWin
                      : classes.MassHuntItemLose
                  }
                  sx={{ textAlign: "center", margin: 1, width: 170, p: 1 }}
                >
                  {item.success ? (
                    showAnimation ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `
                      <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                        <source src=${
                          item["monsterId"] === 25
                            ? presentItem.diedmp4
                            : item["monsterId"] === 24
                            ? `/monster_dying_end/m24end.mp4`
                            : `/assets/images/characters/mp4/monsters_dying/m${item["monsterId"]}.mp4`
                        } type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>
                  `,
                        }}
                      />
                    ) : (
                      <img
                        src={
                          item["monsterId"] == 25
                            ? presentItem.diedjpg
                            : item["monsterId"] == 24
                            ? `/monster_dying_end/m24end.jpg`
                            : `/assets/images/characters/jpg/monsters_dying/m${item["monsterId"]}.jpg`
                        }
                        style={{ width: "100%" }}
                      />
                    )
                  ) : showAnimation ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                            <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                              <source src=${
                                item["monsterId"] === 25
                                  ? presentItem.mp4
                                  : `/assets/images/characters/mp4/monsters/m${item["monsterId"]}.mp4`
                              } type="video/mp4" />
                              Your browser does not support HTML5 video.
                            </video>
                        `,
                      }}
                    />
                  ) : (
                    <img
                      src={
                        item["monsterId"] === 25
                          ? presentItem.jpg
                          : `/assets/images/characters/jpg/monsters/m${item["monsterId"]}.jpg`
                      }
                      style={{ width: "100%" }}
                    />
                  )}
                  <Box sx={{ p: 1, wordBreak: "break-word" }}>
                    {item.legionName}
                  </Box>
                  <Box sx={{ fontSize: 12 }}>
                    <span style={{ fontWeight: "bold" }}>
                      #{item.monsterId}{" "}
                      {toCapitalize(
                        itemnames.find(
                          (itemname) =>
                            itemname.type === "monster" &&
                            itemname.number === parseInt(item.monsterId)
                        )?.name
                      )}
                    </span>
                  </Box>
                  <Box sx={{ fontSize: 12 }}>
                    <span>
                      <LanguageTranslate translateKey="maxRoll" />:{" "}
                      {getMaxRoll(item.legionId, item.monsterId)}
                    </span>
                  </Box>
                  <Box sx={{ fontSize: 12 }}>
                    <span>
                      <LanguageTranslate translateKey="yourRoll" />: {item.roll}
                    </span>
                  </Box>
                  <Box sx={{ p: 1, fontSize: 12, fontWeight: "bold" }}>
                    {item.success ? (
                      <span>
                        <LanguageTranslate translateKey="won" /> {item.reward}{" "}
                        $BUSD
                      </span>
                    ) : (
                      <span>
                        <LanguageTranslate translateKey="lost" />
                      </span>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 1, textAlign: "center" }}>
              <FireBtn onClick={() => setMassHuntFinished(false)}>
                Continue
              </FireBtn>
            </Box>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            <LanguageTranslate translateKey="massHunt" />
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

export default MassHuntModal;
