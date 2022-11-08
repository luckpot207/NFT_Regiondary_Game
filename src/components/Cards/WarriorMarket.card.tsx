import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import gameConfig from "../../config/game.config";
import { commonState } from "../../reducers/common.reduer";
import { updateMarketplaceState } from "../../reducers/marketplace.reducer";
import { updateModalState } from "../../reducers/modal.reducer";
import MarketplaceService from "../../services/marketplace.service";
import { AppSelector } from "../../store";
import { IWarriorMarket } from "../../types";
import { formatNumber, getTranslation } from "../../utils/utils";
import {
  getBloodstoneAllowance,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions/common.contract";
import {
  buyToken,
  cancelMarketplace,
} from "../../web3hooks/contractFunctions/marketplace.contract";
import { getMarketplaceAddress } from "../../web3hooks/getAddress";
import {
  useBloodstone,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";

type Props = {
  warrior: IWarriorMarket;
};

const WarriorMarketCard: React.FC<Props> = ({ warrior }) => {
  const dispatch = useDispatch();
  const { showAnimation } = AppSelector(commonState);
  const theme = useTheme();

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const bloodstoneContract = useBloodstone();
  const marketplaceContract = useMarketplace();
  const warriorContract = useWarrior();

  const { id, mp4, jpg, strength, attackPower, price, seller, newItem, type } =
    warrior;

  const [loaded, setLoaded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleBuyToken = async () => {
    dispatch(updateMarketplaceState({ buyItemLoading: true }));
    try {
      const allowance = await getBloodstoneAllowance(
        web3,
        bloodstoneContract,
        getMarketplaceAddress(),
        account
      );
      if (allowance <= price) {
        await setBloodstoneApprove(
          web3,
          bloodstoneContract,
          getMarketplaceAddress(),
          account
        );
      }
      await buyToken(
        web3,
        marketplaceContract,
        account,
        gameConfig.nftItemType.warrior,
        id,
        price
      );
      dispatch(updateMarketplaceState({ buyItemLoading: false }));
      MarketplaceService.getAllWarriorMarketItemsAct(
        dispatch,
        web3,
        warriorContract,
        marketplaceContract
      );
    } catch (error) {
      console.log(error);
    }
    dispatch(updateMarketplaceState({ buyItemLoading: false }));
  };

  const handleCancelToken = async () => {
    dispatch(updateMarketplaceState({ cancelItemLoading: true }));
    try {
      await cancelMarketplace(
        marketplaceContract,
        account,
        gameConfig.nftItemType.warrior,
        id
      );
      dispatch(updateMarketplaceState({ cancelItemLoading: false }));
      MarketplaceService.getAllWarriorMarketItemsAct(
        dispatch,
        web3,
        warriorContract,
        marketplaceContract
      );
    } catch (error) {
      console.log(error);
    }
    dispatch(updateMarketplaceState({ cancelItemLoading: false }));
  };

  const handleUpdatePrice = async () => {
    dispatch(
      updateModalState({
        updatePriceModalOpen: true,
      })
    );
    dispatch(
      updateMarketplaceState({
        listingPrice: price,
        listingType: gameConfig.nftItemType.warrior,
        listingId: id,
      })
    );
  };

  const showStrength = () => {
    let itemList = [];
    for (let i = 0; i < strength; i++) {
      itemList.push(
        <img
          key={i}
          src="/assets/images/bloodstoneGrey.png"
          style={{ height: "30px" }}
          alt="icon"
        />
      );
    }
    return itemList;
  };

  return (
    <Box>
      <Card
        sx={{
          position: "relative",
          width: "100%",
          fontSize: isMobile ? 10 : 14,
        }}
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
              fontSize: isMobile ? 14 : 20,
              fontWeight: "bold",
              textShadow:
                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
            }}
          >
            {formatNumber(attackPower)}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: isMobile ? 10 : 12,
            position: "absolute",
            bottom: "2%",
            left: "2%",
            color: "darkgrey",
          }}
        >
          #{id}
        </Typography>
        {account === seller && (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "2%",
              right: "2%",
              cursor: "pointer",
            }}
            onClick={() => handleCancelToken()}
          >
            <img
              src="/assets/images/execute.png"
              style={{ height: "20px" }}
              alt="Execute"
            />
          </Box>
        )}
        {newItem && (
          <img
            src="/assets/images/badge.png"
            style={{
              position: "absolute",
              bottom: "40px",
              left: "15px",
              height: "20px",
            }}
            alt="New Item"
          />
        )}
      </Card>
      <Box sx={{ textAlign: "center", mt: 1 }}>
        {account?.toLowerCase() === seller.toLowerCase() ? (
          <Button
            variant="outlined"
            sx={{ fontWeight: "bold", fontSize: 16 }}
            onClick={() => handleUpdatePrice()}
          >
            {formatNumber(price.toFixed(2))} ${getTranslation("blst")}
            <img
              src="/assets/images/updatePrice.png"
              style={{ height: "20px", marginLeft: "10px" }}
              alt="Update Price"
            />
          </Button>
        ) : (
          <FireBtn
            sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
            onClick={() => handleBuyToken()}
          >
            {formatNumber(price.toFixed(2))} ${getTranslation("blst")}
          </FireBtn>
        )}
      </Box>
    </Box>
  );
};
export default WarriorMarketCard;
