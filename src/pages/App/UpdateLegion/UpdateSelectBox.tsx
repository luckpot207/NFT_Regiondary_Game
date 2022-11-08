import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import BeastCard from "../../../components/Cards/Beast.card";
import WarriorCard from "../../../components/Cards/Warrior.card";
import BeastCapacityFilter from "../../../components/Filters/BeastCapacity.filter";
import WarriorAPFilter from "../../../components/Filters/WarriorAP.filter";
import WarriorLevelFilter from "../../../components/Filters/WarriorLevel.filter";
import gameConfig from "../../../config/game.config";
import { beastState } from "../../../reducers/beast.reducer";
import { filterAndPageState } from "../../../reducers/filterAndPage.reducer";
import {
  legionState,
  updateLegionBoxIn,
} from "../../../reducers/legion.reducer";
import { warriorState } from "../../../reducers/warrior.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import { IBeast, IWarrior } from "../../../types";

const UpdateSelectBox: React.FC = () => {
  const dispatch = useDispatch();
  const { allBeasts } = AppSelector(beastState);
  const { allWarriors } = AppSelector(warriorState);
  const { updateLegionLoading } = AppSelector(legionState);
  const {
    warriorFilterLevel,
    warriorFilterMaxAP,
    warriorFilterMinAP,
    beastFilterCapacity,
    warriorFilterMaxConstAP,
  } = AppSelector(filterAndPageState);

  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const capacityFilterVal =
    beastFilterCapacity === 0
      ? allBeasts
      : allBeasts.filter(
          (beast) => Number(beast.capacity) === Number(beastFilterCapacity)
        );

  const levelFilterVal =
    warriorFilterLevel === 0
      ? allWarriors
      : allWarriors.filter(
          (warrior) => warrior.strength === warriorFilterLevel
        );
  const APFilterVal = levelFilterVal.filter(
    (warrior) =>
      warrior.attackPower >= warriorFilterMinAP &&
      (warriorFilterMaxAP === warriorFilterMaxConstAP
        ? true
        : warrior.attackPower <= warriorFilterMaxAP)
  );

  // Function
  const handleBoxIn = (type: Number, item: IBeast | IWarrior) => {
    dispatch(
      updateLegionBoxIn({
        type,
        item,
      })
    );
  };

  // Use Effect

  const [showType, setShowType] = useState<Number>(0);
  return (
    <Card sx={{ p: 2 }}>
      <Box>
        <Box sx={{ mb: 2 }}>
          <ButtonGroup>
            <Button
              variant={showType === 1 ? "contained" : "outlined"}
              onClick={() => setShowType(1)}
            >
              {isSmallerThanSM ? "W" : getTranslation("warriors")}
            </Button>
            <Button
              variant={showType === 0 ? "contained" : "outlined"}
              onClick={() => setShowType(0)}
            >
              {isSmallerThanSM ? "B" : getTranslation("beasts")}
            </Button>
          </ButtonGroup>
        </Box>
        {showType === 0 ? (
          <Box>
            <Box sx={{ mb: 4 }}>
              <BeastCapacityFilter showSmall={true} />
            </Box>
            <Grid container spacing={2}>
              {capacityFilterVal.map((beast: IBeast, index: Number) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={3}
                  key={index.valueOf()}
                  onClick={() =>
                    !updateLegionLoading &&
                    handleBoxIn(gameConfig.nftItemType.beast, beast)
                  }
                >
                  <BeastCard beast={beast} isActionBtns={false} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 4, mr: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <WarriorLevelFilter showSmall={true} />
                </Grid>
                <Grid item xs={12} md={4}></Grid>
                <Grid item xs={12} md={4}>
                  <WarriorAPFilter />
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={2}>
              {APFilterVal.map((warrior: IWarrior, index: Number) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={3}
                  key={index.valueOf()}
                  onClick={() =>
                    !updateLegionLoading &&
                    handleBoxIn(gameConfig.nftItemType.warrior, warrior)
                  }
                >
                  <WarriorCard warrior={warrior} isActionBtns={false} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default UpdateSelectBox;
