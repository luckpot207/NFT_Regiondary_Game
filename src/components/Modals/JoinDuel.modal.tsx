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
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {
    gameState,
    updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useDuelSystem, useFeeHandler, useLegion, useWeb3 } from "../../web3hooks/useContract";
import LanguageTranslate from "../../components/UI/LanguageTranslate";
import FireBtn from "../Buttons/FireBtn";
import { joinDuel, getBLSTAmount } from "../../web3hooks/contractFunctions";
import { toast } from "react-toastify";
import { getAllDuelsAct } from "../../helpers/duel";
import { confirmUnclaimedWallet } from "../../helpers/duel";
import { FaTimes } from "react-icons/fa";
import OrgMenuItem from "../../components/UI/OrgMenuItem";
import GreenMenuItem from "../../components/UI/GreenMenuItem";
import RedMenuItem from "../../components/UI/RedMenuItem";
import { I_Legion, I_Division } from "../../interfaces";
import { doingDuels } from "../../web3hooks/contractFunctions";


const LegionSelectInput = styled(InputBase)(({ theme }) => ({
    '.MuiSelect-select': {
        paddingBottom: "5px",
        textAlign: "right",
        border: '1px solid #ced4da',
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #ced4da',
        fontSize: 16,
        paddingLeft: 10,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
    }
}));

const PriceTextField = styled(TextField)({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none",
    },

    '& input.MuiInput-input': {
        paddingTop: '0px',
        paddingBottom: '0px',
        textAlign: "center",
        MozAppearance: "TextField",
    },
});

const JoinDuelModal: React.FC = () => {
    const dispatch = useDispatch();
    const {
        allLegions,
        joinDuelModalOpen,
        divisions,
        // endDateJoinDuel,
        currentDuelId,
        allDuels,
        BLSTToUSD,
    } = AppSelector(gameState);
    // Account & Web3
    const { account } = useWeb3React();
    const web3 = useWeb3();

    // contract
    const feeHandlerContract = useFeeHandler();
    const duelContract = useDuelSystem();
    const legionContract = useLegion();

    const [estimatePrice, setEstimatePrice] = useState<number>(0);
    const [divisionIndex, setDivisionIndex] = useState<number>(0);
    const [currentDuelDivisionIndex, setCurrentDuelDivisionIndex] = useState<number>(0);
    const [endDateJoinDuel, setEndDateJoinDuel] = useState<string>("");
    const [leftTime, setLeftTime] = useState<string>("");
    const [joinLeftTime, setJoinLeftTime] = useState<string>("");
    const [duelType, setDuelType] = useState<boolean>(true);
    const [legionsDuelStatus, setLegionsDuelStatus] = useState<boolean[]>([]);
    const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);
    const [joinDuelLoading, setJoinDuelLoading] = useState<boolean>(false);

    const [blstAmount, setBlstAmount] = useState<number>(0);
    const [blstAmountWin, setBlstAmountWin] = useState<number>(0);

    const setBlstAmountForDuel = async () => {
        try {
            const blstAmountTemp = await getBLSTAmount(web3, feeHandlerContract, divisions[divisionIndex].betPrice);
            setBlstAmount(blstAmountTemp);
            const blstAmountWinTemp = await getBLSTAmount(web3, feeHandlerContract, 2 * divisions[divisionIndex].betPrice.valueOf() * 0.8);
            setBlstAmountWin(blstAmountWinTemp);

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        setBlstAmountForDuel();
    }, [divisionIndex]);

    const getBalance = async () => {
        var legionsDueStatusTemp: boolean[] = [];
        for (let i = 0; i < allLegions.length; i++) {
            const legion = allLegions[i];
            const res = await doingDuels(duelContract, legion.id)
            legionsDueStatusTemp.push(res);
        }
        setLegionsDuelStatus(legionsDueStatusTemp);
    }

    useEffect(() => {
        const leftTimer = setInterval(() => {
            const join_left_time = (new Date(endDateJoinDuel.valueOf()).getTime() - new Date().getTime());
            const joinLeftTimeStr = "" + Math.floor(join_left_time / (60 * 60 * 1000)) + "h " + Math.floor(join_left_time % (60 * 60 * 1000) / (60 * 1000)) + "m " + Math.floor(join_left_time % (60 * 1000) / (1000)) + "s";
            const leftTimeStr = "" + (Math.floor(join_left_time / (60 * 60 * 1000)) + 18) + "h " + Math.floor(join_left_time % (60 * 60 * 1000) / (60 * 1000)) + "m " + Math.floor(join_left_time % (60 * 1000) / (1000)) + "s";
            setJoinLeftTime(joinLeftTimeStr);
            setLeftTime(leftTimeStr)

        }, 1000);
        return () => clearInterval(leftTimer);
    }, [leftTime, endDateJoinDuel])

    const handleChangeEstimatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        if (price > 10000 || price * 10000 - Math.floor(price * 10000) > 0) {
            setEstimatePrice(estimatePrice);
            return;
        }
        setEstimatePrice(price)
    }

    const handleClose = () => {
        dispatch(updateState({ joinDuelModalOpen: false }))
    }

    const handleJoinDuel = async () => {
        if (!confirmUnclaimedWallet(divisions[divisionIndex].betPrice)) {
            const blstAmount = await getBLSTAmount(web3, feeHandlerContract, divisions[divisionIndex].betPrice);
            toast.error(`To create duel, you need have ${Math.round(blstAmount)} $BLST in your UnClainedWallet`);
            return;
        }
        try {
            setJoinDuelLoading(true);
            console.log("Join duel: ", account, currentDuelId, allLegions[currentLegionIndex.valueOf()].id, estimatePrice.valueOf() * (10 ** 18));
            const res = await joinDuel(duelContract, account, currentDuelId, allLegions[currentLegionIndex.valueOf()].id, estimatePrice.valueOf() * (10 ** 18));
            setJoinDuelLoading(false);
            dispatch(updateState({ joinDuelModalOpen: false }));
            toast.success("Successfully joined");
            getAllDuelsAct(dispatch, account, duelContract, legionContract);
        } catch (e) {
            setJoinDuelLoading(false);
            toast.error("Network issue");
            console.log(e);
        }
    }

    const handleSelectLegion = (e: SelectChangeEvent) => {
        const legionIndex = parseInt(e.target.value);
        setCurrentLegionIndex(legionIndex);
        setDivisionIndex(-1);
        divisions.forEach((division: I_Division, index: Number) => {
            if (allLegions[legionIndex].attackPower >= division.minAP && allLegions[legionIndex].attackPower < division.maxAP) {
                setDivisionIndex(index.valueOf());
            }
        });
    };

    useEffect(() => {
        getBalance();
        allDuels.forEach((duel, index) => {
            if (duel.duelId == currentDuelId) {
                const duelTypeFlag = duel.type.valueOf() == 1 ? true : false;
                setDuelType(duelTypeFlag);
                setEndDateJoinDuel(duel.endDateTime.valueOf());
                divisions.forEach((division, index) => {
                    if (duel.creatorLegion.attackPower >= division.minAP && duel.creatorLegion.attackPower < division.maxAP) {
                        setCurrentDuelDivisionIndex(index);
                        setEstimatePrice(0);
                        setCurrentLegionIndex(0);
                    }
                    if (allLegions[0].attackPower >= division.minAP && allLegions[0].attackPower < division.maxAP) {
                        setDivisionIndex(index);
                    }
                });
            }
        });

    }, [joinDuelModalOpen, allLegions])

    return (
        <Dialog open={joinDuelModalOpen.valueOf()} onClose={handleClose}>
            <DialogTitle sx={{
                display: "flex",
                flexDirection: "row",
                alignItem: "center",
                justifyContent: "space-between"
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold"
                    }}
                >
                    Join Duel
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
                <Typography>What do you think the $BLST price in BUSD will be in exactly {leftTime} hours from now?</Typography>
                <Typography>Currently 1 $CRYPTO = ${Math.round(BLSTToUSD.valueOf() * 10000) / 100}</Typography>
                <Box
                    sx={{
                        padding: "20px",
                        fontSize: "1.2em",
                        fontWeight: "bold",
                    }}
                >
                    <a href="https://coinmarketcap.com/dexscan/bsc/0x13fade99f5d7038cd53261770d80902c8756adae" target="_blank" style={{ color: "#0df8f9", textDecoration: "none" }}>See Price Chart</a>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={4}>Select your Legion :</Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} >
                        <FormControl>
                            <Select
                                id="hunt-legion-select"
                                value={currentLegionIndex.toString()}
                                onChange={handleSelectLegion}
                                input={<LegionSelectInput />}
                            >
                                {
                                    allLegions.length != 0
                                        ? allLegions.map((legion: I_Legion, index: number) =>
                                            legionsDuelStatus[index] ? (
                                                <OrgMenuItem value={index} key={index}>
                                                    {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                </OrgMenuItem>
                                            ) : legion.attackPower >= divisions[currentDuelDivisionIndex].minAP && legion.attackPower < divisions[currentDuelDivisionIndex].maxAP ? (
                                                <GreenMenuItem value={index} key={index}>
                                                    {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                </GreenMenuItem>
                                            ) : <RedMenuItem value={index} key={index}>
                                                {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                            </RedMenuItem>

                                        ) : <></>}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
              
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex == currentDuelDivisionIndex
                    && <Typography mt={1} mb={1}>Your Legion's division : {divisions[currentDuelDivisionIndex].minAP.valueOf() / 1000}K - {divisions[divisionIndex].maxAP.valueOf() / 1000}K AP </Typography>
                }
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex == currentDuelDivisionIndex
                    && <>
                        <Typography mb={1}>You will bet : ${divisions[currentDuelDivisionIndex].betPrice}  ( = {Math.round(blstAmount * 100) / 100} $CRYPTO)</Typography>
                    </>
                }
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex == currentDuelDivisionIndex
                    && !duelType
                    && <>
                        <Typography mb={1}>You might lose up to all of your legion's AP ({allLegions[currentLegionIndex].attackPower.valueOf()})</Typography>
                    </>
                }
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex == currentDuelDivisionIndex
                    && duelType
                    && <>
                        <Typography mb={1}>You might lose up to {allLegions[currentLegionIndex].attackPower.valueOf() / 10}AP</Typography>
                    </>
                }
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex == currentDuelDivisionIndex
                    && <>
                        <Typography mb={1}>You might win: ${2 * divisions[currentDuelDivisionIndex].betPrice.valueOf() * 0.8}  ( = {Math.round(blstAmountWin * 100) / 100} $CRYPTO)</Typography>
                        <Typography mb={1}>To Join this Duel, you must bet ${divisions[currentDuelDivisionIndex].betPrice.valueOf()} from your Unclaimed Wallet</Typography>
                    </>
                }
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex == currentDuelDivisionIndex
                    && <>
                        <Typography mb={1}>You have {joinLeftTime} left to join this Duel</Typography>
                        <Grid container mb={1} spacing={1}>
                            <Grid item xs={12} sm={5} md={5} lg={5} sx={{ fontWeight: "bold" }}>I think 1 $BLST will be = </Grid>
                            <Grid item xs={6} sm={4} md={4} lg={2}>
                                <PriceTextField
                                    id="outlined-number"
                                    variant="standard"
                                    type="number"
                                    value={estimatePrice}
                                    onChange={handleChangeEstimatePrice}
                                    sx={{ padding: "0 !important" }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2} md={4} lg={1} sx={{ fontWeight: "bold" }}>BUSD</Grid>
                        </Grid>
                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}><FireBtn onClick={handleJoinDuel} sx={{ width: "100px" }} loading={joinDuelLoading}>Join</FireBtn></Box>
                    </>
                }
                {
                    !legionsDuelStatus[currentLegionIndex]
                    && allLegions.length != 0
                    && divisionIndex != currentDuelDivisionIndex
                    && <Typography mt={1} mb={1}>Your Legion is outside of current duel division.</Typography>
                }
                {
                    (legionsDuelStatus[currentLegionIndex]
                    || allLegions.length == 0)
                    && <Box mt={2} mb={2}>You can't join with this legion.</Box>
                }
            </DialogContent>
        </Dialog>
    );
};
export default JoinDuelModal;
