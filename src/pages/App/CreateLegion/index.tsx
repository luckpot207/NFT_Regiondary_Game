import React, { useEffect } from "react";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Card,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import FireBtn from "../../../components/Buttons/FireBtn";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useLegion,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import CreateLegionBox from "./CreateLegionBox";
import CreateSelectBox from "./CreateSelectBox";
import { beastState, updateBeastState } from "../../../reducers/beast.reducer";
import {
  warriorState,
  updateWarriorState,
} from "../../../reducers/warrior.reducer";
import {
  legionState,
  updateLegionState,
} from "../../../reducers/legion.reducer";
import LegionService from "../../../services/legion.service";
import BeastService from "../../../services/beast.service";
import WarriorService from "../../../services/warrior.service";

const CreateLegion: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const { getAllBeastsLoading } = AppSelector(beastState);
  const { getAllWarriorsLoading } = AppSelector(warriorState);
  const { isApprovedBeastForLegion, isApprovedWarriorForLegion } =
    AppSelector(legionState);

  const theme = useTheme();

  // Account & Web3
  const { account } = useWeb3React();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();

  // State
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Use Effect
  useEffect(() => {
    getBalance();
  }, [account]);

  // Functions
  const getBalance = async () => {
    try {
      dispatch(updateBeastState({ allBeasts: [] }));
      dispatch(updateWarriorState({ allWarriors: [] }));
      dispatch(updateLegionState({ createLegionBox: [] }));
      await LegionService.checkAndApproveBeastForLegion(
        dispatch,
        account,
        beastContract
      );
      await LegionService.checkAndApproveWarriorForLegion(
        dispatch,
        account,
        warriorContract
      );
      BeastService.getAllBeastsAct(dispatch, account, beastContract);
      WarriorService.getAllWarriorsAct(dispatch, account, warriorContract);
    } catch (error) {}
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              {getTranslation("createLegion")}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <NavLink to="/legions" className="td-none">
            <FireBtn
              sx={{
                mb: 1,
                wordBreak: "break-word",
                p: 2,
              }}
            >
              <IconButton
                aria-label="claim"
                component="span"
                sx={{ p: 0, mr: 1, color: "black", bgcolor: "smooth" }}
              >
                <ArrowBack />
              </IconButton>
              {isSmallerThanSM
                ? getTranslation("back")
                : getTranslation("btnBackToLegions")}
            </FireBtn>
          </NavLink>
        </Grid>
        {getAllBeastsLoading ||
        getAllWarriorsLoading ||
        !isApprovedBeastForLegion ||
        !isApprovedWarriorForLegion ? (
          <LoadingBloodstone loadingPage="createLegion" />
        ) : (
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <CreateSelectBox />
              </Grid>
              <Grid item xs={6}>
                <CreateLegionBox />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CreateLegion;
