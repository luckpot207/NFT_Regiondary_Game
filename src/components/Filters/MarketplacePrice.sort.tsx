import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const MarketplacePriceSort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortPrice } = AppSelector(filterAndPageState);

  const handleSort = (val: Number) => {
    dispatch(updateFilterAndPageState({ sortPrice: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ sortPrice: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("sortby$")}</Typography>
      <ButtonGroup>
        <Button
          variant={sortPrice === 0 ? "contained" : "outlined"}
          onClick={() => handleSort(0)}
        >
          {getTranslation("lowest")}
        </Button>
        <Button
          variant={sortPrice === 1 ? "contained" : "outlined"}
          onClick={() => handleSort(1)}
        >
          {getTranslation("highest")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MarketplacePriceSort;
