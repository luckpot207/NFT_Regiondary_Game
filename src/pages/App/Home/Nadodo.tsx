import React, { useState, useEffect } from "react";
import { Box, Card, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { getTranslation } from "../../../utils/utils";
import { useBloodstone, useFeeHandler } from "../../../web3hooks/useContract";
import HomeTypo from "../../../components/UI/HomeTypo";
import CommonService from "../../../services/common.service";
import { AppDispatch, AppSelector } from "../../../store";
import { commonState } from "../../../reducers/common.reduer";

const NadodoWatch: React.FC = () => {
  const {
    marketplaceTax,
    huntTax,
    damageReduction,
    summonFee,
    suppliesFee14,
    suppliesFee28,
    sellTax,
    buyTax,
  } = AppSelector(commonState);

  const feehandlerContract = useFeeHandler();
  const bloodstoneContract = useBloodstone();

  const [rewardStatus, setRewardStatus] = useState("lime");
  const [rewardDesc, setRewardDesc] = useState("Healthy");
  const [reserveStatus, setReserveStatus] = useState("lime");
  const [reserveDesc, setReserveDesc] = useState("Healthy");
  const [liquidityStatus, setLiquidityStatus] = useState("lime");
  const [liquidityDesc, setLiquidityDesc] = useState("Healthy");

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
          {getTranslation("nadodoWatching")}
        </Typography>
        <Box>
          <HomeTypo
            title={`${getTranslation("marketplaceTax")}: `}
            info={marketplaceTax + "%"}
          />
          <HomeTypo
            title={`${getTranslation("huntTax")}: `}
            info={huntTax + "%"}
          />
          <HomeTypo
            title={`${getTranslation("buyTax")}: `}
            info={buyTax + "%"}
          />
          <HomeTypo
            title={`${getTranslation("sellTax")}: `}
            info={sellTax + "%"}
          />
          <HomeTypo
            title={`${getTranslation("legionDamagePerHunt")}: `}
            info={damageReduction + "%"}
          />
          <HomeTypo
            title={`${getTranslation("summoningFee")}: `}
            info={"$" + summonFee}
          />
          <HomeTypo
            title={`${getTranslation("SuppliesFee14Hunts")}: `}
            info={"$" + suppliesFee14}
          />
          <HomeTypo
            title={`${getTranslation("SuppliesFee28Hunts")}: `}
            info={"$" + suppliesFee28}
          />
          <Typography
            className="fc1"
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            {getTranslation("RewardPool")}
            :&nbsp;
            <CircleIcon sx={{ color: rewardStatus, fontSize: 16 }} /> &nbsp;
            <span className="fc2">{rewardDesc}</span>
          </Typography>
          <Typography
            className="fc1"
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            {getTranslation("ReservePool")}
            :&nbsp;
            <CircleIcon sx={{ color: reserveStatus, fontSize: 16 }} /> &nbsp;
            <span className="fc2">{reserveDesc}</span>
          </Typography>
          <Typography
            className="fc1"
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            {getTranslation("LiquidityPool")}
            :&nbsp;
            <CircleIcon sx={{ color: liquidityStatus, fontSize: 16 }} /> &nbsp;
            <span className="fc2">{liquidityDesc}</span>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default NadodoWatch;
