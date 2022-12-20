import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { inventoryState } from "../../reducers/inventory.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { getClaimMaxTaxPercent } from "../../web3hooks/contractFunctions/rewardpool.contract";
import { useRewardPool } from "../../web3hooks/useContract";

const InfoText: React.FC = () => {
  const { taxLeftDaysForClaim, claimMinTaxPercent, currentSamaritanStars } =
    AppSelector(inventoryState);

  const rewardpoolContract = useRewardPool();

  const [isShow, setIsShow] = useState<boolean>(false);

  const decreasingCurrentClaimTax =
    2 * Number(taxLeftDaysForClaim) + Number(claimMinTaxPercent);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const maxClaimTaxOfCurrentSamaritanStars = await getClaimMaxTaxPercent(
        rewardpoolContract,
        currentSamaritanStars
      );
      if (decreasingCurrentClaimTax > maxClaimTaxOfCurrentSamaritanStars) {
        setIsShow(true);
      }
    } catch (error) {}
  };

  return (
    <>
      {isShow && (
        <Box sx={{ mb: 1 }}>
          <Typography>{getTranslation("infoText1")}</Typography>
          <Typography>{getTranslation("infoText2")}</Typography>
        </Box>
      )}
    </>
  );
};

export default InfoText;
