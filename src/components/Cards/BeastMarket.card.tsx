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
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Constants from "../../constants";
import { getAllBeastMarketItemsAct } from "../../helpers/marketplace";
import { I_Beast, I_Beast_Market } from "../../interfaces";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { formatNumber } from "../../utils/utils";
import {
  buyToken,
  cancelMarketplace,
  getBloodstoneAllowance,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions";
import { getMarketplaceAddress } from "../../web3hooks/getAddress";
import {
  useBeast,
  useBloodstone,
  useMarketplace,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";

type Props = {
  beast: I_Beast_Market;
};

const BeastMarketCard: React.FC<Props> = ({ beast }) => {
  // Hook Info
  const dispatch = useDispatch();
  const { showAnimation, itemnames } = AppSelector(gameState);
  const theme = useTheme();

  // Account
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const beastContract = useBeast();
  const bloodstoneContract = useBloodstone();
  const marketplaceContract = useMarketplace();

  // States
  const { id, mp4, jpg, capacity, price, seller, newItem } = beast;

  const type = itemnames.find(
    (item) => item.type === "beast" && item.number === capacity
  )?.name;
  const [loaded, setLoaded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Functions
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleBuyToken = async () => {
    dispatch(updateState({ buyItemLoading: true }));
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
        Constants.nftItemType.beast,
        id,
        price
      );
      dispatch(updateState({ buyItemLoading: false }));
      getAllBeastMarketItemsAct(
        dispatch,
        web3,
        beastContract,
        marketplaceContract
      );
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ buyItemLoading: false }));
  };

  const handleCancelToken = async () => {
    dispatch(updateState({ cancelItemLoading: true }));
    try {
      await cancelMarketplace(
        marketplaceContract,
        account,
        Constants.nftItemType.beast,
        id
      );
      dispatch(updateState({ cancelItemLoading: false }));
      getAllBeastMarketItemsAct(
        dispatch,
        web3,
        beastContract,
        marketplaceContract
      );
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ cancelItemLoading: false }));
  };

  const handleUpdatePrice = async () => {
    dispatch(
      updateState({
        updatePriceModal: true,
        listingPrice: price,
        listingType: Constants.nftItemType.beast,
        listingId: id,
      })
    );
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
                marginRight: "10%",
                height: "20px",
              }}
              alt="Sword"
            />
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? 10 : 16,
                textShadow:
                  "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
              }}
            >
              {capacity}
            </Typography>
          </Box>
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
            {formatNumber(price.toFixed(2))} $BLST
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
            {formatNumber(price.toFixed(2))} $BLST
          </FireBtn>
        )}
      </Box>
    </Box>
  );
};
export default BeastMarketCard;
