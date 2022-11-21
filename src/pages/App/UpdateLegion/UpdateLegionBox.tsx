import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Input,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";

import FireBtn from "../../../components/Buttons/FireBtn";
import BeastCard from "../../../components/Cards/Beast.card";
import WarriorCard from "../../../components/Cards/Warrior.card";
import { AppSelector } from "../../../store";
import { formatNumber, getTranslation } from "../../../utils/utils";
import { getLegionAddress } from "../../../web3hooks/getAddress";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../../web3hooks/useContract";
import WalletSelectModal from "../../../components/Modals/WalletSelect.modal";
import { inventoryState } from "../../../reducers/inventory.reducer";
import {
  legionState,
  updateLegionBoxOut,
  updateLegionState,
} from "../../../reducers/legion.reducer";
import { updateModalState } from "../../../reducers/modal.reducer";
import { IBeast, ILegionBox, IWarrior } from "../../../types";
import gameConfig from "../../../config/game.config";
import {
  getCapacityOfLegion,
  updateLegion,
} from "../../../web3hooks/contractFunctions/legion.contract";
import {
  getCostForAddingWarrior,
  getTrainingCost,
} from "../../../web3hooks/contractFunctions/feehandler.contract";
import {
  getBloodstoneAllowance,
  setBloodstoneApprove,
} from "../../../web3hooks/contractFunctions/common.contract";
import { navLinks } from "../../../config/nav.config";

const UpdateLegionBox: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const { reinvestedWalletUSD, voucherWalletUSD } = AppSelector(inventoryState);
  const { updateLegionBox, updateLegionLoading, legionForUpdate } =
    AppSelector(legionState);
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
    updateLegionBox.filter((item) => item.type === gameConfig.nftItemType.beast)
      .length + legionForUpdate.beastIds.length;
  const totalBeastCapacity =
    updateLegionBox
      .filter((item) => item.type === gameConfig.nftItemType.beast)
      .reduce((a, b) => a + Number((b.item as IBeast).capacity), 0) +
    currentLegionCapacity;

  const warriorCount =
    updateLegionBox.filter(
      (item) => item.type === gameConfig.nftItemType.warrior
    ).length + legionForUpdate.warriorIds.length;
  const totalWarriorAttackPower = updateLegionBox
    .filter((item) => item.type === gameConfig.nftItemType.warrior)
    .reduce((a, b) => a + (b.item as IWarrior).attackPower.valueOf(), 0);

  const isNotEnoughBeast = warriorCount > totalBeastCapacity;

  // Use Effect
  useEffect(() => {
    setFee();
  }, [updateLegionBox]);

  useEffect(() => {
    getBalance();
  }, [legionForUpdate]);

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
      updateLegionBox.filter(
        (item) => item.type === gameConfig.nftItemType.beast
      ).length
    );
    const addingWarriorCost = await getCostForAddingWarrior(
      web3,
      feehandlerContract,
      updateLegionBox.filter(
        (item) => item.type === gameConfig.nftItemType.warrior
      ).length,
      legionForUpdate.supplies
    );
    setUpdateBLSTFee(
      Number(trainingCost.blst) + Number(addingWarriorCost.blst)
    );
    setUpdateUSDFee(Number(trainingCost.busd) + Number(addingWarriorCost.busd));
  };

  const handleBoxOut = (type: Number, item: IBeast | IWarrior) => {
    dispatch(updateLegionBoxOut({ type, item }));
  };

  const handleSelectWallet = async (walletNumber: number) => {
    dispatch(updateModalState({ walletSelectModalOpen: false }));
    try {
      dispatch(updateLegionState({ updateLegionLoading: true }));
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
            getTranslation("notEnoughUSDInReinvestWalletToUpdateLegion")
          );
          dispatch(updateLegionState({ updateLegionLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (Number(voucherWalletUSD) < Number(updateUSDFee)) {
          toast.error(
            getTranslation("notEnoughUSDInVoucherWalletToUpdateLegion")
          );
          dispatch(updateLegionState({ updateLegionLoading: false }));
          return;
        }
      }
      await updateLegion(
        legionContract,
        account,
        legionForUpdate.id,
        updateLegionBox
          .filter((item) => item.type === gameConfig.nftItemType.beast)
          .map((item) => item.item.id),
        updateLegionBox
          .filter((item) => item.type === gameConfig.nftItemType.warrior)
          .map((item) => item.item.id),
        walletNumber
      );
      toast.success(getTranslation("updateLegionSuccessful"));
      navigate(navLinks.legions);
    } catch (error) {}
    dispatch(updateLegionState({ updateLegionLoading: false }));
  };

  const handleUpdate = async () => {
    dispatch(updateModalState({ walletSelectModalOpen: true }));
  };

  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        {isSmallerThanSM
          ? `${getTranslation("existingAPIs")} ${formatNumber(
              Number(legionForUpdate.attackPower)
            )} AP - ${getTranslation("ShortFeeToolTip")} ${Number(
              updateBLSTFee
            ).toFixed(2)} ${getTranslation("$")}${getTranslation("blst")}`
          : `
          ${getTranslation("yourOldLegionAP")} ${formatNumber(
              Number(legionForUpdate.attackPower)
            )} AP - ${Number(updateBLSTFee).toFixed(2)} ${getTranslation(
              "$"
            )}${getTranslation("blst")}
          `}
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
            {isSmallerThanSM
              ? `${getTranslation("updateLegion")} ${formatNumber(
                  Number(legionForUpdate.attackPower) +
                    Number(totalWarriorAttackPower)
                )} AP`
              : `${getTranslation("updateLegion")} ${getTranslation(
                  "to"
                )} ${formatNumber(
                  Number(legionForUpdate.attackPower) +
                    Number(totalWarriorAttackPower)
                )} AP`}
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
            {isSmallerThanSM ? "W" : getTranslation("warriors")}: {warriorCount}{" "}
            / {totalBeastCapacity}
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
            {isSmallerThanSM ? "B" : getTranslation("beasts")}: {beastCount} /
            10
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {updateLegionBox.map((item: ILegionBox, index: Number) => (
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
            {item.type === gameConfig.nftItemType.beast ? (
              <BeastCard beast={item.item as IBeast} isActionBtns={false} />
            ) : (
              <WarriorCard
                warrior={item.item as IWarrior}
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
