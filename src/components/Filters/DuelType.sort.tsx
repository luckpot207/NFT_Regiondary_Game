import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelTypeSort: React.FC = () => {
      const dispatch = useDispatch();
      const { duelType } = AppSelector(gameState);
    const handleSort = (val: Number) => {
        dispatch(updateState({ duelType: val, currentPage: 1 }));
    };

      useEffect(() => {
        dispatch(updateState({ duelType: 0 }));
      }, []);

    return (
        <Box>
            <Typography sx={{ mb: 1 }}>
                Sort By Duel Type:
            </Typography>
            <ButtonGroup>
                <Button
                    variant={duelType === 0 ? "contained" : "outlined"}
                    onClick={() => handleSort(0)}
                >
                    All
                </Button>
                <Button
                    variant={duelType === 1 ? "contained" : "outlined"}
                    onClick={() => handleSort(1)}
                >
                    Standard
                </Button>
                <Button
                    variant={duelType === 2 ? "contained" : "outlined"}
                    onClick={() => handleSort(2)}
                >
                    All-In
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default DuelTypeSort;
