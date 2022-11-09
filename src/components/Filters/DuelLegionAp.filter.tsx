import { Box, Slider, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import {
    filterAndPageState,
    updateFilterAndPageState,
  } from "../../reducers/filterAndPage.reducer";

import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const DuelLegionAPFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    duelLegionFilterMinConstAP,
    duelLegionFilterMaxConstAP,
    duelLegionFilterMinAP,
    duelLegionFilterMaxAP,
  } = AppSelector(filterAndPageState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateFilterAndPageState({
        duelLegionFilterMinAP: Number(newValue[0]),
        duelLegionFilterMaxAP: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

 
return (
  <Box>
    <Typography>
      {getTranslation("filterbyap")}
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
