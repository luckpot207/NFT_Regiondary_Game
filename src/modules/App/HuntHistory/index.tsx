import {
  Box,
  Card,
  Grid,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";

import { useMoralisQuery, useMoralis } from "react-moralis";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { toCapitalize } from "../../../utils/utils";
import { useWeb3 } from "../../../web3hooks/useContract";
import moment from "moment";
import Paper from "@mui/material/Paper";
import gameVersion from "../../../constants/gameVersion";

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
  // const { Moralis } = useMoralis();
  // Moralis.masterKey = gameVersion.moralisMasterKey;
  // let huntHistoryQuery = new Moralis.Query("HuntHistory");

  // const { showAnimation, presentItem, itemnames, allMonsters } =
  //   AppSelector(gameState);
  // const classes = useStyles();
  // const web3 = useWeb3();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(12);

  // const [totalCount, setTotalCount] = useState(0);
  // const [totalWon, setTotalWon] = useState("0");
  // const [totalLost, setTotalLost] = useState("0");
  // const [huntHistory, setHuntHistory] = useState<any>([]);
  // const [accuracy, setAccuracy] = useState<any>([]);

  // const getBalance = async () => {
  //   try {
  //     const totalCountPipeLine = [
  //       {
  //         match: {
  //           addr: { $eq: account?.toLowerCase() },
  //         },
  //       },
  //       {
  //         count: "totalCount",
  //       },
  //     ];
  //     const totalCount = await huntHistoryQuery.aggregate(totalCountPipeLine);
  //     console.log("total Count: ", totalCount);
  //     setTotalCount(totalCount[0].totalCount);
  //     const totalSumPipLine = [
  //       {
  //         match: {
  //           addr: { $eq: account?.toLowerCase() },
  //         },
  //       },
  //       {
  //         group: {
  //           objectId: "$success",
  //           totalSum: {
  //             $sum: "$reward_decimal",
  //           },
  //         },
  //       },
  //     ];
  //     const totalSum = await huntHistoryQuery.aggregate(totalSumPipLine);
  //     totalSum.forEach((item: any) => {
  //       if (item.objectId) {
  //         setTotalWon(web3.utils.fromWei(item.totalSum, "ether"));
  //       } else {
  //         setTotalLost(web3.utils.fromWei(item.totalSum, "ether"));
  //       }
  //     });
  //     console.log("total won: ", totalWon);
  //     getPage(1);
  //     getAccuracy();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getAccuracy = async () => {
  //   try {
  //     const accuracyPipeLine = [
  //       {
  //         match: {
  //           addr: { $eq: account?.toLowerCase() },
  //         },
  //       },
  //       {
  //         group: {
  //           objectId: "$monsterId",
  //           totalHunts: {
  //             $sum: 1,
  //           },
  //           winHunts: {
  //             $sum: "$success" ? 1 : 0,
  //           },
  //           lostHunts: {
  //             $sum: "$success" ? 0 : 1,
  //           },
  //           result: {
  //             $push: "$success",
  //           },
  //         },
  //       },
  //     ];
  //     const accuracy = await huntHistoryQuery.aggregate(accuracyPipeLine);
  //     let temp = [];
  //     const getDesc = (totalHunts: number) => {
  //       if (totalHunts < 30) {
  //         return "No data";
  //       } else if (totalHunts < 50) {
  //         return "Very low";
  //       } else if (totalHunts < 100) {
  //         return "Medium";
  //       } else {
  //         return "High";
  //       }
  //     };

  //     for (let i = 0; i < 24; i++) {
  //       let eachAccuracyInfo = accuracy.find(
  //         (item: any) => item.objectId == i + 1
  //       );
  //       let monsterAccuracy = {
  //         id: i + 1,
  //         winPercent: eachAccuracyInfo
  //           ? Math.floor(
  //               (eachAccuracyInfo.winHunts / eachAccuracyInfo.totalHunts) * 100
  //             ) + "%"
  //           : "-",
  //         totalHunts: eachAccuracyInfo ? eachAccuracyInfo.totalHunts : 0,
  //         desc: getDesc(eachAccuracyInfo ? eachAccuracyInfo.totalHunts : 0),
  //       };
  //       temp.push(monsterAccuracy);
  //     }
  //     setAccuracy(temp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getPage = async (currentPage: number) => {
  //   try {
  //     let temp: any = [];
  //     huntHistoryQuery.equalTo("addr", account?.toLowerCase());
  //     huntHistoryQuery.descending("block_number");
  //     huntHistoryQuery.skip((currentPage - 1) * pageSize);
  //     huntHistoryQuery.limit(pageSize);
  //     const huntHistory = await huntHistoryQuery.find();
  //     huntHistory.forEach((item) => {
  //       temp.push(item.attributes);
  //     });
  //     console.log("hunt history aggregate: ", temp);
  //     setHuntHistory(temp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handlePage = (
  //   event: React.ChangeEvent<unknown>,
  //   currentPage: number
  // ) => {
  //   setCurrentPage(currentPage);
  //   getPage(currentPage);
  // };

  useEffect(() => {
    // getBalance();
  }, []);

  return (
    <Card
      className="bg-c4"
      sx={{
        p: 4,
      }}
    >
      <Typography variant="h3" fontWeight={"bold"}>
        Coming Soon
      </Typography>
      {/* <Typography variant="h3" fontWeight={"bold"}>
        <LanguageTranslate translateKey="huntHistory" />
      </Typography>
      <Box>
        <Box>
          <Typography>Total Won: {totalWon} BUSD</Typography>
          <Typography>Total Lost: {totalLost} BUSD</Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Accuracy</Typography>
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Monster</TableCell>
                    <TableCell>Your win %</TableCell>
                    <TableCell># of Hunts</TableCell>
                    <TableCell>Accuracy of %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accuracy.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>Monster #{row.id}</TableCell>
                      <TableCell>{row.winPercent}</TableCell>
                      <TableCell>{row.totalHunts}</TableCell>
                      <TableCell>{row.desc}</TableCell>
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
                  {moment(item.block_timestamp).format("YYYY-MM-DD hh:mm:ss")}
                </Box>
                <Box sx={{ p: 1, wordBreak: "break-word" }}>{item.name}</Box>
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
                    <LanguageTranslate translateKey="baseRoll" />:{" "}
                    {
                      allMonsters.find((monter) => monter.id == item.monsterId)
                        ?.percent
                    }
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
                      <LanguageTranslate translateKey="won" />{" "}
                      {web3.utils.fromWei(item.reward, "ether")} $BUSD
                    </span>
                  ) : (
                    <span>
                      <LanguageTranslate translateKey="lost" />
                    </span>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box>
          <Pagination
            count={Math.ceil(totalCount / Number(pageSize))}
            showFirstButton
            showLastButton
            color="primary"
            page={currentPage.valueOf()}
            onChange={handlePage}
          />
        </Box>
      </Box> */}
    </Card>
  );
};

export default HuntHistory;
