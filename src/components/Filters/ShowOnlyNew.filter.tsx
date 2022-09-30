import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { Box, Checkbox, Typography } from "@mui/material";
import LanguageTranslate from "../UI/LanguageTranslate";

const ShowOnlyNewFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { showOnlyNew } = AppSelector(gameState);
  const handleFilter = () => {
    dispatch(updateState({ showOnlyNew: !showOnlyNew }));
  };

  useEffect(() => {
    dispatch(updateState({ showOnlyNew: false }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="showonlynew" />:
      </Typography>
      <Checkbox checked={showOnlyNew.valueOf()} onChange={handleFilter} />
    </Box>
  );
};

export default ShowOnlyNewFilter;
