import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { Box, Checkbox, Typography } from "@mui/material";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelShowOnlyMineFilter: React.FC = () => {
//   const dispatch = useDispatch();
//   const { showOnlyMine } = AppSelector(gameState);
  const [duelShowOnlyMine, setDuelShowOnlyMine] = useState(false);
  const handleFilter = () => {
    // dispatch(updateState({ showOnlyMine: !showOnlyMine }));
  };

//   useEffect(() => {
//     dispatch(updateState({ showOnlyMine: false }));
//   }, []);

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
