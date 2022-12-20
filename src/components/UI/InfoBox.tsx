import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import InfoIcon from "@mui/icons-material/Info";

import { AppSelector } from "../../store";
import { inventoryState } from "../../reducers/inventory.reducer";
import { apiConfig } from "../../config/api.config";
import { Box, Popover, Typography } from "@mui/material";

const InfoBox: React.FC = () => {
  const { currentReinvestPercent } = AppSelector(inventoryState);

  const { account } = useWeb3React();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [previousPercent, setPreviousPercent] = useState<Number>(0);
  const [recentPercent, setRecentPercnet] = useState<Number>(0);

  useEffect(() => {
    getBalance();
  }, [account, currentReinvestPercent]);

  const getBalance = async () => {
    try {
      const query = `
        {
          samaritanStarAndTaxCycleChangeLogs (
            orderBy: timestamp,
            orderDirection:desc,
            where: {
              address: "${account?.toLowerCase() as string}"
            }
            first: 2
          ) {
            currentReinvestPercent
            resetTaxCycle
            timestamp
          }
        }
      `;

      const graphRes = await Axios.post(apiConfig.subgraphServer, { query });
      const data = graphRes.data.data.samaritanStarAndTaxCycleChangeLogs;
      if (data.length === 2 && data[0].resetTaxCycle === null) {
        setIsShow(true);
        setRecentPercnet(data[0].currentReinvestPercent);
        setPreviousPercent(data[1].currentReinvestPercent);
      } else {
        setIsShow(false);
      }
    } catch (error) {
      console.log("get balance in info box: ", error);
    }
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isShow && (
        <>
          <Box
            sx={{ cursor: "pointer", ml: 2 }}
            aria-owns={open ? "mouse-over-infobox-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <InfoIcon />
          </Box>
          <Popover
            id="mouse-over-infobox-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Box sx={{ p: 1, maxWidth: 500 }}>
              <Typography>
                Your current taxes are based on your{" "}
                <u>
                  <strong>previous</strong>
                </u>{" "}
                Reinvest Percentage of {previousPercent}% that you had when you
                reset your Tax Cycle.
              </Typography>
              <Typography>
                Once you reset your Tax Cycle again, your taxes will be aligned
                with your most{" "}
                <u>
                  <strong>recent</strong>
                </u>{" "}
                Reinvest Percent of {recentPercent}%.
              </Typography>
            </Box>
          </Popover>
        </>
      )}
    </>
  );
};

export default InfoBox;
