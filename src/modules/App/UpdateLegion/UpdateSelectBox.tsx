import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import BeastCard from "../../../components/Cards/Beast.card";
import WarriorCard from "../../../components/Cards/Warrior.card";
import BeastCapacityFilter from "../../../components/Filters/BeastCapacity.filter";
import WarriorAPFilter from "../../../components/Filters/WarriorAP.filter";
import WarriorLevelFilter from "../../../components/Filters/WarriorLevel.filter";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { I_Beast, I_Warrior } from "../../../interfaces";
import {
  gameState,
  handleLegionBoxIn,
  handleUpdateLegionBoxIn,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";

const UpdateSelectBox: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    allBeasts,
    allWarriors,
    updateLegionLoading,
    warriorFilterLevel,
    warriorFilterMaxAP,
    warriorFilterMinAP,
    beastFilterCapacity,
    warriorFilterMaxConstAP,
  } = AppSelector(gameState);

  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Account & Web3

  // Contracts

  // State

  const capacityFilterVal =
    beastFilterCapacity === 0
      ? allBeasts
      : allBeasts.filter((beast) => beast.capacity === beastFilterCapacity);

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
  const handleBoxIn = (type: Number, item: I_Beast | I_Warrior) => {
    dispatch(
      handleUpdateLegionBoxIn({
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
              {isSmallerThanSM ? (
                "W"
              ) : (
                <LanguageTranslate translateKey="warriors" />
              )}
            </Button>
            <Button
              variant={showType === 0 ? "contained" : "outlined"}
              onClick={() => setShowType(0)}
            >
              {isSmallerThanSM ? (
                "B"
              ) : (
                <LanguageTranslate translateKey="beasts" />
              )}
            </Button>
          </ButtonGroup>
        </Box>
        {showType === 0 ? (
          <Box>
            <Box sx={{ mb: 4 }}>
              <BeastCapacityFilter showSmall={true} />
            </Box>
            <Grid container spacing={2}>
              {capacityFilterVal.map((beast: I_Beast, index: Number) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={3}
                  key={index.valueOf()}
                  onClick={() => !updateLegionLoading && handleBoxIn(0, beast)}
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
              {APFilterVal.map((warrior: I_Warrior, index: Number) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={3}
                  key={index.valueOf()}
                  onClick={() =>
                    !updateLegionLoading && handleBoxIn(1, warrior)
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
