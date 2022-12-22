import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  Slider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaTimes } from "react-icons/fa";
import { AppSelector, AppDispatch } from "../../store";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { getTranslation } from "../../utils/utils";
import constants from "../../constants";
import { MdClose } from "react-icons/md";

const PrettoSlider = styled(Slider)({
  background: "linear-gradient(to right, red, yellow , green)",
  padding: "0px !important",
  height: 16,
  "& .MuiSlider-rail": {
    background: "linear-gradient(to right, red, yellow , green)",
  },
  "& .MuiSlider-track": {
    border: "none",
    background: "transparent !important",
  },
  "& .MuiSlider-thumb": {
    height: 18,
    width: 10,
    top: 24,
    backgroundColor: "#f66810",
    border: "0px solid",
    borderRadius: "0",
    "&:before": {
      top: -16,
      height: 0,
      width: 0,
      border: "8px solid",
      borderColor: "transparent transparent #f66810 transparent",
      boxShadow: "none",
    },
  },
  "& .MuiSlider-thumb.Mui-active": {
    boxShadow: "none",
  },
  "& .MuiSlider-thumb: hover": {
    boxShadow: "none",
  },
  "& 	.MuiSlider-markLabel": {
    top: 30,
    color: "white",
  },
});
const CalculatorModal: React.FC = () => {
  const reinvestPercentMark = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];
  const [reinvestPercent, setReinvestPercent] = useState<number>(70);
  const handleClose = () => {};
  const handleChange = (event: Event, newValue: number | number[]) => {
    setReinvestPercent(newValue as number);
  };
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex" }}>
        <MdClose
          style={{
            marginLeft: "auto",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
          }}
          onClick={handleClose}
        />
      </Box>
      <Box sx={{ p: 4, pt: 0 }}>
        <Typography>
          <span style={{ fontSize: 16, fontWeight: "bold" }}>
            {getTranslation("whatIsYourDesiredReinvestPercentage")}
          </span>
        </Typography>
      </Box>
      <Box sx={{ p: 4, pt: 0 }}>
        <PrettoSlider
          track="inverted"
          sx={{
            marginBottom: 4,
          }}
          aria-labelledby="track-inverted-slider"
          value={reinvestPercent}
          valueLabelFormat={(x) => `${x}%`}
          onChange={handleChange}
          marks={reinvestPercentMark}
        />
      </Box>
    </Dialog>
  );
};

export default CalculatorModal;
