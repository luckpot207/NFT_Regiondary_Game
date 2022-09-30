import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const MarketplacePriceSort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortPrice } = AppSelector(gameState);

  const handleSort = (val: Number) => {
    dispatch(updateState({ sortPrice: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateState({ sortPrice: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="sortby$" />:
      </Typography>
      <ButtonGroup>
        <Button
          variant={sortPrice === 0 ? "contained" : "outlined"}
          onClick={() => handleSort(0)}
        >
          <LanguageTranslate translateKey="lowest" />
        </Button>
        <Button
          variant={sortPrice === 1 ? "contained" : "outlined"}
          onClick={() => handleSort(1)}
        >
          <LanguageTranslate translateKey="highest" />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MarketplacePriceSort;
