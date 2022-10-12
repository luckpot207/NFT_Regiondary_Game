import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelTypeSort: React.FC = () => {
      const dispatch = useDispatch();
      const { duelType } = AppSelector(gameState);
    const handleSort = (val: Boolean) => {
        dispatch(updateState({ duelType: val, currentPage: 1 }));
    };

      useEffect(() => {
        dispatch(updateState({ duelType: true }));
      }, []);

    return (
        <Box>
            <Typography sx={{ mb: 1 }}>
                Sort By Duel Status:
            </Typography>
            <ButtonGroup>
                <Button
                    variant={duelType === true ? "contained" : "outlined"}
                    onClick={() => handleSort(true)}
                >
                    Standard
                </Button>
                <Button
                    variant={duelType === false ? "contained" : "outlined"}
                    onClick={() => handleSort(false)}
                >
                    All-In
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default DuelTypeSort;
