import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const LegionAPSort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortAP } = AppSelector(gameState);

  const handleSort = (val: Number) => {
    dispatch(updateState({ sortAP: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateState({ sortAP: 1 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="sortbyap" />:
      </Typography>
      <ButtonGroup>
        <Button
          variant={sortAP === 0 ? "contained" : "outlined"}
          onClick={() => handleSort(0)}
        >
          <LanguageTranslate translateKey="lowest" />
        </Button>
        <Button
          variant={sortAP === 1 ? "contained" : "outlined"}
          onClick={() => handleSort(1)}
        >
          <LanguageTranslate translateKey="highest" />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default LegionAPSort;
