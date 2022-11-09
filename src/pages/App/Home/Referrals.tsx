import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { Box, Button, Card, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

import {
  useReferralSystem,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import { AppDispatch, AppSelector } from "../../../store";
import HomeTypo from "../../../components/UI/HomeTypo";
import { formatNumber, getTranslation } from "../../../utils/utils";
import { referralState } from "../../../reducers/referral.reducer";
import { commonState } from "../../../reducers/common.reduer";
import { legionState } from "../../../reducers/legion.reducer";
import ReferralService from "../../../services/referral.service";
import { getAddressToFreeMintGiven } from "../../../web3hooks/contractFunctions/referral.contract";
import { updateModalState } from "../../../reducers/modal.reducer";
import constants from "../../../constants";
import ReferralTGModal from "../../../components/Modals/ReferralTG.modal";

const Referrals: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const {
    referralStats: {
      layer1Comission,
      layer2Comission,
      layer1Count,
      layer2Count,
    },
  } = AppSelector(referralState);
  const { contactInfo } = AppSelector(commonState);
  const { allLegions } = AppSelector(legionState);

  const isShowReferralLink = allLegions.find(
    (legion) => legion.attackPower >= 3000
  );

  const referralSystemContract = useReferralSystem();
  const warriorNFTContract = useWarrior();
  const [isCopied, setIsCopied] = useState(false);
  const [freeWarriorsCnt, setFreeWarriorsCnt] = useState(0);
  const referralLink = ReferralService.getReferralLink(account?.toString());

  const onClickCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      toast.success("Referral Link Copied");
    });
  };

  const getBalance = async () => {
    try {
      setFreeWarriorsCnt(
        await getAddressToFreeMintGiven(referralSystemContract, account)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowReferralTGModal = () => {
    dispatch(updateModalState({ referralTGModalOpen: true }));
  };
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
          {getTranslation("referrals")}
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
            {getTranslation("yourReferralLink")}
          </Typography>
          {isShowReferralLink ? (
            <>
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: constants.color.color2,
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
                    borderColor: constants.color.color2,
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
          <Typography className="fc1" fontWeight={"bold"}>
            {getTranslation("youEarnedBUSDFromFirstReferred", {
              CL1: formatNumber(Number(layer1Comission).toFixed(2)),
              CL2: Number(layer1Count),
            })}
          </Typography>
          <Typography className="fc1" fontWeight={"bold"}>
            {getTranslation("youEarnedBUSDFromSecondReferred", {
              CL1: formatNumber(Number(layer2Comission).toFixed(2)),
              CL2: Number(layer2Count),
            })}
          </Typography>
          <HomeTypo
            title={`${getTranslation("thanksMessage")}:`}
            info={`${freeWarriorsCnt} ${getTranslation("freeWarriors")}`}
          />
          <br />
          <Typography sx={{ textAlign: "center" }}>
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
      </Box>
      <ReferralTGModal />
    </Card>
  );
};

export default Referrals;
