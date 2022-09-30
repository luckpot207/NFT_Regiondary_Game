import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { getReferralInfo, getReferralLink } from "../../../helpers/referral";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { AppDispatch, AppSelector } from "../../../store";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import HomeTypo from "../../../components/UI/HomeTypo";
import { formatNumber } from "../../../utils/utils";
import {
  useReferralSystem,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import { useDispatch } from "react-redux";
import { getFreeMintInfo } from "../../../web3hooks/contractFunctions";
import ReferralTGModal from "../../../components/Modals/ReferralTG.modal";

const ReferPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
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
    allWarriors,
    allLegions,
  } = AppSelector(gameState);

  const web3 = useWeb3();
  const referralSystemContract = useReferralSystem();
  const warriorNFTContract = useWarrior();

  const isShowReferralLink = allLegions.find(
    (legion) => legion.attackPower >= 3000
  );
  const primaryColor = "#f66810";

  const { account } = useWeb3React();
  const [isCopied, setIsCopied] = useState(false);
  const referralLink = getReferralLink(account?.toString());
  const [freeWarriorsCnt, setFreeWarriorsCnt] = useState(0);

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
        p: 4,
      }}
    >
      <Typography variant="h3" fontWeight={"bold"}>
        <LanguageTranslate translateKey="referAndEarn" />
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
              You need to have a legion of at least 3,000 AP to start referring
              friends.
            </Typography>
          </>
        )}
        <Typography sx={{ my: 1 }}>
          Share your affiliate link and earn 5% commission in BLST of the amount
          every referred wallet uses to summon warriors on their first day.
          <br />
          Earn 1% second tier commission on all wallets your referrals introduce
          to the game.
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
          title={`Thanks to you, other players got: `}
          info={`${freeWarriorsCnt} Free Warriors`}
        />
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Add your Telegram name to enroll to win prizes every week.
        </Typography>
        <Typography sx={{ textAlign: "center" }}>
          <Button variant="outlined" onClick={handleShowReferralTGModal}>
            {!contactInfo ? "Add TG Name" : "Edit TG Name"}
          </Button>
        </Typography>
      </Box>
      <ReferralTGModal />
    </Card>
  );
};

export default ReferPage;
