import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";

const DuelProcessSort: React.FC = () => {
  const dispatch = useDispatch();
  const { duelStatus } = AppSelector(filterAndPageState);
  const handleSort = (val: Number) => {
    dispatch(updateFilterAndPageState({ duelStatus: val }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ duelStatus: 1 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        {getTranslation("sortbyduelstatus")}:
      </Typography>
      <ButtonGroup>
        {duelStatus == 1 || duelStatus == 3 ? (
          <Button onClick={() => handleSort(2)}>
            {getTranslation("ongoingduels")}
          </Button>
        ) : (
          <></>
        )}

        {duelStatus == 1 || duelStatus == 2 ? (
          <Button onClick={() => handleSort(3)}>
            {getTranslation("duelresult")}
          </Button>
        ) : (
          <></>
        )}
      </ButtonGroup>
    </Box>
  );
};

export default DuelProcessSort;
