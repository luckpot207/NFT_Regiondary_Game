import React, { useEffect } from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const MarketplacePriceAndAPSort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortAPandPrice } = AppSelector(filterAndPageState);

  const handleSort = (val: Number) => {
    dispatch(updateFilterAndPageState({ sortAPandPrice: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ sortAPandPrice: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("sortby")}</Typography>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          variant={sortAPandPrice === 2 ? "contained" : "outlined"}
          onClick={() => handleSort(2)}
          sx={{ textAlign: "center" }}
        >
          {getTranslation("lowest")} {getTranslation("ap")}
        </Button>
        <Button
          variant={sortAPandPrice === 3 ? "contained" : "outlined"}
          onClick={() => handleSort(3)}
        >
          {getTranslation("highest")} {getTranslation("ap")}
        </Button>
        <Button
          variant={sortAPandPrice === 0 ? "contained" : "outlined"}
          onClick={() => handleSort(0)}
        >
          {getTranslation("lowest")} {getTranslation("$")}
        </Button>
        <Button
          variant={sortAPandPrice === 1 ? "contained" : "outlined"}
          onClick={() => handleSort(1)}
        >
          {getTranslation("highest")} {getTranslation("$")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MarketplacePriceAndAPSort;
