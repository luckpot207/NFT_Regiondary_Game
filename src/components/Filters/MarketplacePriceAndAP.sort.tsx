import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const MarketplacePriceAndAPSort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortAPandPrice } = AppSelector(gameState);

  const handleSort = (val: Number) => {
    dispatch(updateState({ sortAPandPrice: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateState({ sortAPandPrice: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="sortby" />:
      </Typography>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          variant={sortAPandPrice === 2 ? "contained" : "outlined"}
          onClick={() => handleSort(2)}
          sx={{ textAlign: "center" }}
        >
          <LanguageTranslate translateKey="lowest" />{" "}
          <LanguageTranslate translateKey="ap" />
        </Button>
        <Button
          variant={sortAPandPrice === 3 ? "contained" : "outlined"}
          onClick={() => handleSort(3)}
        >
          <LanguageTranslate translateKey="highest" />{" "}
          <LanguageTranslate translateKey="ap" />
        </Button>
        <Button
          variant={sortAPandPrice === 0 ? "contained" : "outlined"}
          onClick={() => handleSort(0)}
        >
          <LanguageTranslate translateKey="lowest" />{" "}
          <LanguageTranslate translateKey="$" />
        </Button>
        <Button
          variant={sortAPandPrice === 1 ? "contained" : "outlined"}
          onClick={() => handleSort(1)}
        >
          <LanguageTranslate translateKey="highest" />{" "}
          <LanguageTranslate translateKey="$" />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MarketplacePriceAndAPSort;
