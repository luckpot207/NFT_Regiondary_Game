import { Box, Dialog, DialogContent, Typography, DialogTitle } from "@mui/material";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { gameState, updateState, addReincarnationValue } from "../../reducers/cryptolegions.reducer";
import { AppDispatch, AppSelector } from "../../store";
import FireBtn from "../Buttons/FireBtn";
import { toast } from "react-toastify";

const ReincarnationModal: React.FC = () => {
    // Hook Info
    const dispatch: AppDispatch = useDispatch();
    const [remainHour, setRemainHour] = React.useState(0);
    const [remainMinute, setRemainMinute] = React.useState(0);
    const [remainSecond, setRemainSecond] = React.useState(0);
    const { account } = useWeb3React();
    const {
        language,
        unclaimedBLST,
        unclaimedUSD,
        allLegions,
        endDate,
        allowReincarnation,
    } =
        AppSelector(gameState);


    const totalAP = allLegions.map(legion => legion.attackPower).reduce((prev, curr) => prev.valueOf() + curr.valueOf(), 0);
    const end_date = new Date(endDate);
    const endYear = end_date.getUTCFullYear();
    const endMonth = end_date.getUTCMonth() + 1 * 1 < 10 ? '0' + (end_date.getUTCMonth() + 1) : end_date.getUTCMonth() + 1;
    const endDay = end_date.getUTCDate() * 1 < 10 ? '0' + end_date.getUTCDate() : end_date.getUTCDate();
    const endHour = end_date.getUTCHours() * 1 < 10 ? '0' + end_date.getUTCHours() : end_date.getUTCHours();
    const endMinute = end_date.getUTCMinutes() * 1 < 10 ? '0' + end_date.getUTCMinutes() : end_date.getUTCMinutes();

    const getLeftTime = () => {
        const curDate = new Date();
        const leftTime = new Date(endDate).getTime() - new Date().getTime();
        // setRemainHour(enddate.getTime());
        setRemainHour(Math.floor(leftTime / 3600000));
        // setRemainMinute(curDate.getTime());
        setRemainMinute(Math.floor((leftTime % 3600000) / 60000));
        setRemainSecond(Math.floor((leftTime % 60000) / 1000));
    }

    React.useEffect(() => {
        realTimeUpdate();
    }, []);

    const realTimeUpdate = () => {
        setTimeout(() => {
            getLeftTime();
            realTimeUpdate();
        }, 1000);
    };

    const handleSubmit = async () => {
        const reincarnationValue = Math.round((totalAP.valueOf() / 39) + unclaimedUSD.valueOf()) as number;
        dispatch (
            addReincarnationValue({
                address: account as string,
                value: reincarnationValue,
            })
        );
        handleClose();
    };

    const handleClose = () => {
        dispatch(
            updateState({
                allowReincarnation: false
            })
        );
    };
    //
    return (
        <Dialog
            open={allowReincarnation.valueOf()}
            onClose={handleClose}
        >
            <DialogContent>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            borderBottom: "1px solid #fff",
                            marginBottom: 3,
                        }}
                    >
                        Rincarnation
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 1,
                        }}
                    >
                        Migrate a part of your inventory to the next version of the game.
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 1,
                        }}
                    >
                        Your current total AP : {totalAP}&nbsp;(=&nbsp;${Math.round(totalAP.valueOf() / 39)})
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 2,
                        }}
                    >
                        Unclaimed rewards : {unclaimedBLST}&nbsp;$BLST&nbsp;(=&nbsp;${unclaimedUSD})
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 2,
                        }}
                    >
                        Your Reincarnation Value : ${Math.round((totalAP.valueOf() / 39) + unclaimedUSD.valueOf())}
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 2,
                        }}
                    >
                        You will receive a summoning voucher for warriors/beasts in the next game, based on your Reincarnation Value, depending on the amount in the Reserve Pool and the total Reincarnation Value of all players.
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 0,
                        }}
                    >
                        Reincarnation will close on {endYear}-{endMonth}-{endDay}  date at {endHour}:{endMinute}&nbsp;UTC.
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "left",
                            marginBottom: 2,
                        }}
                    >
                        Time left:   {remainHour}&nbsp;hours&nbsp;{remainMinute}&nbsp;min&nbsp;{remainSecond}&nbsp;sec
                    </Typography>
                </Box>
                <Box
                    sx={{ textAlign: "center" }}
                >
                    <FireBtn
                        sx={{
                            mb: 1,
                            width: "200px",
                            wordBreak: "break-word",
                            fontSize: 14,
                            textAlign: "center"
                        }}
                        onClick={handleSubmit}
                        aria-describedby="summon-beast-btn"
                    >
                        Reincarnation Now
                    </FireBtn>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReincarnationModal;
