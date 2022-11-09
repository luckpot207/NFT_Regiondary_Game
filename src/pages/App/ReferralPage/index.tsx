import React, { useState, useEffect } from "react";
import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import Axios from "axios";

import { AppDispatch, AppSelector } from "../../../store";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import HomeTypo from "../../../components/UI/HomeTypo";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  useReferralSystem,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import { useDispatch } from "react-redux";
import ReferralTGModal from "../../../components/Modals/ReferralTG.modal";
import gameConfig from "../../../config/game.config";
import ReferralTable from "./ReferralStats";
import { commonState } from "../../../reducers/common.reduer";
import { legionState } from "../../../reducers/legion.reducer";
import { referralState } from "../../../reducers/referral.reducer";
import ReferralService from "../../../services/referral.service";
import { getFreeMintInfo } from "../../../web3hooks/contractFunctions/referral.contract";
import { apiConfig } from "../../../config/api.config";
import { updateModalState } from "../../../reducers/modal.reducer";

const oneDay = 1000 * 3600 * 24;
const ReferPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contactInfo } = AppSelector(commonState);
  const { allLegions } = AppSelector(legionState);
  const {
    referralStats: {
      referrals,
      layer1Comission,
      layer2Comission,
      layer1Count,
      layer2Count,
    },
  } = AppSelector(referralState);

  const web3 = useWeb3();
  const referralSystemContract = useReferralSystem();
  const warriorNFTContract = useWarrior();

  const isShowReferralLink = allLegions.find(
    (legion) => legion.attackPower >= 3000
  );
  const primaryColor = "#f66810";

  const { account } = useWeb3React();
  const [isCopied, setIsCopied] = useState(false);
  const referralLink = ReferralService.getReferralLink(account?.toString());
  const [freeWarriorsCnt, setFreeWarriorsCnt] = useState(0);
  const [referralEvents, setReferralEvents] = useState<any[]>([]);
  const [allTimeData, setAllTimeData] = useState<any[]>([]);
  const [thisWeekData, setThisWeekData] = useState<any[]>([]);
  const [pastWeekData, setPastWeekData] = useState<any[]>([]);

  const onClickCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      toast.success("Referral Link Copied");
    });
  };

  const getBalance = async () => {
    console.log(referrals);
    let tempCount = 0;
    for (let i = 0; i < referrals.length; i++) {
      const freeMintInfo = await getFreeMintInfo(
        warriorNFTContract,
        referrals[i].addr
      );
      if (freeMintInfo.claimed) {
        tempCount++;
      }
    }
    setFreeWarriorsCnt(tempCount);
  };

  const getAllReferralEvents = async () => {
    let referredEvents: any[] = [];
    let comissionEvents: any[] = [];

    while (true) {
      const query = `
        {
          referredEvents(
            orderBy: timestamp
            first: 1000
            skip: ${referredEvents.length}
          ) {
            id
            referrer
            referral
            timestamp
          }
        }
      `;
      const res = await Axios.post(apiConfig.subgraphServer, {
        query: query,
      });
      const data = res.data.data.referredEvents;
      if (data.length === 0) {
        break;
      }
      referredEvents = [...referredEvents, ...data];
    }

    while (true) {
      const query = `
        {
          comissionEvents(
            orderBy: timestamp
            first: 1000
            skip: ${comissionEvents.length}
          ) {
            id
            sender
            receiver
            layer
            mintAmount
            usdAmount
            timestamp
          }
        }
      `;
      const res = await Axios.post(apiConfig.subgraphServer, {
        query: query,
      });
      const data = res.data.data.comissionEvents;
      if (data.length === 0) {
        break;
      }
      comissionEvents = [...comissionEvents, ...data];
    }

    const newEvents: any[] = [];

    referredEvents.forEach((event) => {
      newEvents.push({ ...event, type: "Referred" });
    });
    comissionEvents.forEach((event) => {
      newEvents.push({
        ...event,
        type: "ComissionReceived",
        usdAmount: Number(ethers.utils.formatEther(event.usdAmount)),
        mintAmount: Number(event.mintAmount),
        layer: Number(event.layer),
        timestamp: Number(event.timestamp),
      });
    });
    setReferralEvents(newEvents);
  };

  const generateReferralData = (events: any[]) => {
    let referrers: any[] = [];
    const referralToReferrer: any = {};
    let i;
    for (i = 0; i < events.length && events[i].type === "Referred"; i++) {
      const event = events[i];
      const layer1Referrer = referrers.find(
        (item) => item.address === event.referrer
      );
      referralToReferrer[event.referral] = event.referrer;
      if (layer1Referrer) {
        layer1Referrer.layer1ReferralCount += 1;
        layer1Referrer.layer1Referrals.push({
          address: event.referral,
          summoned: 0,
        });
      } else {
        referrers.push({
          address: event.referrer,
          layer1Comission: 0,
          layer1ReferralCount: 1,
          layer1Referrals: [{ address: event.referral, summoned: 0 }],
          layer2Comission: 0,
          layer2ReferralCount: 0,
          layer2Referrals: [],
        });
      }

      if (referralToReferrer[event.referrer]) {
        const layer2ReferrerAddress = referralToReferrer[event.referrer];
        const layer2Referrer = referrers.find(
          (item) => item.address === layer2ReferrerAddress
        );

        layer2Referrer.layer2ReferralCount += 1;
        layer2Referrer.layer2Referrals.push({
          address: event.referral,
          summoned: 0,
        });
      }
    }

    for (; i < events.length; i++) {
      const event = events[i];
      if (event.layer == 1) {
        const layer1Referrer = referrers.find(
          (item) => item.address === event.receiver
        );
        if (layer1Referrer) {
          layer1Referrer.layer1Comission += event.usdAmount;
          const layer1Info = layer1Referrer.layer1Referrals.find(
            (item: any) => item.address === event.sender
          );
          if (layer1Info) {
            layer1Info.summoned += event.mintAmount;
          } else {
            layer1Referrer.layer1Referrals.push({
              address: event.sender,
              summoned: event.mintAmount,
            });
          }
        } else {
          referrers.push({
            address: event.receiver,
            layer1Comission: event.usdAmount,
            layer1ReferralCount: 0,
            layer1Referrals: [
              { address: event.sender, summoned: event.mintAmount },
            ],
            layer2Comission: 0,
            layer2ReferralCount: 0,
            layer2Referrals: [],
          });
        }
      } else if (event.layer == 2) {
        const layer2Referrer = referrers.find(
          (item) => item.address === event.receiver
        );

        if (layer2Referrer) {
          layer2Referrer.layer2Comission += event.usdAmount;
          const layer2Info = layer2Referrer.layer2Referrals.find(
            (item: any) => item.address === event.sender
          );

          if (layer2Info) {
            layer2Info.summoned += event.mintAmount;
          } else {
            layer2Referrer.layer2Referrals.push({
              address: event.sender,
              summoned: event.mintAmount,
            });
          }
        } else {
          referrers.push({
            address: event.receiver,
            layer1Comission: 0,
            layer1ReferralCount: 0,
            layer1Referrals: [],
            layer2Comission: event.usdAmount,
            layer2ReferralCount: 0,
            layer2Referrals: [
              { address: event.sender, summoned: event.mintAmount },
            ],
          });
        }
      }
    }

    referrers = referrers.map((referrer) => ({
      ...referrer,
      address: referrer.address,
      affiliateLink: ReferralService.getReferralLink(referrer.address),
      totalComission: referrer.layer1Comission + referrer.layer2Comission,
      layer1Gross: referrer.layer1Comission * 20,
      layer2Gross: referrer.layer2Comission * 100,
    }));

    referrers.sort((a, b) => {
      const referralCountA = a.layer1ReferralCount + a.layer2ReferralCount;
      const referralCountB = b.layer1ReferralCount + b.layer2ReferralCount;

      if (a.totalComission > b.totalComission) {
        return -1;
      } else if (a.totalComission < b.totalComission) {
        return 1;
      } else {
        if (referralCountA > referralCountB) {
          return -1;
        } else if (referralCountA < referralCountB) {
          return 1;
        }
        return 0;
      }
    });

    return referrers.map((data, index) => ({ ...data, rank: index + 1 }));
  };

  const getThisWeekMonday = () => {
    const d = new Date(Math.floor(new Date().getTime() / oneDay) * oneDay);
    var day = d.getUTCDay(),
      diff = d.getUTCDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setUTCDate(diff);
    return new Date(d.getTime() - 12 * 3600 * 1000);
  };

  const getReferralEventsWithTimeRange = (dateRange: Date[]) => {
    const start =
      (dateRange[0] || new Date(gameConfig.gameStartDay)).getTime() / 1000;
    const end = (dateRange[1] || new Date()).getTime() / 1000;

    const data = referralEvents.filter((event) => {
      if (event.timestamp >= start && event.timestamp < end) {
        return true;
      }
      return false;
    });
    return data;
  };

  useEffect(() => {
    const thisWeekMonday = getThisWeekMonday();
    const thisWeekEvents = getReferralEventsWithTimeRange([
      thisWeekMonday,
      new Date(),
    ]);
    const pastWeekMonday = new Date(thisWeekMonday.getTime() - oneDay * 7);
    const passWeekEvents = getReferralEventsWithTimeRange([
      pastWeekMonday,
      thisWeekMonday,
    ]);

    const allTimeData = generateReferralData(referralEvents);
    const thisWeekData = generateReferralData(thisWeekEvents);
    const pastWeekData = generateReferralData(passWeekEvents);

    setAllTimeData(allTimeData);
    setThisWeekData(thisWeekData);
    setPastWeekData(pastWeekData);
  }, [referralEvents]);

  const handleShowReferralTGModal = () => {
    dispatch(updateModalState({ referralTGModalOpen: true }));
  };

  useEffect(() => {
    getAllReferralEvents();
  }, []);

  useEffect(() => {
    getBalance();
    ReferralService.getReferralInfo(
      dispatch,
      web3,
      account,
      referralSystemContract,
      warriorNFTContract
    );
  }, [account]);

  return (
    <Card
      className="bg-c4"
      sx={{
        p: 4,
      }}
    >
      <Typography variant="h3" fontWeight={"bold"}>
        {getTranslation("referAndEarn")}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: 1,
          }}
        >
          Your referral link:
        </Typography>
        {isShowReferralLink ? (
          <>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: primaryColor,
                  borderTopLeftRadius: "10px",
                  padding: "3px",
                  overflowX: "hidden",
                  fontSize: "10px",
                  verticalAlign: "middle",
                  lineHeight: "27px",
                }}
              >
                {referralLink}
              </Box>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: primaryColor,
                  borderTopRightRadius: "5px",
                  borderBottomRightRadius: "5px",
                  padding: "3px",
                }}
              >
                <Button
                  onClick={onClickCopy}
                  style={{ padding: "0px", minWidth: "unset" }}
                >
                  {!isCopied ? <ContentCopyIcon /> : <CheckIcon />}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Typography
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 1,
              }}
              className="fc1"
            >
              {getTranslation("referFriendConditionMessage")}
            </Typography>
          </>
        )}
        <Typography sx={{ my: 1 }}>
          {getTranslation("shareYourAffiliateLinkMsg")}
          <br />
          {getTranslation("earn1PercentSecondTierCommission")}
        </Typography>
        <Typography className="fc1" fontWeight={"bold"}>
          You have earned:{" "}
          <span className="fc2">
            {formatNumber(
              (Number(layer1Comission) + Number(layer2Comission)).toFixed(2)
            )}{" "}
            BUSD
          </span>
        </Typography>
        <Typography className="fc1" fontWeight={"bold"}>
          You earned{" "}
          <span className="fc2">
            {formatNumber(Number(layer1Comission).toFixed(2))} BUSD
          </span>{" "}
          from <span className="fc2">{Number(layer1Count)} players</span> you
          referred
        </Typography>
        <Typography className="fc1" fontWeight={"bold"}>
          You earned{" "}
          <span className="fc2">
            {formatNumber(Number(layer2Comission).toFixed(2))} BUSD
          </span>{" "}
          from <span className="fc2">{Number(layer2Count)} players</span> you
          referred by players you referred
        </Typography>
        <HomeTypo
          title={`${getTranslation("thanksMessage")}:`}
          info={`${freeWarriorsCnt} Free Warriors`}
        />
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          {getTranslation("addTelegramNameToWinPrizes")}
        </Typography>
        <Typography sx={{ textAlign: "center" }}>
          <Button variant="outlined" onClick={handleShowReferralTGModal}>
            {!contactInfo
              ? getTranslation("addTGName")
              : getTranslation("editTGName")}
          </Button>
        </Typography>
      </Box>
      <Box sx={{ marginTop: "20px" }}>
        <ReferralTable
          title={`${getTranslation("allTimeAffiliatesRanking")}`}
          commissionTitle={`${getTranslation("allTimeTotalComissionEarned")} `}
          data={allTimeData}
        />
        <ReferralTable
          title={getTranslation("lastWeekAffiliatesRanking")}
          commissionTitle={getTranslation("lastWeekTotalComissionEarned")}
          data={pastWeekData}
        />
        <ReferralTable
          title={getTranslation("thisWeekAffiliatesRanking")}
          commissionTitle={getTranslation("thisWeekTotalComissionEarned")}
          data={thisWeekData}
        />
      </Box>
      <ReferralTGModal />
    </Card>
  );
};

export default ReferPage;
