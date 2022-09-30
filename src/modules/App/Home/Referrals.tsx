import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { Box, Button, Card, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

import { getReferralInfo, getReferralLink } from "../../../helpers/referral";
import {
  useReferralSystem,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import { AppDispatch, AppSelector } from "../../../store";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import HomeTypo from "../../../components/UI/HomeTypo";
import ReferralTGModal from "../../../components/Modals/ReferralTG.modal";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { formatNumber } from "../../../utils/utils";
import {
  getAddressToFreeMintGiven,
  getFreeMintInfo,
} from "../../../web3hooks/contractFunctions";

const Referrals: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const {
    referralStatsLoading,
    referralStats: {
      referrals,
      layer1Comission,
      layer2Comission,
      layer1Count,
      layer2Count,
    },
    contactInfo,
    allLegions,
  } = AppSelector(gameState);

  const isShowReferralLink = allLegions.find(
    (legion) => legion.attackPower >= 3000
  );

  const referralSystemContract = useReferralSystem();
  const warriorNFTContract = useWarrior();
  const [isCopied, setIsCopied] = useState(false);
  const [freeWarriorsCnt, setFreeWarriorsCnt] = useState(0);
  const referralLink = getReferralLink(account?.toString());
  const primaryColor = "#f66810";

  const onClickCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      toast.success("Referral Link Copied");
    });
  };
  const toFixed = (number: Number) => Number(number)?.toFixed(2);

  const getBalance = async () => {
    console.log(referrals);
    try {
      setFreeWarriorsCnt(
        await getAddressToFreeMintGiven(referralSystemContract, account)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowReferralTGModal = () => {
    dispatch(updateState({ referralTGModalOpen: true }));
  };
  useEffect(() => {
    getBalance();
    getReferralInfo(
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
          <LanguageTranslate translateKey="referrals" />
        </Typography>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
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
                You need to have a legion of at least 3,000 AP to start
                referring friends.
              </Typography>
            </>
          )}
          <Typography className="fc1" fontWeight={"bold"}>
            You earned{" "}
            <span className="fc2">
              {formatNumber(Number(layer1Comission).toFixed(2))} BUSD
            </span>{" "}
            from <span className="fc2">{Number(layer1Count)} players</span>{" "}
            referred
          </Typography>
          <Typography className="fc1" fontWeight={"bold"}>
            You earned{" "}
            <span className="fc2">
              {formatNumber(Number(layer2Comission).toFixed(2))} BUSD
            </span>{" "}
            from <span className="fc2">{Number(layer2Count)} players</span>{" "}
            referred by players you referred
          </Typography>
          <HomeTypo
            title={`Thanks to you, other players got: `}
            info={`${freeWarriorsCnt} Free Warriors`}
          />
          <br />
          <Typography sx={{ textAlign: "center" }}>
            Add your Telegram name to enroll to win prizes every week.
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            <Button variant="outlined" onClick={handleShowReferralTGModal}>
              {!contactInfo ? "Add TG Name" : "Edit TG Name"}
            </Button>
          </Typography>
        </Box>
      </Box>
      <ReferralTGModal />
    </Card>
  );
};

export default Referrals;
