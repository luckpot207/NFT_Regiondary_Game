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
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import FireBtn from "../../../components/Buttons/FireBtn";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import { getAllBeastsAct } from "../../../helpers/beast";
import {
  checkAndApproveBeastForLegion,
  checkAndApproveWarriorForLegion,
} from "../../../helpers/legion";
import { getAllWarriorsAct } from "../../../helpers/warrior";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import { getLegion } from "../../../web3hooks/contractFunctions";
import {
  useBeast,
  useLegion,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import UpdateLegionBox from "./UpdateLegionBox";
import UpdateSelectBox from "./UpdateSelectBox";

const UpdateLegion: React.FC = () => {
  // Hook
  const dispatch = useDispatch();
  const {
    language,
    getAllBeastsLoading,
    getAllWarriorsLoading,
    isApprovedBeastForLegion,
    isApprovedWarriorForLegion,
  } = AppSelector(gameState);
  const theme = useTheme();
  const params = useParams();

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();

  // State
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const getBalance = async () => {
    try {
      dispatch(
        updateState({ allBeasts: [], allWarriors: [], updateLegionBox: [] })
      );
      await checkAndApproveBeastForLegion(dispatch, account, beastContract);
      await checkAndApproveWarriorForLegion(dispatch, account, warriorContract);
      const legionForUpdate = await getLegion(legionContract, params.id);
      console.log("legionForUpdate", legionForUpdate);
      dispatch(updateState({ legionForUpdate }));
      getAllBeastsAct(dispatch, account, beastContract);
      getAllWarriorsAct(dispatch, account, warriorContract);
    } catch (error) {
      console.log(error);
    }
  };
  // Functions

  // Use Effect
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Box>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mx: 4 }}>
              <LanguageTranslate translateKey="updateLegion" />
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
              {isSmallerThanSM ? (
                <LanguageTranslate translateKey="back" />
              ) : (
                <LanguageTranslate translateKey="btnBackToLegions" />
              )}
            </FireBtn>
          </NavLink>
        </Grid>
        {getAllBeastsLoading ||
        getAllWarriorsLoading ||
        !isApprovedBeastForLegion ||
        !isApprovedWarriorForLegion ? (
          <LoadingBloodstone loadingPage="updateLegion" />
        ) : (
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <UpdateSelectBox />
              </Grid>
              <Grid item xs={6}>
                <UpdateLegionBox />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UpdateLegion;
