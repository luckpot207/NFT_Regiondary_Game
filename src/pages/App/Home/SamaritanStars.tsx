import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { Box, Card, Typography } from "@mui/material";
import HomeTypo from "../../../components/UI/HomeTypo";
import { inventoryState } from "../../../reducers/inventory.reducer";
import { AppDispatch, AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import InventoryService from "../../../services/inventory.service";
import { useRewardPool, useWeb3 } from "../../../web3hooks/useContract";

const SamaritanStars: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    currentSamaritanStars,
    daysLeftUntilAbove3Stars,
    totalClaimedUSD,
    reinvestedWalletUSD,
    reinvestedTotalUSD,
    additionalInvestment,
    claimMinTaxPercent,
    taxLeftDaysForClaim,
    taxLeftDaysForReinvest,
    currentReinvestPercent,
  } = AppSelector(inventoryState);

  const web3 = useWeb3();
  const { account } = useWeb3React();
  const rewardpoolContract = useRewardPool();

  useEffect(() => {
    InventoryService.getSamaritanInfo(
      dispatch,
      web3,
      account,
      rewardpoolContract
    );
  }, [account]);

  const renderStars = () => {
    let samaritanStarsRender = [];
    for (let i = 0; i < 5; i++) {
      if (i < currentSamaritanStars) {
        samaritanStarsRender.push(
          <img
            key={i}
            src="/assets/images/samaritan-star-full.png"
            style={{ height: 15, marginRight: 4 }}
            alt="icon"
          />
        );
      } else {
        samaritanStarsRender.push(
          <img
            key={i}
            src="/assets/images/samaritan-star-empty.png"
            style={{ height: 15, marginRight: 4 }}
            alt="icon"
          />
        );
      }
    }
    return samaritanStarsRender;
  };

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
          {getTranslation("samaritanStars")}
        </Typography>
        <Box>
          <HomeTypo
            title={`${getTranslation("yourSamaritanStars")}:`}
            info={renderStars()}
          />
          <HomeTypo
            title={`${getTranslation("reinvestPercentage")}:`}
            info={currentReinvestPercent + "%"}
          />
          <Box hidden={!(daysLeftUntilAbove3Stars > 0)}>
            <HomeTypo
              title={`${getTranslation("daysLeftToGoAbove3Stars", {
                "#": daysLeftUntilAbove3Stars,
              })}`}
              info={""}
            />
          </Box>
          <HomeTypo
            title={`${getTranslation("claimTax")}:`}
            info={`${
              Number(taxLeftDaysForClaim) * 2 + Number(claimMinTaxPercent)
            }%`}
          />
          <HomeTypo
            title={`${getTranslation("reinvestTax")}:`}
            info={`${Number(taxLeftDaysForReinvest) * 2}%`}
          />
          <HomeTypo
            title={`${getTranslation("investedTotal")}:`}
            info={
              Number(
                Number(reinvestedTotalUSD) + Number(additionalInvestment)
              ).toFixed(2) + " USD"
            }
          />
          <HomeTypo
            title={`${getTranslation("reinvestedTotal")}:`}
            info={Number(reinvestedTotalUSD).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={`${getTranslation("amountInReinvestWallet")}:`}
            info={Number(reinvestedWalletUSD).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={`${getTranslation("totalClaimed")}:`}
            info={Number(totalClaimedUSD).toFixed(2) + " USD"}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default SamaritanStars;
