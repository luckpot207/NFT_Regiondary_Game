import React from "react";
import { useDispatch } from "react-redux";
import { Box, Slider, Typography } from "@mui/material";
import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const LegionAPFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    legionFilterMinConstAP,
    legionFilterMaxConstAP,
    legionFilterMinAP,
    legionFilterMaxAP,
  } = AppSelector(filterAndPageState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateFilterAndPageState({
        legionFilterMinAP: Number(newValue[0]),
        legionFilterMaxAP: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

  return (
    <Box>
      <Typography>{getTranslation("filterbyap")}</Typography>
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
