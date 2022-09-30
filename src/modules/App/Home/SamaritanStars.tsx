import { Box, Card, Typography } from "@mui/material";
import React from "react";
import HomeTypo from "../../../components/UI/HomeTypo";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { gameState } from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";

const SamaritanStars: React.FC = () => {
  // Hook
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
  } = AppSelector(gameState);

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
          <LanguageTranslate translateKey="samaritanStars" />
        </Typography>
        <Box>
          <HomeTypo title={"Your Samaritan Stars:"} info={renderStars()} />
          <HomeTypo
            title={"Reinvest Percent: "}
            info={currentReinvestPercent + "%"}
          />
          {daysLeftUntilAbove3Stars > 0 && (
            <HomeTypo
              title={`${daysLeftUntilAbove3Stars} days left to go above 3 Stars.`}
              info={""}
            />
          )}
          <HomeTypo
            title={"Claim Tax:"}
            info={`${
              Number(taxLeftDaysForClaim) * 2 + Number(claimMinTaxPercent)
            }%`}
          />
          <HomeTypo
            title={"Reinvest Tax:"}
            info={`${Number(taxLeftDaysForReinvest) * 2}%`}
          />
          <HomeTypo
            title={"Invested Total:"}
            info={
              Number(
                Number(reinvestedTotalUSD) + Number(additionalInvestment)
              ).toFixed(2) + " USD"
            }
          />
          <HomeTypo
            title={"Reinvested Total:"}
            info={Number(reinvestedTotalUSD).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={"Amount in Reinvest Wallet:"}
            info={Number(reinvestedWalletUSD).toFixed(2) + " USD"}
          />
          <HomeTypo
            title={"Total Claimed:"}
            info={Number(totalClaimedUSD).toFixed(2) + " USD"}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default SamaritanStars;
