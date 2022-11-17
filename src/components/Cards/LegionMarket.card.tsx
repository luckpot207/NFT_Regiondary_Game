import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";

import { AppSelector } from "../../store";
import {
  formatNumber,
  getTranslation,
  getWarriorStrength,
} from "../../utils/utils";
import {
  useBeast,
  useBloodstone,
  useLegion,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import { getMarketplaceAddress } from "../../web3hooks/getAddress";
import FireBtn from "../Buttons/FireBtn";
import { ILegionMarket } from "../../types";
import { commonState } from "../../reducers/common.reduer";
import { apiConfig } from "../../config/api.config";
import constants from "../../constants";
import { ICapacity } from "../../types/beast.type";
import { IStrength } from "../../types/warrior.type";
import { updateMarketplaceState } from "../../reducers/marketplace.reducer";
import {
  getBloodstoneAllowance,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions/common.contract";
import {
  buyToken,
  cancelMarketplace,
} from "../../web3hooks/contractFunctions/marketplace.contract";
import gameConfig from "../../config/game.config";
import MarketplaceService from "../../services/marketplace.service";
import { updateModalState } from "../../reducers/modal.reducer";
import VideoNFT from "../UI/VideoNFT";

type Props = {
  legion: ILegionMarket;
};

const LegionMarketCard: React.FC<Props> = ({ legion }) => {
  const dispatch = useDispatch();
  const { showAnimation } = AppSelector(commonState);

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

  useEffect(() => {
    setIsShowDetail(false);
    getBalance();
  }, [legion]);

  const getBalance = async () => {
    try {
      const query = `
        {
          warriors (
            where: {
              id_in: ${JSON.stringify(warriorIds)}
            }
          ) {
            id
            attackPower
          }
          beasts (
            where: {
              id_in: ${JSON.stringify(beastIds)}
            }
          ) {
            id
            capacity
          }
        }
      `;
      const queryRes = await Axios.post(apiConfig.subgraphServer, { query });
      const beasts = queryRes.data.data.beasts;
      const warriors = queryRes.data.data.warriors;
      const totalCapacity = beasts.reduce(
        (a: any, b: any) => a + Number(b.capacity),
        0
      );
      setTotalCapacity(totalCapacity);
      setWarriorList(warriors);
      setBeastList(beasts);
    } catch (error) {}
  };

  const getType = (itemType: string, number: number) => {
    let type = "";
    if (itemType === "warrior") {
      type = constants.itemNames.warriors[number as IStrength];
    } else if (itemType === "beast") {
      type = constants.itemNames.beasts[number as ICapacity];
    }
    return type;
  };

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
        gameConfig.nftItemType.legion,
        id,
        price
      );
      dispatch(updateMarketplaceState({ buyItemLoading: false }));
      MarketplaceService.getAllLegionsMarketItemsAct(
        dispatch,
        web3,
        legionContract,
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
        gameConfig.nftItemType.legion,
        id
      );
      dispatch(updateMarketplaceState({ cancelItemLoading: false }));
      MarketplaceService.getAllLegionsMarketItemsAct(
        dispatch,
        web3,
        legionContract,
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
        listingType: gameConfig.nftItemType.legion,
        listingId: id,
        listingAttackPower: attackPower,
      })
    );
  };

  const renderList = (strength: number) => {
    let itemList = [];
    for (let j = 0; j < strength; j++) {
      itemList.push(
        <img
          key={`legion${id}-itemList${j}`}
          src="/assets/images/bloodstoneGrey.png"
          style={{ height: "15px" }}
          alt="icon"
        />
      );
    }
    return itemList;
  };

  return (
    <Box>
      <Card sx={{ position: "relative" }}>
        {!isShowDetail &&
          (showAnimation ? (
            <VideoNFT src={mp4.valueOf()} />
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
                    {getTranslation("warriors")}
                  </Button>
                  <Button
                    variant={showType === 0 ? "contained" : "outlined"}
                    onClick={() => {
                      setShowType(0);
                    }}
                  >
                    {getTranslation("beasts")}
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
                            {getType(
                              "warrior",
                              getWarriorStrength(Number(item.attackPower))
                            )}
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
                          <Box>
                            {renderList(
                              getWarriorStrength(Number(item.attackPower))
                            )}
                          </Box>
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
                            {getType("beast", Number(item.capacity))}
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
            {supplies} {getTranslation("hSymbol")}
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
                  getBalance();
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

export default LegionMarketCard;
