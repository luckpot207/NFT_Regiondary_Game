import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
  Box,
  Card,
  CardMedia,
  Checkbox,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import classNames from "classnames";
import Swal from "sweetalert2";

import { AppSelector } from "../../store";
import { useBeast } from "../../web3hooks/useContract";
import { IBeast } from "../../types";
import { commonState } from "../../reducers/common.reduer";
import { changeBeastExecuteStatus } from "../../reducers/beast.reducer";
import { getTranslation } from "../../utils/utils";
import BeastService from "../../services/beast.service";
import { updateModalState } from "../../reducers/modal.reducer";
import { updateMarketplaceState } from "../../reducers/marketplace.reducer";
import gameConfig from "../../config/game.config";

type Props = {
  beast: IBeast;
  isActionBtns: boolean;
};

const BeastCard: React.FC<Props> = ({ beast, isActionBtns }) => {
  const dispatch = useDispatch();
  const { showAnimation } = AppSelector(commonState);
  const theme = useTheme();

  const { account } = useWeb3React();

  const beastContract = useBeast();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id, mp4, jpg, capacity, executeStatus, type } = beast;
  const [loaded, setLoaded] = useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleSelectExecuteStatus = () => {
    dispatch(changeBeastExecuteStatus(id));
  };

  const handleExecuteBeast = () => {
    if (capacity > 2) {
      Swal.fire({
        title: getTranslation("warning"),
        text: getTranslation("executeWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f66810",
        cancelButtonColor: "#d33",
        confirmButtonText: getTranslation("execute"),
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          BeastService.handleExecuteBeasts(dispatch, account, beastContract, [
            id,
          ]);
        }
      });
    } else {
      BeastService.handleExecuteBeasts(dispatch, account, beastContract, [id]);
    }
  };

  const handleToMarketplace = () => {
    dispatch(
      updateModalState({
        listOnMarketplaceModalOpen: true,
      })
    );
    dispatch(
      updateMarketplaceState({
        listingPrice: 0,
        listingType: gameConfig.nftItemType.beast,
        listingId: id,
      })
    );
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        fontSize: isMobile ? 10 : 14,
      }}
      className={classNames({ executeitem: executeStatus }, "beastCard")}
    >
      {showAnimation ? (
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
                <source src=${mp4.valueOf()} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
          `,
          }}
        />
      ) : (
        <>
          <CardMedia
            component={"img"}
            image={jpg.valueOf()}
            alt="Beast Image"
            loading="lazy"
            onLoad={handleImageLoaded}
          />
          {loaded === false && (
            <React.Fragment>
              <Skeleton variant="rectangular" width="100%" height="200px" />
              <Skeleton />
              <Skeleton width="60%" />
            </React.Fragment>
          )}
        </>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          position: "absolute",
          top: "2%",
          justifyContent: "space-between",
          width: "96%",
          paddingLeft: "2%",
        }}
      >
        <Typography
          sx={{
            fontSize: isActionBtns ? 14 : 10,
            fontWeight: "bold",
          }}
        >
          {type}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <img
            src="/assets/images/sword.png"
            style={{
              height: `${isActionBtns ? "20px" : "15px"}`,
              marginRight: "10%",
            }}
            alt="Sword"
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: isActionBtns ? 20 : isMobile ? 10 : 16,
              textShadow:
                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
            }}
          >
            {capacity}
          </Typography>
        </Box>
      </Box>
      {isActionBtns && (
        <>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "2%",
              right: "5%",
              cursor: "pointer",
            }}
            onClick={() => handleToMarketplace()}
          >
            <img
              src="/assets/images/shopping.png"
              style={{ height: "20px" }}
              alt="Shopping"
            />
          </Box>
          <Checkbox
            sx={
              executeStatus
                ? {
                    opacity: 1,
                  }
                : {}
            }
            className="executeCheckBox"
            checked={executeStatus}
            onClick={() => handleSelectExecuteStatus()}
          />
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "calc(2% + 20px)",
              left: "2%",
              cursor: "pointer",
            }}
            onClick={() => handleExecuteBeast()}
          >
            <img
              src="/assets/images/execute.png"
              style={{ height: "20px" }}
              alt="Execute"
            />
          </Box>
        </>
      )}
      <Typography
        sx={{
          fontSize: isMobile ? 8 : 10,
          position: "absolute",
          bottom: "2%",
          left: "2%",
          color: "darkgrey",
        }}
      >
        #{id}
      </Typography>
    </Card>
  );
};
export default BeastCard;
