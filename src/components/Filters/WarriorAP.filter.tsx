import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

const WarriorAPFilter: React.FC = () => {
  const dispatch = useDispatch();
  const {
    warriorFilterMinConstAP,
    warriorFilterMaxConstAP,
    warriorFilterMinAP,
    warriorFilterMaxAP,
  } = AppSelector(filterAndPageState);

  const handleChange = (event: Event, newValue: number | number[] | any) => {
    dispatch(
      updateFilterAndPageState({
        warriorFilterMinAP: Number(newValue[0]),
        warriorFilterMaxAP: Number(newValue[1]),
        currentPage: 1,
      })
    );
  };

  return (
    <Box>
      <Typography>{getTranslation("filterbyap")}</Typography>
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
