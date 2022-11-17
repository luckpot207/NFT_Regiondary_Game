import React, { useState } from "react";
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
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { commonState } from "../../reducers/common.reduer";
import { updateModalState } from "../../reducers/modal.reducer";
import { changeWarriorExecuteStatus } from "../../reducers/warrior.reducer";
import { updateMarketplaceState } from "../../reducers/marketplace.reducer";
import WarriorService from "../../services/warrior.service";
import { AppSelector } from "../../store";
import { IWarrior } from "../../types";
import { formatNumber, getTranslation } from "../../utils/utils";
import { useWarrior } from "../../web3hooks/useContract";
import gameConfig from "../../config/game.config";
import constants from "../../constants";

type Props = {
  warrior: IWarrior;
  isActionBtns: boolean;
};

const WarriorCard: React.FC<Props> = ({ warrior, isActionBtns }) => {
  const dispatch = useDispatch();
  const { showAnimation } = AppSelector(commonState);
  const theme = useTheme();

  const { account } = useWeb3React();

  const warriorContract = useWarrior();

  const { id, mp4, jpg, strength, attackPower, executeStatus, type } = warrior;

  const [loaded, setLoaded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleSelectExecuteStatus = () => {
    dispatch(changeWarriorExecuteStatus(id));
  };

  const handleExecuteBeast = () => {
    if (strength > 2) {
      Swal.fire({
        title: getTranslation("warning"),
        text: getTranslation("executeWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: constants.color.color2,
        cancelButtonColor: "#d33",
        confirmButtonText: getTranslation("execute"),
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          WarriorService.handleExecuteWarriors(
            dispatch,
            account,
            warriorContract,
            [id]
          );
        }
      });
    } else {
      WarriorService.handleExecuteWarriors(dispatch, account, warriorContract, [
        id,
      ]);
    }
  };

  const handleToMarketplace = () => {
    dispatch(
      updateMarketplaceState({
        listingPrice: 0,
        listingType: gameConfig.nftItemType.warrior,
        listingId: id,
      })
    );
    dispatch(
      updateModalState({
        listOnMarketplaceModalOpen: true,
      })
    );
  };

  const renderStrength = () => {
    let itemList = [];
    for (let i = 0; i < strength; i++) {
      itemList.push(
        <img
          key={i}
          src="/assets/images/strength.png"
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
          {renderStrength()}
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
