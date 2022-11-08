import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const LegionSuppliesFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    legionFilterMinConstSupplies,
    legionFilterMaxConstSupplies,
    legionFilterMinSupplies,
    legionFilterMaxSupplies,
  } = AppSelector(filterAndPageState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateFilterAndPageState({
        legionFilterMinSupplies: Number(newValue[0]),
        legionFilterMaxSupplies: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

  return (
    <Box>
      <Typography>{getTranslation("filterbyhuntsleft")}</Typography>
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
