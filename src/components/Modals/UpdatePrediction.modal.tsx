import {
    Box,
    Card,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Button,
    ButtonGroup,
    InputBase,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from "react";
import { alpha, styled } from '@mui/material/styles';
import {
    gameState,
    updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
    useWeb3,
    useDuelSystem,
    useLegion,
} from "../../web3hooks/useContract";

import FireBtn from "../Buttons/FireBtn";
import { updatePrediction } from "../../web3hooks/contractFunctions";
import { toast } from "react-toastify";
import { getAllDuelsAct } from "../../helpers/duel";
import { FaTimes } from "react-icons/fa";

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

const UpdatePredictionModal: React.FC = () => {
    const dispatch = useDispatch();
    const {
        allDuels,
        updatePredictionModalOpen,
        currentDuelId,
    } = AppSelector(gameState);
    // Account & Web3
    const { account } = useWeb3React();

    // Contract
    const duelContract = useDuelSystem();
    const legionContract = useLegion();
    const [estimatePrice, setEstimatePrice] = useState<number>(0);
    const [endDateTime, setEndDateTime] = useState<string>("");
    const [leftTime, setLeftTime] = useState<string>("");
    const [duelLeftTime, setDuelLeftTime] = useState<string>("");
    const [currentPrediction, setCurrentPrediction] = useState<number>(0);
    const [updatePredictionLoading, setUpdatePredictionLoading] = useState<boolean>(false);

    const handleChangeEstimatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        if (price > 10000 || price * 10000 - Math.floor(price * 10000) > 0) {
            setEstimatePrice(estimatePrice);
            return;
        }
        setEstimatePrice(price);
    }

    const handleClose = () => {
        dispatch(updateState({ updatePredictionModalOpen: false }))
    }

    const handleSubmit = async () => {
        if (estimatePrice.valueOf() < 0) {
            toast.error("Please provide valid value!");
            return;
        }
        try {
            setUpdatePredictionLoading(true);
            const res = await updatePrediction(duelContract, account, currentDuelId, estimatePrice.valueOf() * (10 ** 18));
            setUpdatePredictionLoading(false);
            dispatch(updateState({ updatePredictionModalOpen: false }));
            toast.success("Your prediction has been updated.");
            getAllDuelsAct(dispatch, account, duelContract, legionContract);
        } catch (error) {
            setUpdatePredictionLoading(false);
            toast.error("Network issue")
        }
    }

    useEffect(() => {
        const leftTimer = setInterval(() => {
            const join_left_time = (new Date(endDateTime.valueOf()).getTime() - new Date().getTime());
            const joinLeftTimeStr = "" + Math.floor(join_left_time / (60 * 60 * 1000)) + "h " + Math.floor(join_left_time % (60 * 60 * 1000) / (60 * 1000)) + "m " + Math.floor(join_left_time % (60 * 1000) / (1000)) + "s";
            const leftTimeStr = "" + (Math.floor(join_left_time / (60 * 60 * 1000)) + 18) + "h " + Math.floor(join_left_time % (60 * 60 * 1000) / (60 * 1000)) + "m " + Math.floor(join_left_time % (60 * 1000) / (1000)) + "s";
            setDuelLeftTime(leftTimeStr);
            setLeftTime(joinLeftTimeStr)

        }, 1000);
        return () => clearInterval(leftTimer);
    }, [leftTime, endDateTime])

    useEffect(() => {
        setEstimatePrice(0);
        allDuels.forEach((duel, index) => {
            if (duel.duelId == currentDuelId) {
                setEndDateTime(duel.endDateTime.valueOf());
                setCurrentPrediction(duel.creatorEstmatePrice.valueOf());
                // const endDuelEndTimeTemp = new Date(new Date(duel.endDateTime.valueOf()).getTime() + 18 * 60 * 60 * 1000 - new Date().getTime())
            }
        });
    }, [updatePredictionModalOpen]);
    return (
        <Dialog open={updatePredictionModalOpen.valueOf()} onClose={handleClose}>
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
                    Update Prediction
                </Typography>
                <FaTimes 
                    style={{
                        cursor: "pointer",
                        fontSize: "1.8em"
                    }}
                    onClick={handleClose}
                />
            </DialogTitle>
            <DialogContent dividers>
                <Typography>Your current prediction is:</Typography>
                <Typography>1 $CRYPTO will be {currentPrediction} BUSD in {duelLeftTime}</Typography>
                <Typography>You have {leftTime} left to update your prediction</Typography>
                <Box
                    sx={{
                        padding: "20px",
                        fontSize: "1.2em",
                        fontWeight: "bold",

                    }}
                >
                    <a href="https://coinmarketcap.com/dexscan/bsc/0x13fade99f5d7038cd53261770d80902c8756adae" target="_blank" style={{ color: "#0df8f9", textDecoration: "none" }}>Check $CRYPTO Price Now</a>
                </Box>
                <Grid container mb={1} spacing={1}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>I think 1 $BLST will be = </Grid>
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
                    <Grid item xs={6} sm={2} md={2} lg={1}>BUSD</Grid>
                </Grid>
                <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <FireBtn
                        sx={{ width: "100px" }}
                        onClick={handleSubmit}
                        loading={updatePredictionLoading}
                    >Update</FireBtn>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
export default UpdatePredictionModal;
