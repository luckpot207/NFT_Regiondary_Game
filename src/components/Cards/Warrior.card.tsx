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
import { handleExecuteWarriors } from "../../helpers/warrior";
import { I_Warrior } from "../../interfaces";
import {
  changeWarriorExecuteStatus,
  gameState,
  updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { formatNumber } from "../../utils/utils";
import { useWarrior } from "../../web3hooks/useContract";
import LanguageTranslate from "../UI/LanguageTranslate";

type Props = {
  warrior: I_Warrior;
  isActionBtns: boolean;
};

const WarriorCard: React.FC<Props> = ({ warrior, isActionBtns }) => {
  // Hook Info
  const dispatch = useDispatch();
  const { showAnimation, itemnames } = AppSelector(gameState);
  const theme = useTheme();

  // Account
  const { account } = useWeb3React();

  // Contracts
  const warriorContract = useWarrior();

  // States
  const warningText = LanguageTranslate({ translateKey: "warning" });
  const executeText = LanguageTranslate({ translateKey: "execute" });
  const executeWarningText = LanguageTranslate({
    translateKey: "executeWarning",
  });

  const { id, mp4, jpg, strength, attackPower, executeStatus } = warrior;

  const type = itemnames.find(
    (item) => item.type === "warrior" && item.number === strength
  )?.name;

  const [loaded, setLoaded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Functions
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleSelectExecuteStatus = () => {
    dispatch(changeWarriorExecuteStatus(id));
  };

  const handleExecuteBeast = () => {
    if (strength > 2) {
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
          handleExecuteWarriors(dispatch, account, warriorContract, [id]);
        }
      });
    } else {
      handleExecuteWarriors(dispatch, account, warriorContract, [id]);
    }
  };

  const handleToMarketplace = () => {
    dispatch(
      updateState({
        listOnMarketplaceModal: true,
        listingPrice: 0,
        listingType: 2,
        listingId: id,
      })
    );
  };

  // Render
  const showStrength = () => {
    let itemList = [];
    for (let i = 0; i < strength; i++) {
      itemList.push(
        <img
          key={i}
          src="/assets/images/bloodstoneGrey.png"
          style={{ height: isActionBtns ? "30px" : "10px" }}
          alt="icon"
        />
      );
    }
    return itemList;
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        fontSize: isMobile ? 10 : 14,
      }}
      className={classNames({ executeitem: executeStatus }, "warriorCard")}
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
            alt="Warrior Image"
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
          {showStrength()}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          alignItems: "center",
          bottom: "2%",
          width: "100%",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <Typography
          sx={{
            fontSize: isActionBtns ? 20 : isMobile ? 10 : 14,
            fontWeight: "bold",
            textShadow:
              "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
          }}
        >
          {formatNumber(attackPower)}
        </Typography>
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
export default WarriorCard;
