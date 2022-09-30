import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { Box, Checkbox, Typography } from "@mui/material";
import LanguageTranslate from "../UI/LanguageTranslate";

const HideWeakLegionsFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { hideWeakLegion } = AppSelector(gameState);
  const handleFilter = () => {
    dispatch(updateState({ hideWeakLegion: !hideWeakLegion }));
  };

  useEffect(() => {
    dispatch(updateState({ hideWeakLegion: false }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="hideweaklegions" />:
      </Typography>
      <Checkbox checked={hideWeakLegion.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default HideWeakLegionsFilter;
