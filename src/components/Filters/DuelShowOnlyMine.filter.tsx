import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Checkbox, Typography } from "@mui/material";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const DuelShowOnlyMineFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { duelShowOnlyMine } = AppSelector(filterAndPageState);
  const handleFilter = () => {
    dispatch(updateFilterAndPageState({ duelShowOnlyMine: !duelShowOnlyMine }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ duelShowOnlyMine: false }));
  }, []);

  return (
    <Box>
      <Typography>
        {getTranslation("showonlymine")}:
      </Typography>
      <Checkbox checked={duelShowOnlyMine.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default DuelShowOnlyMineFilter;
