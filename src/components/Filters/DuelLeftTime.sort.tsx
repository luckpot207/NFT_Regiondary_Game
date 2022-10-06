import { Box, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const DuelLeftTimeSort: React.FC = () => {
  const dispatch = useDispatch();
  const {
    duelStatus,
    duelJoinLeftMaxTime,
    duelJoinLeftMinTime,
    duelLeftMaxTime,
    duelLeftMinTime,
    duelResultFilterStart,
    duelResultFilterEnd
  } = AppSelector(gameState);
  const handleChange = (event: Event, newValue: number | number[] | any) => {
    if (duelStatus == 2) {
      dispatch(
        updateState({
          duelResultFilterStart: Number(newValue[0]),
          duelResultFilterEnd: Number(newValue[1]),
          currentPage: 1,
        })
      );
    } else if (duelStatus == 1) {
      dispatch(
        updateState({
          duelLeftMaxTime: Number(newValue[0]),
          duelLeftMinTime: Number(newValue[1]),
          currentPage: 1,
        })
      );
    } else {
      dispatch(
        updateState({
          duelJoinLeftMaxTime: Number(newValue[0]),
          duelJoinLeftMinTime: Number(newValue[1]),
          currentPage: 1,
        })
      );
    }
  };

  return (
    <Box>
      <Typography>
        {
          duelStatus == 2 ? "Filter By Days Ago" : "Filter By Time Left "
        }
      </Typography>
      {
        duelStatus == 0
          ? <Slider
            getAriaLabel={() => "Attack Power Range"}
            value={[Number(duelJoinLeftMinTime), Number(duelJoinLeftMaxTime)]}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={1}
            max={360}
            marks={[
              {
                value: 1,
                label: "1 min",
              },
              {
                value: 360,
                label: "6 hours",
              },
            ]}
          />
          : duelStatus == 1 ?
              <Slider
                getAriaLabel={() => "Attack Power Range"}
                value={[Number(duelLeftMinTime), Number(duelLeftMaxTime)]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={1}
                max={360}
                marks={[
                  {
                    value: 1,
                    label: "1 min",
                  },
                  {
                    value: 1080,
                    label: "18 hours",
                  },
                ]}
              />
              :
              <Slider
                getAriaLabel={() => "Attack Power Range"}
                value={[Number(duelResultFilterStart), Number(duelResultFilterEnd)]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={1}
                max={30}
                marks={[
                  {
                    value: 1,
                    label: "1 day",
                  },
                  {
                    value: 30,
                    label: "30 days",
                  },
                ]}
              />
      }
    </Box>
  );
};

export default DuelLeftTimeSort;
