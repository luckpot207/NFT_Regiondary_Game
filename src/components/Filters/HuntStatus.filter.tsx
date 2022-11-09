import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const HuntStatusFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { legionFilterHuntStatus } = AppSelector(filterAndPageState);

  const handleFilter = (val: Number) => {
    dispatch(
      updateFilterAndPageState({ legionFilterHuntStatus: val, currentPage: 1 })
    );
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ legionFilterHuntStatus: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("huntstatus")}</Typography>
      <ButtonGroup>
        <Button
          variant={legionFilterHuntStatus === 0 ? "contained" : "outlined"}
          onClick={() => handleFilter(0)}
        >
          {getTranslation("all")}
        </Button>
        <Button
          variant={legionFilterHuntStatus === 1 ? "contained" : "outlined"}
          onClick={() => handleFilter(1)}
        >
          Green
        </Button>
        <Button
          variant={legionFilterHuntStatus === 2 ? "contained" : "outlined"}
          onClick={() => handleFilter(2)}
        >
          Orange
        </Button>
        <Button
          variant={legionFilterHuntStatus === 3 ? "contained" : "outlined"}
          onClick={() => handleFilter(3)}
        >
          Red
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default HuntStatusFilter;
