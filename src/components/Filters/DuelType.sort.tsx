import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelTypeSort: React.FC = () => {
    //   const dispatch = useDispatch();
    //   const { sortPrice } = AppSelector(gameState);
    const [duelTypeState, setDuelTypeState] = useState(0);
    const handleSort = (val: Number) => {
        setDuelTypeState(val.valueOf());
        // dispatch(updateState({ sortPrice: val, currentPage: 1 }));
    };

    //   useEffect(() => {
    //     dispatch(updateState({ sortPrice: 0 }));
    //   }, []);

    return (
        <Box>
            <Typography sx={{ mb: 1 }}>
                Sort By Duel Status:
            </Typography>
            <ButtonGroup>
                <Button
                    variant={duelTypeState === 0 ? "contained" : "outlined"}
                    onClick={() => handleSort(0)}
                >
                    Standard
                </Button>
                <Button
                    variant={duelTypeState === 1 ? "contained" : "outlined"}
                    onClick={() => handleSort(1)}
                >
                    All-In
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default DuelTypeSort;
