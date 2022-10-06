import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelProcessSort: React.FC = () => {
    const dispatch = useDispatch();
    const { duelStatus } = AppSelector(gameState);
    const handleSort = (val: Number) => {
        dispatch(updateState({ duelStatus: val }));
    };

    useEffect(() => {
        dispatch(updateState({ duelStatus: 0 }));
    }, []);

    return (
        <Box>
            <Typography sx={{ mb: 1 }}>
                Sort By Duel Status:
            </Typography>
            <ButtonGroup>
                {duelStatus == 0 || duelStatus == 2 ? <Button
                    onClick={() => handleSort(1)}
                >
                    Ongoing Dules
                </Button> : <></>}

                {
                    duelStatus == 0 || duelStatus == 1 ? <Button
                        onClick={() => handleSort(2)}
                    >
                        Duel Results
                    </Button> : <></>
                }

            </ButtonGroup>
        </Box>
    );
};

export default DuelProcessSort;
