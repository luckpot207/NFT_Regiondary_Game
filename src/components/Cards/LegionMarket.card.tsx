import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { I_Legion, I_Legion_Market } from "../../interfaces";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { formatNumber, getTranslation } from "../../utils/utils";
import {
  buyToken,
  cancelMarketplace,
  getBeastToken,
  getBloodstoneAllowance,
  getWarriorToken,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions";
import {
  useBeast,
  useBloodstone,
  useLegion,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import Tutorial from "../Tutorial/Tutorial";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CachedIcon from "@mui/icons-material/Cached";
import { useDispatch } from "react-redux";
import { getMarketplaceAddress } from "../../web3hooks/getAddress";
import Constants from "../../constants";
import FireBtn from "../Buttons/FireBtn";
import { getAllLegionsMarketItemsAct } from "../../helpers/marketplace";
import LanguageTranslate from "../UI/LanguageTranslate";

type Props = {
  legion: I_Legion_Market;
};

const LegionMarketCard: React.FC<Props> = ({ legion }) => {
  // Hook info
  const dispatch = useDispatch();
  const { language, showAnimation } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const bloodstoneContract = useBloodstone();
  const marketplaceContract = useMarketplace();

  // States
  const {
    id,
    attackPower,
    supplies,
    mp4,
    jpg,
    name,
    huntStatus,
    beastIds,
    warriorIds,
    seller,
    price,
    listingTime,
    newItem,
  } = legion;
  const huntStatusColor = huntStatus
    ? "green"
    : supplies > 0
    ? "orange"
    : "red";
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);
  const [totalCapacity, setTotalCapacity] = useState<number>(0);
  const [showType, setShowType] = useState<number>(0);
  const [beastList, setBeastList] = useState(Array);
  const [warriorList, setWarriorList] = useState(Array);

  // Functions
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const getBalance = async () => {
    try {
      let beast,
        warrior,
        totalCapacity = 0,
        tempBeasts = [],
        tempWarriors = [],
        itemList = [];

      for (let i = 0; i < beastIds.length; i++) {
        beast = await getBeastToken(beastContract, beastIds[i]);
        tempBeasts.push({ ...beast, id: beastIds[i] });
        totalCapacity += beast.capacity;
      }
      for (let i = 0; i < warriorIds.length; i++) {
        warrior = await getWarriorToken(warriorContract, warriorIds[i]);
        itemList = [];
        for (let j = 0; j < warrior.strength; j++) {
          itemList.push(
            <img
              key={`legion${id}-itemList${j}`}
              src="/assets/images/bloodstoneGrey.png"
              style={{ height: "15px" }}
              alt="icon"
            />
          );
        }
        tempWarriors.push({
          ...warrior,
          id: warriorIds[i],
          itemList: itemList,
        });
      }
      setTotalCapacity(totalCapacity);
      setWarriorList(tempWarriors);
      setBeastList(tempBeasts);
    } catch (error) {}
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
        Constants.nftItemType.legion,
        id,
        price
      );
      dispatch(updateState({ buyItemLoading: false }));
      getAllLegionsMarketItemsAct(
        dispatch,
        web3,
        legionContract,
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
        Constants.nftItemType.legion,
        id
      );
      dispatch(updateState({ cancelItemLoading: false }));
      getAllLegionsMarketItemsAct(
        dispatch,
        web3,
        legionContract,
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
        listingType: Constants.nftItemType.legion,
        listingId: id,
      })
    );
  };

  // Use Effect
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Box>
      <Card sx={{ position: "relative" }}>
        {!isShowDetail &&
          (showAnimation ? (
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
                alt="Legion Image"
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
          ))}
        {isShowDetail && (
          <CardContent sx={{ pt: 6, pb: 12 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <ButtonGroup variant="outlined" color="primary" sx={{ pt: 1 }}>
                  <Button
                    variant={showType === 1 ? "contained" : "outlined"}
                    onClick={() => {
                      setShowType(1);
                    }}
                  >
                    <LanguageTranslate translateKey="warriors" />
                  </Button>
                  <Button
                    variant={showType === 0 ? "contained" : "outlined"}
                    onClick={() => {
                      setShowType(0);
                    }}
                  >
                    <LanguageTranslate translateKey="beasts" />
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ pt: 2 }}>
              {showType === 1
                ? warriorList.map((item: any, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          backgroundColor: "black",
                          padding: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.type}
                          </Typography>
                          <Typography variant="subtitle2">
                            #{item.id}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {formatNumber(item.attackPower)} AP
                          </Typography>
                          <Box>{item.itemList}</Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))
                : beastList.map((item: any, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          backgroundColor: "black",
                          padding: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.type}
                          </Typography>
                          <Typography variant="subtitle2">
                            #{item.id}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle2">
                            {item.capacity}
                          </Typography>
                          <img
                            src="/assets/images/sword.png"
                            style={{ height: "15px", marginLeft: "5px" }}
                            alt="Sword"
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
            </Grid>
          </CardContent>
        )}
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: "15px",
            left: "20px",
            fontWeight: "bold",
          }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            top: "15px",
            right: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            color: huntStatusColor,
          }}
        >
          <div>
            {supplies} <LanguageTranslate translateKey="hSymbol" />
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            bottom: "40px",
            left: "calc(50% - 55px)",
            fontWeight: "bold",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "0.8rem",
              fontWeight: "600",
              textShadow:
                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
            }}
          >
            W {warriorIds.length} / {totalCapacity}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B {beastIds.length}
          </Typography>
          <Box
            sx={{
              display: "flex",
              cursor: "pointer",
              ml: 2,
            }}
          >
            {isShowDetail === false ? (
              <IconButton
                aria-label="claim"
                component="span"
                sx={{ padding: 0 }}
                onClick={() => {
                  setIsShowDetail(!isShowDetail);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="claim"
                component="span"
                sx={{ padding: 0 }}
                onClick={() => {
                  setIsShowDetail(!isShowDetail);
                }}
              >
                <VisibilityOffIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            alignItems: "center",
            bottom: "10px",
            left: "calc(50% - 50px)",
            fontWeight: "bold",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: "1.4rem",
              textShadow:
                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
            }}
          >
            {formatNumber(attackPower)} AP
          </Typography>
        </Box>

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
        <Typography
          variant="subtitle2"
          sx={{
            position: "absolute",
            bottom: "8px",
            left: "20px",
            color: "darkgrey",
          }}
        >
          #{id}
        </Typography>
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

export default LegionMarketCard;
