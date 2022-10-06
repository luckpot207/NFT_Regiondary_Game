import { Box, Slider, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelLegionAPFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    duelLegionFilterMinConstAP,
    duelLegionFilterMaxConstAP,
    duelLegionFilterMinAP,
    duelLegionFilterMaxAP,
  } = AppSelector(gameState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateState({
        duelLegionFilterMinAP: Number(newValue[0]),
        duelLegionFilterMaxAP: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

  // useEffect(() => {
  //   dispatch(
  //     updateState({
  //       duelLegionFilterMinAP: duelLegionFilterMinConstAP,
  //       duelLegionFilterMaxAP: duelLegionFilterMaxConstAP.valueOf()-1,
  //       currentPage: 1,
  //     })
  //   );
  // }, []);

return (
  <Box>
    <Typography>
      <LanguageTranslate translateKey="filterbyap" />:
    </Typography>
    <Slider
      getAriaLabel={() => "Attack Power Range"}
      value={[Number(duelLegionFilterMinAP), Number(duelLegionFilterMaxAP)]}
      onChange={handleChange}
      valueLabelDisplay="auto"
      min={duelLegionFilterMinConstAP.valueOf()}
      max={duelLegionFilterMaxConstAP.valueOf()}
      marks={[
        {
          value: duelLegionFilterMinConstAP.valueOf(),
          label: "10K",
        },
        {
          value: duelLegionFilterMaxConstAP.valueOf(),
          label: "70K",
        },
      ]}
    />
  </Box>
);
};

export default DuelLegionAPFilter;
