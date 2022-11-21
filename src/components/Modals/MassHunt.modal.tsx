import React, { useEffect, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppSelector } from "../../store";
import { getTranslation, toCapitalize } from "../../utils/utils";
import { getLegionAddress } from "../../web3hooks/getAddress";
import {
  useBeast,
  useBloodstone,
  useBUSD,
  useFeeHandler,
  useLegion,
  useRewardPool,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import {
  initMassHuntResult,
  legionState,
  setMassHuntResult,
  updateLegionState,
} from "../../reducers/legion.reducer";
import { monsterState } from "../../reducers/monster.reducer";
import {
  getBUSDBalance,
  getLegionBUSDAllowance,
  setBUSDApprove,
} from "../../web3hooks/contractFunctions/busd.contract";
import { revealMassHunt } from "../../web3hooks/contractFunctions/legion.contract";
import HuntService from "../../services/hunt.service";
import LegionService from "../../services/legion.service";
import constants from "../../constants";
import { IMonsterId } from "../../types/monster.type";
import { getBLSTAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import VideoNFT from "../UI/VideoNFT";

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

  const { showAnimation, presentItem, huntTax } = AppSelector(commonState);
  const {
    initialMassHuntLoading,
    revealMassHuntLoading,
    massHuntPending,
    massHuntVRFPending,
    massHuntResult,
    allLegions,
  } = AppSelector(legionState);
  const { allMonsters } = AppSelector(monsterState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const legionContract = useLegion();
  const busdContract = useBUSD();
  const feehandlerContract = useFeeHandler();

  const [massHuntFinished, setMassHuntFinished] = useState(false);
  const classes = useStyles();

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
      dispatch(updateLegionState({ revealMassHuntLoading: true }));
      dispatch(initMassHuntResult());
      const BUSD = await getBUSDBalance(web3, busdContract, account);
      const payBUSD = checkMassHuntBUSD();
      console.log("busd amount: ", BUSD);
      console.log("pay busd amount: ", payBUSD);
      if (Number(BUSD) >= Number(payBUSD)) {
        const allowance = await getLegionBUSDAllowance(
          web3,
          busdContract,
          getLegionAddress(),
          account
        );
        if (Number(allowance) < Number(payBUSD)) {
          await setBUSDApprove(web3, busdContract, getLegionAddress(), account);
        }
        let huntResult = await revealMassHunt(legionContract, account);
        const events = huntResult.events["Hunted"];
        if (events.length) {
          events.forEach(async (event: any) => {
            if (
              account == event.returnValues.addr &&
              massHuntResult.filter(
                (item: any) => item.legionId == event.returnValues.legionId
              ).length == 0
            ) {
              const blstReward = await getBLSTAmount(
                web3,
                feehandlerContract,
                web3.utils.fromWei(event.returnValues.reward, "ether")
              );
              let huntResult = {
                legionId: event.returnValues.legionId,
                monsterId: event.returnValues.monsterId,
                roll: event.returnValues.roll,
                success: event.returnValues.success,
                legionName: event.returnValues.name,
                reward: (event.returnValues.reward / Math.pow(10, 18)).toFixed(
                  2
                ),
                blstReward: Number(blstReward).toFixed(2),
              };
              dispatch(setMassHuntResult(huntResult));
              dispatch(setMassHuntResult(huntResult));
              dispatch(setMassHuntResult(huntResult));
              dispatch(setMassHuntResult(huntResult));
              dispatch(setMassHuntResult(huntResult));
              dispatch(setMassHuntResult(huntResult));
              dispatch(setMassHuntResult(huntResult));
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
            const blstReward = await getBLSTAmount(
              web3,
              feehandlerContract,
              web3.utils.fromWei(events.returnValues.reward, "ether")
            );
            let huntResult = {
              legionId: events.returnValues.legionId,
              monsterId: events.returnValues.monsterId,
              roll: events.returnValues.roll,
              success: events.returnValues.success,
              legionName: events.returnValues.name,
              reward: (events.returnValues.reward / Math.pow(10, 18)).toFixed(
                2
              ),
              blstReward: Number(blstReward).toFixed(2),
            };
            dispatch(setMassHuntResult(huntResult));
          }
        }
        HuntService.checkMassHuntPending(dispatch, account, legionContract);
        LegionService.getAllLegionsAct(dispatch, account, legionContract);
        dispatch(updateCommonState({ reloadStatusTime: new Date().getTime() }));
        setMassHuntFinished(true);
      } else {
        toast.error(getTranslation("addBUSD"));
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateLegionState({ revealMassHuntLoading: false }));
  };

  const getMaxRoll = (legionId: string, monsterId: string) => {
    const legion = allLegions.filter((legion) => legion.id === legionId)[0];
    const monster = allMonsters[parseInt(monsterId) - 1];
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
        initialMassHuntLoading ||
        revealMassHuntLoading ||
        massHuntPending ||
        massHuntFinished
      }
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
          maxWidth: "80%",
        },
      }}
    >
      {massHuntPending ? (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            {getTranslation("massHunt")}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
              <FireBtn
                loading={revealMassHuntLoading || massHuntVRFPending}
                onClick={() => handleRevealMassHunt()}
              >
                {getTranslation("revealResult")}
              </FireBtn>
            </Box>
            <VideoNFT src="/assets/images/waiting.mp4" />
          </DialogContent>
        </>
      ) : massHuntFinished ? (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            {getTranslation("massHuntResult")}
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
                  sx={{
                    textAlign: "center",
                    margin: 1,
                    width: 170,
                    p: 1,
                  }}
                >
                  {item.success ? (
                    showAnimation ? (
                      <VideoNFT
                        src={
                          item["monsterId"] === 25
                            ? presentItem.diedmp4
                            : item["monsterId"] === 24
                            ? `/monster_dying_end/m24end.mp4`
                            : `/assets/images/characters/mp4/monsters_dying/m${item["monsterId"]}.mp4`
                        }
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
                    <VideoNFT
                      src={
                        item["monsterId"] === 25
                          ? presentItem.mp4
                          : `/assets/images/characters/mp4/monsters/m${item["monsterId"]}.mp4`
                      }
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
                        constants.itemNames.monsters[
                          item.monsterId as IMonsterId
                        ]
                      )}
                    </span>
                  </Box>
                  <Box sx={{ fontSize: 12 }}>
                    <span>
                      {getTranslation("maxRoll")}:{" "}
                      {getMaxRoll(item.legionId, item.monsterId)}
                    </span>
                  </Box>
                  <Box sx={{ fontSize: 12 }}>
                    <span>
                      {getTranslation("yourRoll")}: {item.roll}
                    </span>
                  </Box>
                  <Box sx={{ p: 1, fontSize: 12, fontWeight: "bold" }}>
                    {item.success ? (
                      <span>
                        {getTranslation("won")} {item.blstReward} $
                        {getTranslation("blst")}
                      </span>
                    ) : (
                      <span>
                        {getTranslation("lost")} {item.blstReward} $
                        {getTranslation("blst")}
                      </span>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 1, textAlign: "center" }}>
              <FireBtn onClick={() => setMassHuntFinished(false)}>
                {getTranslation("continue")}
              </FireBtn>
            </Box>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle sx={{ textAlign: "center" }}>
            {getTranslation("massHunt")}
          </DialogTitle>
          <DialogContent>
            <VideoNFT src={"/assets/images/waiting.mp4"} />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default MassHuntModal;
