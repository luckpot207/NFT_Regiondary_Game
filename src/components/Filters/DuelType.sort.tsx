import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const DuelTypeSort: React.FC = () => {
      const dispatch = useDispatch();
      const { duelType } = AppSelector(filterAndPageState);
    const handleSort = (val: Number) => {
        dispatch(updateFilterAndPageState({ duelType: val, currentPage: 1 }));
    };

      useEffect(() => {
        dispatch(updateFilterAndPageState({ duelType: 0 }));
      }, []);

    return (
        <Box>
            <Typography sx={{ mb: 1 }}>
                {getTranslation("sortbydueltype")}:
            </Typography>
            <ButtonGroup>
                <Button
                    variant={duelType === 0 ? "contained" : "outlined"}
                    onClick={() => handleSort(0)}
                >
                    {getTranslation("all")}
                </Button>
                <Button
                    variant={duelType === 1 ? "contained" : "outlined"}
                    onClick={() => handleSort(1)}
                >
                    {getTranslation("standard")}
                </Button>
                <Button
                    variant={duelType === 2 ? "contained" : "outlined"}
                    onClick={() => handleSort(2)}
                >
                    {getTranslation("allin")}
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default DuelTypeSort;
