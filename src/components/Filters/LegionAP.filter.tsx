import { Box, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const LegionAPFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    legionFilterMinConstAP,
    legionFilterMaxConstAP,
    legionFilterMinAP,
    legionFilterMaxAP,
  } = AppSelector(gameState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateState({
        legionFilterMinAP: Number(newValue[0]),
        legionFilterMaxAP: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

  return (
    <Box>
      <Typography>
        <LanguageTranslate translateKey="filterbyap" />:
      </Typography>
      <Slider
        getAriaLabel={() => "Attack Power Range"}
        value={[Number(legionFilterMinAP), Number(legionFilterMaxAP)]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={legionFilterMinConstAP.valueOf()}
        max={legionFilterMaxConstAP.valueOf()}
        marks={[
          {
            value: legionFilterMinConstAP.valueOf(),
            label: `${legionFilterMinConstAP.valueOf()}`,
          },
          {
            value: legionFilterMaxConstAP.valueOf(),
            label: `${legionFilterMaxConstAP.valueOf() / 1000}K+`,
          },
        ]}
      />
    </Box>
  );
};

export default LegionAPFilter;
