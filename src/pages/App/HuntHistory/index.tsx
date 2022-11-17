import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import Paper from "@mui/material/Paper";

import { AppSelector } from "../../../store";
import { getTranslation, toCapitalize } from "../../../utils/utils";
import { useWeb3 } from "../../../web3hooks/useContract";
import Axios from "axios";
import { monsterState } from "../../../reducers/monster.reducer";
import { commonState } from "../../../reducers/common.reduer";
import { apiConfig } from "../../../config/api.config";
import constants from "../../../constants";
import { IMonsterId } from "../../../types/monster.type";
import VideoNFT from "../../../components/UI/VideoNFT";

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
  "@keyframes Flash": {
    "0%": {
      boxShadow:
        "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
    "50%": {
      boxShadow:
        "rgb(247 247 247 / 30%) 0px 2px 4px 0px, rgb(217 221 206 / 40%) 0px 2px 16px 0px",
    },
    "100%": {
      boxShadow:
        "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
  },
}));

const HuntHistory: React.FC = () => {
  const { account } = useWeb3React();
  const { showAnimation, presentItem } = AppSelector(commonState);
  const { allMonsters } = AppSelector(monsterState);
  const classes = useStyles();
  const web3 = useWeb3();

  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [totalWon, setTotalWon] = useState("0");
  const [huntHistory, setHuntHistory] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<any[]>([]);

  const getHuntHistory = async () => {
    let temp: any[] = [];
    if (account) {
      try {
        while (true) {
          const query = `
            {
              user(id: ${`"` + account.toLowerCase() + `"`}) {
                huntHistory(
                  first: 1000
                  skip: ${temp.length}
                  orderBy: timestamp
                  orderDirection: desc
                ) {
                  name
                  legionId
                  monsterId
                  roll
                  success
                  reward
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
            break;
          }
          temp = [...temp, ...data];
        }
        setHuntHistory(temp);
      } catch (error) {}
    }
  };

  const getTotalWonAndLost = async () => {
    try {
      const query = `
        {
          user(id: ${`"` + account?.toLowerCase() + `"`}) {
            totalWon
          }
        }
      `;
      const graphRes = await Axios.post(apiConfig.subgraphServer, {
        query: query,
      });
      const userInfo = graphRes.data.data.user;
      setTotalWon(userInfo.totalWon);
    } catch (error) {}
  };

  const getAccuracy = async () => {
    let temp = [];
    for (let i = 1; i < 25; i++) {
      let itemInfo = {
        winPercent: "-",
        huntsCtn: 0,
        accuracy: "Not enough data",
      };
      let huntsCtn = huntHistory.filter(
        (item: any) => item.monsterId == i
      ).length;
      let winCtn = huntHistory.filter(
        (item: any) => item.monsterId == i && item.success
      ).length;
      let percent = Math.floor((winCtn / huntsCtn) * 100);
      if (huntsCtn >= 30 && huntsCtn < 50) {
        itemInfo.accuracy = "Very low";
        itemInfo.winPercent = `${percent}%`;
      } else if (huntsCtn >= 50 && huntsCtn < 100) {
        itemInfo.accuracy = "Low";
        itemInfo.winPercent = `${percent}%`;
      } else if (huntsCtn >= 100 && huntsCtn < 200) {
        itemInfo.accuracy = "Medium";
        itemInfo.winPercent = `${percent}%`;
      } else if (huntsCtn >= 200) {
        itemInfo.accuracy = "High";
        itemInfo.winPercent = `${percent}%`;
      }
      itemInfo.huntsCtn = huntsCtn;
      temp.push(itemInfo);
    }
    setAccuracy(temp);
  };

  useEffect(() => {
    getHuntHistory();
    getTotalWonAndLost();
  }, []);

  useEffect(() => {
    getAccuracy();
  }, [huntHistory]);

  return (
    <Card
      className="bg-c4"
      sx={{
        p: 2,
        pt: isSmallerThanSM ? 6 : 4,
      }}
    >
      <Typography variant="h3" fontWeight={"bold"}>
        {getTranslation("huntHistory")}
      </Typography>
      <br />
      <Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>
            {getTranslation("totalWon")}:{" "}
            {web3.utils.fromWei(totalWon, "ether")} BUSD
          </Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" fontWeight={"bold"}>
            {getTranslation("accuracy")}
          </Typography>
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: isSmallerThanSM ? 1 : 2,
                      }}
                    >
                      {getTranslation("Monster")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: isSmallerThanSM ? 1 : 2,
                      }}
                    >
                      {isSmallerThanSM
                        ? getTranslation("win") + " %"
                        : getTranslation("yourWinPercent")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: isSmallerThanSM ? 1 : 2,
                      }}
                    >
                      {isSmallerThanSM
                        ? getTranslation("hunts")
                        : getTranslation("sharpOfHunts")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: isSmallerThanSM ? 1 : 2,
                      }}
                    >
                      {isSmallerThanSM ? "Accuracy" : "Accuracy of %"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accuracy.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: isSmallerThanSM ? 1 : 2,
                        }}
                      >
                        {isSmallerThanSM
                          ? "#" + (index + 1)
                          : "Monster #" + (index + 1)}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: isSmallerThanSM ? 1 : 2,
                        }}
                      >
                        {row.winPercent}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: isSmallerThanSM ? 1 : 2,
                        }}
                      >
                        {row.huntsCtn}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: isSmallerThanSM ? 1 : 2,
                        }}
                      >
                        {row.accuracy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ my: 4 }}>
          {huntHistory.map((item: any, index: number) => (
            <Grid
              item
              xs={12}
              md={4}
              lg={2}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
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
                    <VideoNFT
                      src={
                        item["monsterId"] == 25
                          ? presentItem
                            ? presentItem.diedmp4
                            : ""
                          : item["monsterId"] == 24
                          ? `/monster_dying_end/m24end.mp4`
                          : `/assets/images/characters/mp4/monsters_dying/m${item["monsterId"]}.mp4`
                      }
                    />
                  ) : (
                    <img
                      src={
                        item["monsterId"] == 25
                          ? presentItem
                            ? presentItem.diedjpg
                            : ""
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
                      item["monsterId"] == 25
                        ? presentItem.mp4
                        : `/assets/images/characters/mp4/monsters/m${item["monsterId"]}.mp4`
                    }
                  />
                ) : (
                  <img
                    src={
                      item["monsterId"] == 25
                        ? presentItem.jpg
                        : `/assets/images/characters/jpg/monsters/m${item["monsterId"]}.jpg`
                    }
                    style={{ width: "100%" }}
                  />
                )}
                <Box sx={{ p: 1, wordBreak: "break-word" }}>
                  {moment(new Date(Number(item.timestamp) * 1000)).format(
                    "YYYY-MM-DD hh:mm:ss"
                  )}
                </Box>
                <Box sx={{ p: 1, wordBreak: "break-word" }}>{item.name}</Box>
                <Box sx={{ fontSize: 12 }}>
                  <span style={{ fontWeight: "bold" }}>
                    #{item.monsterId}{" "}
                    {toCapitalize(
                      constants.itemNames.monsters[item.monsterId as IMonsterId]
                    )}
                  </span>
                </Box>
                <Box sx={{ fontSize: 12 }}>
                  <span>
                    {getTranslation("baseRoll")}:{" "}
                    {
                      allMonsters.find((monter) => monter.id == item.monsterId)
                        ?.percent
                    }
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
                      {getTranslation("won")}{" "}
                      {web3.utils.fromWei(item.reward, "ether")} BUSD
                    </span>
                  ) : (
                    <span>{getTranslation("lost")}</span>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default HuntHistory;
