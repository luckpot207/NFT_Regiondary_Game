import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Checkbox, Typography } from "@mui/material";
import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const HideWeakLegionsFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { hideWeakLegion } = AppSelector(filterAndPageState);
  const handleFilter = () => {
    dispatch(updateFilterAndPageState({ hideWeakLegion: !hideWeakLegion }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ hideWeakLegion: false }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        {getTranslation("hideweaklegions")}
      </Typography>
      <Checkbox checked={hideWeakLegion.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default HideWeakLegionsFilter;
