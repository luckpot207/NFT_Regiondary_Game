import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CachedIcon from "@mui/icons-material/Cached";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import Swal from "sweetalert2";
import Axios from "axios";

import { AppSelector } from "../../store";
import {
  formatNumber,
  getTranslation,
  getWarriorStrength,
} from "../../utils/utils";
import { useLegion } from "../../web3hooks/useContract";
import { ILegion } from "../../types";
import { commonState } from "../../reducers/common.reduer";
import { updateModalState } from "../../reducers/modal.reducer";
import {
  changeLegionExecuteStatus,
  updateLegionState,
} from "../../reducers/legion.reducer";
import { updateMarketplaceState } from "../../reducers/marketplace.reducer";
import { getLegionLastHuntTime } from "../../web3hooks/contractFunctions/legion.contract";
import constants from "../../constants";
import { apiConfig } from "../../config/api.config";
import { IStrength } from "../../types/warrior.type";
import { ICapacity } from "../../types/beast.type";
import LegionService from "../../services/legion.service";
import gameConfig from "../../config/game.config";

type Props = {
  legion: ILegion;
  index: number;
};

const oneDay = 24 * 2600 * 1000;

const LegionCard: React.FC<Props> = ({ legion, index }) => {
  const dispatch = useDispatch();
  const { showAnimation } = AppSelector(commonState);

  const { account } = useWeb3React();

  const legionContract = useLegion();

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
    executeStatus,
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
  const [lastHuntTime, setLastHuntTime] = useState(0);

  let canSell = false;
  if (huntStatus) {
    canSell = true;
  } else {
    if (supplies === 0 && lastHuntTime + oneDay < new Date().getTime()) {
      canSell = true;
    }
  }

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    try {
      setLastHuntTime(
        Number(await getLegionLastHuntTime(legionContract, id)) * 1000
      );
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
      console.log(beasts, warriors, beastIds, warriorIds);
    } catch (error) {}
  };

  const getType = (itemType: string, number: number) => {
    let type = "";
    if (itemType === "warrior") {
      type = constants.itemNames.warriors[number as IStrength];
    }
    if (itemType === "beast") {
      type = constants.itemNames.beasts[number as ICapacity];
    }
    return type || "";
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

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const handleBuySupplies = () => {
    dispatch(
      updateModalState({
        buySuppliesModalOpen: true,
      })
    );
    dispatch(updateLegionState({ legionForSupplies: legion }));
  };

  const handleSelectExecuteStatus = () => {
    dispatch(changeLegionExecuteStatus(id));
  };

  const handleExecuteLegion = () => {
    if (attackPower > 2000) {
      Swal.fire({
        title: getTranslation("warning"),
        text: getTranslation("executeLegionWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: constants.color.color2,
        cancelButtonColor: "#d33",
        confirmButtonText: getTranslation("execute"),
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          LegionService.handleExecuteLegions(
            dispatch,
            account,
            legionContract,
            [id]
          );
        }
      });
    } else {
      LegionService.handleExecuteLegions(dispatch, account, legionContract, [
        id,
      ]);
    }
  };

  const handleToMarketplace = () => {
    dispatch(updateModalState({ listOnMarketplaceModalOpen: true }));
    dispatch(
      updateMarketplaceState({
        listingPrice: 0,
        listingType: gameConfig.nftItemType.legion,
        listingId: id,
      })
    );
  };

  return (
    <Card
      sx={{ position: "relative" }}
      className={classNames({ executeitem: executeStatus }, "legionCard")}
    >
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
                        <Typography variant="subtitle2">#{item.id}</Typography>
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
                        <Typography variant="subtitle2">#{item.id}</Typography>
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
        id={index === 0 ? "first-legion-add-supply" : `legion-card-${index}`}
        onClick={() => handleBuySupplies()}
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
      {attackPower >= 2000 && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "10px",
            right: "20px",
            cursor: "pointer",
          }}
          onClick={() => canSell && handleToMarketplace()}
        >
          {canSell ? (
            <img
              src="/assets/images/shopping.png"
              style={{ height: "20px" }}
              alt="Shopping"
            />
          ) : (
            <Tooltip
              title={getTranslation("wait24hoursAfterHuntingToSell")}
              placement="left"
            >
              <img
                src="/assets/images/shoppingRed.png"
                style={{ height: "20px" }}
                alt="Shopping"
              />
            </Tooltip>
          )}
        </Box>
      )}
      <Checkbox
        sx={
          executeStatus
            ? {
                opacity: 1,
                position: "absolute",
                bottom: "calc(2% + 40px)",
              }
            : {
                position: "absolute",
                bottom: "calc(2% + 40px)",
              }
        }
        className="executeCheckBox"
        checked={executeStatus}
        onClick={() => handleSelectExecuteStatus()}
      />
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          bottom: "calc(2% + 50px)",
          left: "2%",
          cursor: "pointer",
        }}
        onClick={() => handleExecuteLegion()}
      >
        <img
          src="/assets/images/execute.png"
          style={{ height: "20px" }}
          alt="Execute"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          bottom: "30px",
          left: "20px",
          cursor: "pointer",
        }}
      >
        <NavLink to={`/updatecybers/${legion.id}`} className="td-none">
          <IconButton aria-label="claim" component="span" sx={{ padding: 0 }}>
            <CachedIcon />
          </IconButton>
        </NavLink>
      </Box>
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
  );
};

export default LegionCard;
