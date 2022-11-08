import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import { Box, Checkbox, Typography } from "@mui/material";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const ShowOnlyNewFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { showOnlyNew } = AppSelector(filterAndPageState);
  const handleFilter = () => {
    dispatch(updateFilterAndPageState({ showOnlyNew: !showOnlyNew }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ showOnlyNew: false }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("showonlynew")}</Typography>
      <Checkbox checked={showOnlyNew.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default ShowOnlyNewFilter;
