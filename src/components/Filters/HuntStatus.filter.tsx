import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

const HuntStatusFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { legionFilterHuntStatus } = AppSelector(gameState);

  const handleFilter = (val: Number) => {
    dispatch(updateState({ legionFilterHuntStatus: val, currentPage: 1 }));
  };

  useEffect(() => {
    dispatch(updateState({ legionFilterHuntStatus: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="huntstatus" />:
      </Typography>
      <ButtonGroup>
        <Button
          variant={legionFilterHuntStatus === 0 ? "contained" : "outlined"}
          onClick={() => handleFilter(0)}
        >
          <LanguageTranslate translateKey="all" />
        </Button>
        <Button
          variant={legionFilterHuntStatus === 1 ? "contained" : "outlined"}
          onClick={() => handleFilter(1)}
        >
          Green
        </Button>
        <Button
          variant={legionFilterHuntStatus === 2 ? "contained" : "outlined"}
          onClick={() => handleFilter(2)}
        >
          Orange
        </Button>
        <Button
          variant={legionFilterHuntStatus === 3 ? "contained" : "outlined"}
          onClick={() => handleFilter(3)}
        >
          Red
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default HuntStatusFilter;
