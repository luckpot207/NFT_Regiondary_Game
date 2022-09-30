import { Box, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const WarriorAPFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    warriorFilterMinConstAP,
    warriorFilterMaxConstAP,
    warriorFilterMinAP,
    warriorFilterMaxAP,
  } = AppSelector(gameState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateState({
        warriorFilterMinAP: Number(newValue[0]),
        warriorFilterMaxAP: Number(newValue[1]),
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
        value={[Number(warriorFilterMinAP), Number(warriorFilterMaxAP)]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={warriorFilterMinConstAP.valueOf()}
        max={warriorFilterMaxConstAP.valueOf()}
        marks={[
          { value: 500, label: "500" },
          { value: 6000, label: "6000+" },
        ]}
      />
    </Box>
  );
};

export default WarriorAPFilter;
