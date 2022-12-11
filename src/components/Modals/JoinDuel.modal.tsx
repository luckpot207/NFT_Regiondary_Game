import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  InputBase,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { duelState } from "../../reducers/duel.reducer";
import { legionState } from "../../reducers/legion.reducer";
import { inventoryState } from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { AppSelector } from "../../store";
import {
  useDuelSystem,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { getBLSTAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import DuelService from "../../services/duel.service";
import { FaTimes } from "react-icons/fa";
import OrgMenuItem from "../../components/UI/OrgMenuItem";
import GreenMenuItem from "../../components/UI/GreenMenuItem";
import RedMenuItem from "../../components/UI/RedMenuItem";
import { ILegion, IDivision } from "../../types";
import {
  doingDuels,
  joinDuel,
} from "../../web3hooks/contractFunctions/duel.contract";
import { convertInputNumberToStr, getTranslation } from "../../utils/utils";
import constants from "../../constants";
import gameConfig from "../../config/game.config";

const LegionSelectInput = styled(InputBase)(({ theme }) => ({
  ".MuiSelect-select": {
    paddingBottom: "5px",
    textAlign: "right",
    border: "1px solid #ced4da",
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    paddingLeft: 10,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const PriceTextField = styled(TextField)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input.MuiInput-input": {
    paddingTop: "0px",
    paddingBottom: "0px",
    textAlign: "center",
    MozAppearance: "TextField",
  },
});

const JoinDuelModal: React.FC = () => {
  const dispatch = useDispatch();
  const { allLegions } = AppSelector(legionState);
  const { divisions, allDuels, currentDuelId } = AppSelector(duelState);
  const { BLSTToUSD } = AppSelector(inventoryState);
  const { joinDuelModalOpen } = AppSelector(modalState);
  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // contract
  const feeHandlerContract = useFeeHandler();
  const duelContract = useDuelSystem();
  const legionContract = useLegion();

  const [estimatePrice, setEstimatePrice] = useState<number>(0);
  const [divisionIndex, setDivisionIndex] = useState<number>(0);
  const [currentDuelDivisionIndex, setCurrentDuelDivisionIndex] =
    useState<number>(0);
  const [endDateJoinDuel, setEndDateJoinDuel] = useState<string>("");
  const [leftTime, setLeftTime] = useState<string>("");
  const [joinLeftTime, setJoinLeftTime] = useState<string>("");
  const [duelType, setDuelType] = useState<boolean>(true);
  const [legionsDuelStatus, setLegionsDuelStatus] = useState<boolean[]>([]);
  const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);
  const [joinDuelLoading, setJoinDuelLoading] = useState<boolean>(false);

  const [blstAmount, setBlstAmount] = useState<number>(0);
  const [blstAmountWin, setBlstAmountWin] = useState<number>(0);

  useEffect(() => {
    setBlstAmountForDuel();
  }, [divisionIndex]);

  useEffect(() => {
    const leftTimer = setInterval(() => {
      const join_left_time =
        new Date(endDateJoinDuel.valueOf()).getTime() - new Date().getTime();
      const joinLeftTimeStr =
        "" +
        Math.floor(join_left_time / (60 * 60 * 1000)) +
        "h " +
        Math.floor((join_left_time % (60 * 60 * 1000)) / (60 * 1000)) +
        "m " +
        Math.floor((join_left_time % (60 * 1000)) / 1000) +
        "s";
      const leftTimeStr =
        "" +
        (Math.floor(join_left_time / (60 * 60 * 1000)) + 18) +
        "h " +
        Math.floor((join_left_time % (60 * 60 * 1000)) / (60 * 1000)) +
        "m " +
        Math.floor((join_left_time % (60 * 1000)) / 1000) +
        "s";
      setJoinLeftTime(joinLeftTimeStr);
      setLeftTime(leftTimeStr);
    }, 1000);
    return () => clearInterval(leftTimer);
  }, [leftTime, endDateJoinDuel]);

  useEffect(() => {
    getBalance();
    console.log(allDuels);
    allDuels.forEach((duel, index) => {
      if (duel.duelId == currentDuelId) {
        const duelTypeFlag = duel.type.valueOf() == 1 ? true : false;
        setDuelType(duelTypeFlag);
        setEndDateJoinDuel(duel.endDateTime.valueOf());
        divisions.forEach((division, index) => {
          if (
            duel.creatorLegion.attackPower >= division.minAP &&
            duel.creatorLegion.attackPower < division.maxAP
          ) {
            setCurrentDuelDivisionIndex(index);
            setEstimatePrice(0);
            setCurrentLegionIndex(0);
          }
          if (
            allLegions[0]?.attackPower >= division.minAP &&
            allLegions[0]?.attackPower < division.maxAP
          ) {
            setDivisionIndex(index);
          }
        });
      }
    });
  }, [joinDuelModalOpen, allLegions]);

  const setBlstAmountForDuel = async () => {
    try {
      const blstAmountTemp = await getBLSTAmount(
        web3,
        feeHandlerContract,
        divisions[divisionIndex].betPrice
      );
      setBlstAmount(blstAmountTemp);
      const blstAmountWinTemp = await getBLSTAmount(
        web3,
        feeHandlerContract,
        2 * divisions[divisionIndex].betPrice.valueOf() * 0.8
      );
      setBlstAmountWin(blstAmountWinTemp);
    } catch (e) {
      console.log(e);
    }
  };

  const getBalance = async () => {
    var legionsDueStatusTemp: boolean[] = [];
    for (let i = 0; i < allLegions.length; i++) {
      const legion = allLegions[i];
      const res = await doingDuels(duelContract, legion.id);
      legionsDueStatusTemp.push(res);
    }
    setLegionsDuelStatus(legionsDueStatusTemp);
  };

  const handleChangeEstimatePrice = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const price =
      Number(e.target.value) > gameConfig.maxEstimatePrice
        ? gameConfig.maxEstimatePrice
        : Number(Number(e.target.value).toFixed(4)) === Number(e.target.value)
        ? Number(e.target.value)
        : estimatePrice;
    setEstimatePrice(price < 0 ? 0 : price);
  };

  const handleClose = () => {
    dispatch(updateModalState({ joinDuelModalOpen: false }));
  };

  const handleJoinDuel = async () => {
    if (
      !DuelService.confirmUnclaimedWallet(divisions[divisionIndex].betPrice)
    ) {
      const blstAmount = await getBLSTAmount(
        web3,
        feeHandlerContract,
        divisions[divisionIndex].betPrice
      );
      toast.error(
        getTranslation(
          "toCreateThisDuelYouNeedToHaveAtLeastBLSTInYourUnClaimedWallet",
          {
            CL1: Math.round(blstAmount),
          }
        )
      );
      return;
    }
    try {
      setJoinDuelLoading(true);
      const res = await joinDuel(
        duelContract,
        account,
        currentDuelId,
        allLegions[currentLegionIndex.valueOf()].id,
        estimatePrice.valueOf() * 10 ** 18
      );
      setJoinDuelLoading(false);
      dispatch(updateModalState({ joinDuelModalOpen: false }));
      toast.success(getTranslation("successfullyjoined"));
      DuelService.getAllDuelsAct(
        dispatch,
        web3,
        account,
        duelContract,
        legionContract
      );
    } catch (e) {
      setJoinDuelLoading(false);
      console.log(e);
    }
  };

  const handleSelectLegion = (e: SelectChangeEvent) => {
    const legionIndex = parseInt(e.target.value);
    setCurrentLegionIndex(legionIndex);
    setDivisionIndex(-1);
    divisions.forEach((division: IDivision, index: Number) => {
      if (
        allLegions[legionIndex].attackPower >= division.minAP &&
        allLegions[legionIndex].attackPower < division.maxAP
      ) {
        setDivisionIndex(index.valueOf());
      }
    });
  };

  return (
    <Dialog
      open={joinDuelModalOpen.valueOf()}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          {getTranslation("joinduel")}
        </Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.8em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          {getTranslation(
            "whatDoYouThinkTheCryptoPriceInBUSDWillBeInExactlyHoursFromNow",
            {
              CL1: leftTime,
            }
          )}
        </Typography>
        <Typography>
          {getTranslation("currenty1cryptois", {
            CL1: Math.round(BLSTToUSD.valueOf() * 10000) / 10000,
          })}
        </Typography>
        <Box
          sx={{
            padding: "20px",
            fontSize: "1.2em",
            fontWeight: "bold",
          }}
        >
          <a
            href={constants.navlink.tokenPriceUrl}
            target="_blank"
            style={{ color: constants.color.color2, textDecoration: "none" }}
          >
            {getTranslation("seepricechart")}
          </a>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            {getTranslation("selectyourlegion")}:
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormControl>
              <Select
                id="hunt-legion-select"
                value={currentLegionIndex.toString()}
                onChange={handleSelectLegion}
                input={<LegionSelectInput />}
              >
                {allLegions.length != 0 ? (
                  allLegions.map((legion: ILegion, index: number) =>
                    legionsDuelStatus[index] ? (
                      <OrgMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} ${gameConfig.symbols.attackPower})`}
                      </OrgMenuItem>
                    ) : legion.attackPower >=
                        divisions[currentDuelDivisionIndex].minAP &&
                      legion.attackPower <
                        divisions[currentDuelDivisionIndex].maxAP ? (
                      <GreenMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} ${gameConfig.symbols.attackPower})`}
                      </GreenMenuItem>
                    ) : (
                      <RedMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} ${gameConfig.symbols.attackPower})`}
                      </RedMenuItem>
                    )
                  )
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex == currentDuelDivisionIndex && (
            <Typography mt={1} mb={1}>
              {getTranslation("yourlegiondivision")}:{" "}
              {divisions[currentDuelDivisionIndex].minAP.valueOf() / 1000}K -{" "}
              {divisions[divisionIndex].maxAP.valueOf() / 1000}K{" "}
              {gameConfig.symbols.attackPower}{" "}
            </Typography>
          )}
        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex == currentDuelDivisionIndex && (
            <>
              <Typography mb={1}>
                {getTranslation("youwillbet")} :{" "}
                {divisions[divisionIndex].betPrice} BUSD ( ={" "}
                {Math.round(blstAmount * 100) / 100} ${getTranslation("blst")})
              </Typography>
            </>
          )}
        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex == currentDuelDivisionIndex &&
          !duelType && (
            <>
              <Typography mb={1}>
                {getTranslation("youmightloseuptoallofyourlegionap")} (
                {allLegions[currentLegionIndex].attackPower.valueOf()})
              </Typography>
            </>
          )}
        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex == currentDuelDivisionIndex &&
          duelType && (
            <>
              <Typography mb={1}>
                {getTranslation("youmightloseupto", {
                  CL1: Math.round(
                    allLegions[currentLegionIndex].attackPower.valueOf() / 10
                  ),
                })}
              </Typography>
            </>
          )}
        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex == currentDuelDivisionIndex && (
            <>
              <Typography mb={1}>
                {getTranslation("youmightwin")}:{" "}
                {2 *
                  divisions[currentDuelDivisionIndex].betPrice.valueOf() *
                  0.8}{" "}
                BUSD ( = {Math.round(blstAmountWin * 100) / 100} $
                {getTranslation("blst")})
              </Typography>
              <Typography mb={1}>
                {getTranslation(
                  "toJoinThisDuelYouMustBetBUSDFromYourUnclaimedWallet",
                  {
                    CL1: divisions[currentDuelDivisionIndex].betPrice.valueOf(),
                  }
                )}
              </Typography>
            </>
          )}
        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex == currentDuelDivisionIndex && (
            <>
              <Typography mb={1}>
                {getTranslation("youHaveLeftTimeToJoinThisDuel", {
                  CL1: joinLeftTime,
                })}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ fontWeight: "bold" }}>
                  {getTranslation("ithink1blstwillbe")}
                </Box>
                <PriceTextField
                  id="outlined-number"
                  variant="standard"
                  type="number"
                  value={convertInputNumberToStr(estimatePrice)}
                  onChange={handleChangeEstimatePrice}
                  sx={{ padding: "0 !important" }}
                />
                <Box sx={{ fontWeight: "bold" }}>BUSD</Box>
              </Box>
              {/* <Grid container mb={1} spacing={1}>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={5}
                  lg={5}
                  sx={{ fontWeight: "bold" }}
                >
                  {getTranslation("ithink1blstwillbe")}{" "}
                </Grid>
                <Grid item xs={6} sm={4} md={4} lg={2}>
                  <PriceTextField
                    id="outlined-number"
                    variant="standard"
                    type="number"
                    value={convertInputNumberToStr(estimatePrice)}
                    onChange={handleChangeEstimatePrice}
                    sx={{ padding: "0 !important" }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={2}
                  md={4}
                  lg={1}
                  sx={{ fontWeight: "bold" }}
                >
                  BUSD
                </Grid>
              </Grid> */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <FireBtn
                  onClick={handleJoinDuel}
                  sx={{ width: "100px" }}
                  loading={joinDuelLoading}
                >
                  {getTranslation("join")}
                </FireBtn>
              </Box>
            </>
          )}
        {!legionsDuelStatus[currentLegionIndex] &&
          allLegions.length != 0 &&
          divisionIndex != currentDuelDivisionIndex && (
            <Typography mt={1} mb={1}>
              {getTranslation("yourlegionisoutsideofcurrentdueldivision")}
            </Typography>
          )}
        {(legionsDuelStatus[currentLegionIndex] || allLegions.length == 0) && (
          <Box mt={2} mb={2}>
            {getTranslation("youcannotjoinwiththislegion")}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default JoinDuelModal;
