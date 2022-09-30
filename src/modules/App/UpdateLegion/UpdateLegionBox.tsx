import {
  Box,
  Card,
  Grid,
  Input,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FireBtn from "../../../components/Buttons/FireBtn";
import BeastCard from "../../../components/Cards/Beast.card";
import WarriorCard from "../../../components/Cards/Warrior.card";
import { I_Beast, I_LegionBox, I_Warrior } from "../../../interfaces";
import {
  gameState,
  handleLegionBoxOut,
  handleUpdateLegionBoxOut,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  getBloodstoneAllowance,
  getCapacityOfLegion,
  getCostForAddingWarrior,
  getTrainingCost,
  mintLegion,
  setBloodstoneApprove,
  updateLegion,
} from "../../../web3hooks/contractFunctions";
import { getLegionAddress } from "../../../web3hooks/getAddress";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../../web3hooks/useContract";
import Swal from "sweetalert2";
import WalletSelectModal from "../../../components/Modals/WalletSelect.modal";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";

const UpdateLegionBox: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    updateLegionBox,
    updateLegionLoading,
    reinvestedWalletBLST,
    legionForUpdate,
    reinvestedWalletUSD,
    voucherWalletUSD,
  } = AppSelector(gameState);
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const bloodstoneContract = useBloodstone();
  const feehandlerContract = useFeeHandler();
  const legionContract = useLegion();

  // States
  const [updateBLSTFee, setUpdateBLSTFee] = useState<Number>(0);
  const [updateUSDFee, setUpdateUSDFee] = useState<Number>(0);
  const [currentLegionCapacity, setCurrentLegionCapacity] = useState<number>(0);
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const beastCount =
    updateLegionBox.filter((item) => item.type === 0).length +
    legionForUpdate.beastIds.length;
  const totalBeastCapacity =
    updateLegionBox
      .filter((item) => item.type === 0)
      .reduce((a, b) => a + (b.item as I_Beast).capacity.valueOf(), 0) +
    currentLegionCapacity;

  const warriorCount =
    updateLegionBox.filter((item) => item.type === 1).length +
    legionForUpdate.warriorIds.length;
  const totalWarriorAttackPower = updateLegionBox
    .filter((item) => item.type === 1)
    .reduce((a, b) => a + (b.item as I_Warrior).attackPower.valueOf(), 0);

  const isNotEnoughBeast = warriorCount > totalBeastCapacity;

  // Functions
  const getBalance = async () => {
    try {
      const currentLegionCapacity = await getCapacityOfLegion(
        legionContract,
        legionForUpdate.id
      );
      console.log(currentLegionCapacity, typeof currentLegionCapacity);
      setCurrentLegionCapacity(parseInt(currentLegionCapacity));
    } catch (error) {
      console.log(error);
    }
  };

  const setFee = async () => {
    const trainingCost = await getTrainingCost(
      web3,
      feehandlerContract,
      updateLegionBox.filter((item) => item.type === 0).length
    );
    const addingWarriorCost = await getCostForAddingWarrior(
      web3,
      feehandlerContract,
      updateLegionBox.filter((item) => item.type === 1).length,
      legionForUpdate.supplies
    );
    setUpdateBLSTFee(
      Number(trainingCost.blst) + Number(addingWarriorCost.blst)
    );
    setUpdateUSDFee(Number(trainingCost.busd) + Number(addingWarriorCost.busd));
  };

  const handleBoxOut = (type: Number, item: I_Beast | I_Warrior) => {
    dispatch(handleUpdateLegionBoxOut({ type, item }));
  };

  const handleSelectWallet = async (walletNumber: number) => {
    dispatch(updateState({ walletSelectModalOpen: false }));
    try {
      dispatch(updateState({ updateLegionLoading: true }));
      if (walletNumber === 0) {
        const allowance = await getBloodstoneAllowance(
          web3,
          bloodstoneContract,
          getLegionAddress(),
          account
        );
        if (allowance < updateBLSTFee) {
          await setBloodstoneApprove(
            web3,
            bloodstoneContract,
            getLegionAddress(),
            account
          );
        }
      } else if (walletNumber === 1) {
        if (Number(reinvestedWalletUSD) < Number(updateUSDFee)) {
          toast.error(
            "You do not have enough $USD in your Reinvest Wallet to update a Legion."
          );
          dispatch(updateState({ updateLegionLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (Number(voucherWalletUSD) < Number(updateUSDFee)) {
          toast.error(
            "You do not have enough $USD in your Voucher Wallet to udpate a Legion."
          );
          dispatch(updateState({ updateLegionLoading: false }));
          return;
        }
      }
      await updateLegion(
        legionContract,
        account,
        legionForUpdate.id,
        updateLegionBox
          .filter((item) => item.type === 0)
          .map((item) => item.item.id),
        updateLegionBox
          .filter((item) => item.type === 1)
          .map((item) => item.item.id),
        walletNumber
      );
      toast.success(
        <LanguageTranslate translateKey="updateLegionSuccessful" />
      );
      navigate("/legions");
    } catch (error) {}
    dispatch(updateState({ updateLegionLoading: false }));
  };

  const handleUpdate = async () => {
    dispatch(updateState({ walletSelectModalOpen: true }));
  };

  // Use Effect
  useEffect(() => {
    setFee();
  }, [updateLegionBox]);

  useEffect(() => {
    getBalance();
  }, [legionForUpdate]);

  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        {isSmallerThanSM ? (
          <>
            <LanguageTranslate translateKey="existingAPIs" />{" "}
            {formatNumber(Number(legionForUpdate.attackPower))} AP -{" "}
            <LanguageTranslate translateKey="ShortFeeToolTip" />{" "}
            {Number(updateBLSTFee).toFixed(2)}{" "}
            <LanguageTranslate translateKey="$" />
            <LanguageTranslate translateKey="blst" />
          </>
        ) : (
          <>
            <LanguageTranslate translateKey="yourOldLegionAP" />{" "}
            {formatNumber(Number(legionForUpdate.attackPower))} AP -{" "}
            {Number(updateBLSTFee).toFixed(2)}{" "}
            <LanguageTranslate translateKey="$" />
            <LanguageTranslate translateKey="blst" />
          </>
        )}
      </Box>
      <Grid container sx={{ mb: 2 }}>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pb: 1,
          }}
        >
          {legionForUpdate.name}
        </Grid>
        <Grid item xs={12} lg={6} sx={{ textAlign: "center", pb: 1 }}>
          <FireBtn
            disabled={
              isNotEnoughBeast ||
              beastCount > 10 ||
              updateLegionBox.length === 0
            }
            loading={updateLegionLoading.valueOf()}
            onClick={() => handleUpdate()}
          >
            {isSmallerThanSM ? (
              <>
                <LanguageTranslate translateKey="updateLegion" /> (
                {formatNumber(
                  Number(legionForUpdate.attackPower) +
                    Number(totalWarriorAttackPower)
                )}
                AP)
              </>
            ) : (
              <>
                <LanguageTranslate translateKey="updateLegion" />{" "}
                <LanguageTranslate translateKey="to" />{" "}
                {formatNumber(
                  Number(legionForUpdate.attackPower) +
                    Number(totalWarriorAttackPower)
                )}{" "}
                AP
              </>
            )}
          </FireBtn>
        </Grid>
      </Grid>
      <Grid container sx={{ mb: 2, pb: 2, borderBottom: "2px dashed grey" }}>
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          <Typography
            sx={
              isNotEnoughBeast
                ? { color: "red", fontWeight: "bold" }
                : { color: "white" }
            }
          >
            {isSmallerThanSM ? (
              "W"
            ) : (
              <LanguageTranslate translateKey="warriors" />
            )}
            : {warriorCount} / {totalBeastCapacity}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          <Typography
            sx={
              beastCount > 10
                ? { color: "red", fontWeight: "bold" }
                : { color: "white" }
            }
          >
            {isSmallerThanSM ? (
              "B"
            ) : (
              <LanguageTranslate translateKey="beasts" />
            )}
            : {beastCount} / 10
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {updateLegionBox.map((item: I_LegionBox, index: Number) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={3}
            key={index.valueOf()}
            onClick={() =>
              !updateLegionLoading && handleBoxOut(item.type, item.item)
            }
          >
            {item.type === 0 ? (
              <BeastCard beast={item.item as I_Beast} isActionBtns={false} />
            ) : (
              <WarriorCard
                warrior={item.item as I_Warrior}
                isActionBtns={false}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <WalletSelectModal handleSelectWallet={handleSelectWallet} />
    </Card>
  );
};

export default UpdateLegionBox;
