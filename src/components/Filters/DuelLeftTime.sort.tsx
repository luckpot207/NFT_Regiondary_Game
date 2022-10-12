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
    duelResultFilterEnd,
    duelJoinLeftMaxConstTime,
    duelJoinLeftMinConstTime,
    duelLeftMaxConstTime,
    duelLeftMinConstTime,
    duelResultFilterStartConst,
    duelResultFilterEndConst
  } = AppSelector(gameState);
  const handleChange = (event: Event, newValue: number | number[] | any) => {
    if (duelStatus == 3) {
      dispatch(
        updateState({
          duelResultFilterStart: Number(newValue[0]),
          duelResultFilterEnd: Number(newValue[1]),
          currentPage: 1,
        })
      );
    } else if (duelStatus == 2) {
      dispatch(
        updateState({
          duelLeftMaxTime: Number(newValue[1]),
          duelLeftMinTime: Number(newValue[0]),
          currentPage: 1,
        })
      );
    } else {
      dispatch(
        updateState({
          duelJoinLeftMaxTime: Number(newValue[1]),
          duelJoinLeftMinTime: Number(newValue[0]),
          currentPage: 1,
        })
      );
    }
  };

  return (
    <Box>
      <Typography>
        {
          duelStatus == 3 ? "Filter By Days Ago" : "Filter By Time Left "
        }
      </Typography>
      {
        duelStatus == 1
          ? <Slider
            getAriaLabel={() => "Attack Power Range"}
            value={[Number(duelJoinLeftMinTime), Number(duelJoinLeftMaxTime)]}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={duelJoinLeftMinConstTime.valueOf()}
            max={duelJoinLeftMaxConstTime.valueOf()}
            marks={[
              {
                value: duelJoinLeftMinConstTime.valueOf(),
                label: "1 min",
              },
              {
                value: duelJoinLeftMaxConstTime.valueOf(),
                label: "6 hours",
              },
            ]}
          />
          : duelStatus == 2 ?
              <Slider
                getAriaLabel={() => "Attack Power Range"}
                value={[Number(duelLeftMinTime), Number(duelLeftMaxTime)]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={duelLeftMinConstTime.valueOf()}
                max={duelLeftMaxConstTime.valueOf()}
                marks={[
                  {
                    value: duelLeftMinConstTime.valueOf(),
                    label: "1 min",
                  },
                  {
                    value: duelLeftMaxConstTime.valueOf(),
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
                min={duelResultFilterStartConst.valueOf()}
                max={duelResultFilterEndConst.valueOf()}
                marks={[
                  {
                    value: duelResultFilterStartConst.valueOf(),
                    label: "1 day",
                  },
                  {
                    value: duelResultFilterEnd.valueOf(),
                    label: "30 days",
                  },
                ]}
              />
      }
    </Box>
  );
};

export default DuelLeftTimeSort;
