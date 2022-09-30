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
import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { handleExecuteBeasts } from "../../helpers/beast";
import { I_Beast } from "../../interfaces";
import {
  changeBeastExecuteStatus,
  gameState,
  updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { useBeast } from "../../web3hooks/useContract";
import LanguageTranslate from "../UI/LanguageTranslate";

type Props = {
  beast: I_Beast;
  isActionBtns: boolean;
};

const BeastCard: React.FC<Props> = ({ beast, isActionBtns }) => {
  // Hook Info
  const dispatch = useDispatch();
  const { showAnimation, itemnames } = AppSelector(gameState);
  const theme = useTheme();

  // Account
  const { account } = useWeb3React();

  // Contracts
  const beastContract = useBeast();

  // States
  const warningText = LanguageTranslate({ translateKey: "warning" });
  const executeText = LanguageTranslate({ translateKey: "execute" });
  const executeWarningText = LanguageTranslate({
    translateKey: "executeWarning",
  });

  const { id, mp4, jpg, capacity, executeStatus } = beast;
  const type = itemnames.find(
    (item) => item.type === "beast" && item.number === capacity
  )?.name;
  const [loaded, setLoaded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Functions
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleSelectExecuteStatus = () => {
    dispatch(changeBeastExecuteStatus(id));
  };

  const handleExecuteBeast = () => {
    if (capacity > 2) {
      Swal.fire({
        title: warningText,
        text: executeWarningText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f66810",
        cancelButtonColor: "#d33",
        confirmButtonText: executeText,
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          handleExecuteBeasts(dispatch, account, beastContract, [id]);
        }
      });
    } else {
      handleExecuteBeasts(dispatch, account, beastContract, [id]);
    }
  };

  const handleToMarketplace = () => {
    dispatch(
      updateState({
        listOnMarketplaceModal: true,
        listingPrice: 0,
        listingType: 1,
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
