import { Box, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const LegionSuppliesFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    legionFilterMinConstSupplies,
    legionFilterMaxConstSupplies,
    legionFilterMinSupplies,
    legionFilterMaxSupplies,
  } = AppSelector(gameState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateState({
        legionFilterMinSupplies: Number(newValue[0]),
        legionFilterMaxSupplies: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

  return (
    <Box>
      <Typography>
        <LanguageTranslate translateKey="filterbyhuntsleft" />:
      </Typography>
      <Slider
        getAriaLabel={() => "Attack Power Range"}
        value={[
          Number(legionFilterMinSupplies),
          Number(legionFilterMaxSupplies),
        ]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={legionFilterMinConstSupplies.valueOf()}
        max={legionFilterMaxConstSupplies.valueOf()}
        marks={[
          {
            value: legionFilterMinConstSupplies.valueOf(),
            label: `${legionFilterMinConstSupplies.valueOf()}`,
          },
          {
            value: legionFilterMaxConstSupplies.valueOf(),
            label: `${legionFilterMaxConstSupplies.valueOf()}+`,
          },
        ]}
      />
    </Box>
  );
};

export default LegionSuppliesFilter;
