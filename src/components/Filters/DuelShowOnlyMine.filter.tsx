import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { Box, Checkbox, Typography } from "@mui/material";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelShowOnlyMineFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { duelShowOnlyMine } = AppSelector(gameState);
  // const [duelShowOnlyMine, setDuelShowOnlyMine] = useState(false);
  const handleFilter = () => {
    dispatch(updateState({ duelShowOnlyMine: !duelShowOnlyMine }));
  };

  useEffect(() => {
    dispatch(updateState({ duelShowOnlyMine: false }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="showonlymine" />:
      </Typography>
      <Checkbox checked={duelShowOnlyMine.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default DuelShowOnlyMineFilter;
