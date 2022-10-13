import {
    Box,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    InputBase,
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
        currentLegionIndexForDuel,
        divisions,
        endDateJoinDuel,
        currentDuelId,
    } = AppSelector(gameState);
    // Account & Web3
    const { account } = useWeb3React();
    const web3 = useWeb3();

    // contract
    const feeHandlerContract = useFeeHandler();
    const duelContract = useDuelSystem();
    const legionContract = useLegion();

    const [estimatePrice, setEstimatePrice] = useState(0);
    const [divisionIndex, setDivisionIndex] = useState(0);
    const [leftTime, setLeftTime] = useState("");
    const [joinLeftTime, setJoinLeftTime] = useState("");

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
        setEstimatePrice(price)
    }

    const handleClose = () => {
        dispatch(updateState({ joinDuelModalOpen: false }))
    }

    const handleJoinDuel = async () => {
        
        if (!confirmUnclaimedWallet(divisions[divisionIndex].betPrice)) {
            const blstAmount = await getBLSTAmount(web3, feeHandlerContract, divisions[divisionIndex].betPrice) ;
            toast.error(`To create duel, you need have ${Math.round(blstAmount)} $BLST in your UnClainedWallet`);
            return;
        }
        try {
            console.log("betprice", allLegions[currentLegionIndexForDuel.valueOf()].id);
            const res = await joinDuel(duelContract, account, currentDuelId, allLegions[currentLegionIndexForDuel.valueOf()].id, estimatePrice.valueOf()* (10 ** 18));
            dispatch(updateState({ joinDuelModalOpen: false }));
            toast.success("Successfully joined");
            getAllDuelsAct(dispatch, account, duelContract, legionContract);
        } catch (e) {
            toast.error("Network issue");
            console.log(e);
        }
    }

    useEffect(() => {
        if (allLegions.length != 0) {
            divisions.forEach((division, index) => {
                if (allLegions[currentLegionIndexForDuel.valueOf()].attackPower >= division.minAP && allLegions[currentLegionIndexForDuel.valueOf()].attackPower < division.maxAP) {
                    setDivisionIndex(index);
                }
            });
        }
    }, [currentLegionIndexForDuel])

    return (
        <Dialog open={joinDuelModalOpen.valueOf()} onClose={handleClose}>
            <DialogTitle>Join Duel</DialogTitle>
            <DialogContent dividers>
                <Typography>What do you think the $BLST price in BUSD will be in exactly {leftTime} hours from now?</Typography>
                <Box
                    sx={{
                        padding: "20px",
                        fontSize: "1.2em",
                        fontWeight: "bold",
                    }}
                >
                    <a href="https://pancakeswap.finance/swap?outputCurrency=0x63441E5C9F55B5A9141f3D834a28426Ca1c5C5cC&inputCurrency=BNB" target="_blank" style={{ color: "orange", textDecoration: "none" }}>Check Price Now</a>
                </Box>
                <Box>
                    <Typography mt={1} mb={1}>Your Legion's division : {divisions[divisionIndex].minAP.valueOf() / 1000}K - {divisions[divisionIndex].maxAP.valueOf() / 1000}K AP </Typography>
                    <Typography mb={1}>You will bet : ${divisions[divisionIndex].betPrice}</Typography>
                    <Typography mb={1}>You might lose up to {divisions[divisionIndex].maxAP.valueOf() / 10}AP</Typography>
                    <Typography mb={1}>You might win: ${2 * divisions[divisionIndex].betPrice.valueOf() * 0.8}</Typography>
                    <Grid container mb={1} spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>I think 1 $BLST will be = </Grid>
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
                        <Grid item xs={6} sm={2} md={4} lg={1}>BUSD</Grid>
                    </Grid>
                    <Typography mb={1}>To Create this Duel, you must bet ${divisions[divisionIndex].betPrice.valueOf()} from your Unclaimed Wallet</Typography>
                    <Typography mb={1}>Time left to join this Duel: {joinLeftTime}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}><FireBtn onClick={handleJoinDuel} sx={{ width: "100px" }}>Bet</FireBtn></Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
export default JoinDuelModal;
