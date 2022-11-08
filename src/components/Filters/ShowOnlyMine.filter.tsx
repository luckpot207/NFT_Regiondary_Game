import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import { Box, Checkbox, Typography } from "@mui/material";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const ShowOnlyMineFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { showOnlyMine } = AppSelector(filterAndPageState);
  const handleFilter = () => {
    dispatch(updateFilterAndPageState({ showOnlyMine: !showOnlyMine }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ showOnlyMine: false }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("showonlymine")}</Typography>
      <Checkbox checked={showOnlyMine.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default ShowOnlyMineFilter;
