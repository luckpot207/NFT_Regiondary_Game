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
} from "../../web3hooks/useContract";

import FireBtn from "../Buttons/FireBtn";
import { updatePrediction } from "../../web3hooks/contractFunctions";
import { toast } from "react-toastify";

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
        allLegions,
        updatePredictionModalOpen,
        currentDuelId,
    } = AppSelector(gameState);
    // Account & Web3
    const { account } = useWeb3React();

    // Contract
    const duelContract = useDuelSystem();

    const [estimatePrice, setEstimatePrice] = useState(0);

    const handleChangeEstimatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        setEstimatePrice(price)
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
            const res = await updatePrediction(duelContract, account, currentDuelId, estimatePrice);
            console.log(res);
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <Dialog open={updatePredictionModalOpen.valueOf()} onClose={handleClose}>
            <DialogTitle>Update Prediction</DialogTitle>
            <DialogContent dividers>
                <Typography>What do you think the $BLST price in BUSD will be in exactly 24 hours from now?</Typography>
                <Box
                    sx={{
                        padding: "20px",
                        fontSize: "1.2em",
                        fontWeight: "bold",

                    }}
                >
                    <a href="https://pancakeswap.finance/swap?outputCurrency=0x63441E5C9F55B5A9141f3D834a28426Ca1c5C5cC&inputCurrency=BNB" target="_blank" style={{ color: "orange", textDecoration: "none" }}>Check Price Now</a>
                </Box>
                <Grid container mb={1} spacing={1}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>I think 1 $BLST will be = </Grid>
                    <Grid item xs={6} sm={4} md={4} lg={2}>
                        <PriceTextField
                            id="outlined-number"
                            variant="standard"
                            // InputLabelProps={{
                            //     shrink: true,
                            // }}
                            type="number"
                            value={estimatePrice}
                            onChange={handleChangeEstimatePrice}
                            sx={{ padding: "0 !important" }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={2} md={4} lg={1}>BUSD</Grid>
                </Grid>
                <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <FireBtn
                        sx={{ width: "100px" }}
                        onClick={handleSubmit}
                    >Bet</FireBtn>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
export default UpdatePredictionModal;
