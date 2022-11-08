import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";

import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const LegionAPSort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortAP } = AppSelector(filterAndPageState);

  const handleSort = (val: Number) => {
    dispatch(updateFilterAndPageState({ sortAP: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ sortAP: 1 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("sortbyap")}</Typography>
      <ButtonGroup>
        <Button
          variant={sortAP === 0 ? "contained" : "outlined"}
          onClick={() => handleSort(0)}
        >
          {getTranslation("lowest")}
        </Button>
        <Button
          variant={sortAP === 1 ? "contained" : "outlined"}
          onClick={() => handleSort(1)}
        >
          {getTranslation("highest")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default LegionAPSort;
