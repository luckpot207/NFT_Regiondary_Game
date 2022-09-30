import {
  Box,
  Button,
  ButtonGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import LanguageTranslate from "../UI/LanguageTranslate";

type Props = {
  showSmall: boolean;
};

const BeastCapacityFilter: React.FC<Props> = ({ showSmall }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { beastFilterCapacity } = AppSelector(gameState);

  const handleCapacityFilter = (capacity: Number) => {
    dispatch(updateState({ beastFilterCapacity: capacity, currentPage: 1 }));
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(
      updateState({ beastFilterCapacity: event.target.value, currentPage: 1 })
    );
  };

  useEffect(() => {
    dispatch(updateState({ beastFilterCapacity: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        <LanguageTranslate translateKey="filterbycapacity" />:
      </Typography>
      {isSmallerThanSM && showSmall ? (
        <>
          <Select
            value={beastFilterCapacity.toString()}
            onChange={handleChange}
            size={"small"}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </>
      ) : (
        <ButtonGroup>
          <Button
            variant={beastFilterCapacity === 0 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(0)}
          >
            <LanguageTranslate translateKey="all" />
          </Button>
          <Button
            variant={beastFilterCapacity === 1 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(1)}
          >
            1
          </Button>
          <Button
            variant={beastFilterCapacity === 2 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(2)}
          >
            2
          </Button>
          <Button
            variant={beastFilterCapacity === 3 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(3)}
          >
            3
          </Button>
          <Button
            variant={beastFilterCapacity === 4 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(4)}
          >
            4
          </Button>
          <Button
            variant={beastFilterCapacity === 5 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(5)}
          >
            5
          </Button>
          <Button
            variant={beastFilterCapacity === 20 ? "contained" : "outlined"}
            onClick={() => handleCapacityFilter(20)}
          >
            20
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default BeastCapacityFilter;
