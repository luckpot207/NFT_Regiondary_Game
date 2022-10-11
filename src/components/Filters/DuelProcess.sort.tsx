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
        dispatch(updateState({ duelStatus: 1 }));
    }, []);

    return (
        <Box>
            <Typography sx={{ mb: 1 }}>
                Sort By Duel Status:
            </Typography>
            <ButtonGroup>
                {duelStatus == 1 || duelStatus == 3 ? <Button
                    onClick={() => handleSort(2)}
                >
                    Ongoing Dules
                </Button> : <></>}

                {
                    duelStatus == 1 || duelStatus == 2 ? <Button
                        onClick={() => handleSort(3)}
                    >
                        Duel Results
                    </Button> : <></>
                }

            </ButtonGroup>
        </Box>
    );
};

export default DuelProcessSort;
