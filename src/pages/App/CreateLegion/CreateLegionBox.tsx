import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import {
  Box,
  Card,
  Grid,
  Input,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../../web3hooks/useContract";
import { AppSelector } from "../../../store";
import BeastCard from "../../../components/Cards/Beast.card";
import FireBtn from "../../../components/Buttons/FireBtn";
import WalletSelectModal from "../../../components/Modals/WalletSelect.modal";
import WarriorCard from "../../../components/Cards/Warrior.card";
import { getLegionAddress } from "../../../web3hooks/getAddress";
import {
  createLegionBoxOut,
  legionState,
  updateLegionState,
} from "../../../reducers/legion.reducer";
import { inventoryState } from "../../../reducers/inventory.reducer";
import { updateModalState } from "../../../reducers/modal.reducer";
import { IBeast, ILegionBox, IWarrior } from "../../../types";
import { getTrainingCost } from "../../../web3hooks/contractFunctions/feehandler.contract";
import {
  getBloodstoneAllowance,
  setBloodstoneApprove,
} from "../../../web3hooks/contractFunctions/common.contract";
import { mintLegion } from "../../../web3hooks/contractFunctions/legion.contract";
import gameConfig from "../../../config/game.config";

const CreateLegionBox: React.FC = () => {
  const dispatch = useDispatch();
  const { createLegionBox, createLegionLoading } = AppSelector(legionState);
  const { voucherWalletUSD, reinvestedWalletUSD } = AppSelector(inventoryState);
  const theme = useTheme();
  const navigate = useNavigate();

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const bloodstoneContract = useBloodstone();
  const feehandlerContract = useFeeHandler();
  const legionContract = useLegion();

  // States
  const [legionName, setLegionName] = useState<String>("");
  const [mintBLSTFee, setMintBLSTFee] = useState<Number>(0);
  const [mintUSDFee, setMintUSDFee] = useState<Number>(0);
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const beastCount = createLegionBox.filter(
    (item) => item.type === gameConfig.nftItemType.beast
  ).length;
  const totalBeastCapacity = createLegionBox
    .filter((item) => item.type === gameConfig.nftItemType.beast)
    .reduce((a, b) => a + Number((b.item as IBeast).capacity), 0);

  const warriorCount = createLegionBox.filter(
    (item) => item.type === gameConfig.nftItemType.warrior
  ).length;
  const totalWarriorAttackPower = createLegionBox
    .filter((item) => item.type === gameConfig.nftItemType.warrior)
    .reduce((a, b) => a + (b.item as IWarrior).attackPower.valueOf(), 0);

  const isNotEnoughBeast = warriorCount > totalBeastCapacity;

  // Use Effect
  useEffect(() => {
    setFee();
  }, [createLegionBox]);
  // Functions
  const setFee = async () => {
    const mintFee = await getTrainingCost(
      web3,
      feehandlerContract,
      createLegionBox.length
    );
    setMintBLSTFee(mintFee.blst);
    setMintUSDFee(mintFee.busd);
  };

  const handleBoxOut = (type: Number, item: IBeast | IWarrior) => {
    dispatch(createLegionBoxOut({ type, item }));
  };

  const handleSelectWallet = async (walletNumber: number) => {
    dispatch(updateModalState({ walletSelectModalOpen: false }));
    try {
      dispatch(updateLegionState({ createLegionLoading: true }));
      if (walletNumber === 0) {
        const allowance = await getBloodstoneAllowance(
          web3,
          bloodstoneContract,
          getLegionAddress(),
          account
        );
        if (allowance < mintBLSTFee) {
          await setBloodstoneApprove(
            web3,
            bloodstoneContract,
            getLegionAddress(),
            account
          );
        }
      } else if (walletNumber === 1) {
        if (Number(reinvestedWalletUSD) < Number(mintUSDFee)) {
          toast.error(
            getTranslation("notEnoughUSDInReinvestWalletToCreateLegion")
          );
          dispatch(updateLegionState({ createLegionLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (Number(voucherWalletUSD) < Number(mintUSDFee)) {
          toast.error(
            getTranslation("notEnoughUSDInVoucherWalletToCreateLegion")
          );
          dispatch(updateLegionState({ createLegionLoading: false }));
          return;
        }
      }
      await mintLegion(
        legionContract,
        account,
        legionName,
        createLegionBox
          .filter((item) => item.type === gameConfig.nftItemType.beast)
          .map((item) => item.item.id),
        createLegionBox
          .filter((item) => item.type === gameConfig.nftItemType.warrior)
          .map((item) => item.item.id),
        walletNumber
      );
      toast.success(getTranslation("summonLegionSuccessful"));
      navigate("/cybers");
    } catch (error) {}
    dispatch(updateLegionState({ createLegionLoading: false }));
  };

  const handleMint = async () => {
    dispatch(updateModalState({ walletSelectModalOpen: true }));
  };

  const handleSetLegionName = (e: any) => {
    const name = e.target.value;
    console.log(name);
    console.log(name.length);
    if (name.length <= 40) {
      setLegionName(name);
    } else {
      toast.error(getTranslation("legionNameLimit"));
    }
  };

  return (
    <Card sx={{ p: 2, height: "100%" }}>
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
          <Input
            placeholder={
              isSmallerThanSM
                ? getTranslation("name")
                : getTranslation("nameLegion")
            }
            onChange={(e) => handleSetLegionName(e)}
            disabled={createLegionLoading.valueOf()}
            value={legionName}
          />
        </Grid>
        <Grid item xs={12} lg={6} sx={{ textAlign: "center", pb: 1 }}>
          <FireBtn
            disabled={
              totalWarriorAttackPower < 2000 ||
              isNotEnoughBeast ||
              legionName === ""
            }
            loading={createLegionLoading.valueOf()}
            onClick={() => handleMint()}
          >
            {isSmallerThanSM
              ? getTranslation("create")
              : getTranslation("createLegion")}{" "}
            {totalWarriorAttackPower > 0
              ? formatNumber(totalWarriorAttackPower)
              : 0}
            {" AP "}
            {isNotEnoughBeast ? (
              <>{getTranslation("notEnoughBeasts")}</>
            ) : totalWarriorAttackPower < 2000 ? (
              <>
                {`${getTranslation("min")} 2000 AP ${getTranslation("needed")}`}
              </>
            ) : (
              ""
            )}
          </FireBtn>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        {isSmallerThanSM ? (
          <>
            {`${getTranslation("ShortFeeToolTip")} ${formatNumber(
              Number(mintBLSTFee).toFixed(2)
            )} $${getTranslation("blst")}`}
          </>
        ) : (
          <>
            {`${getTranslation("LongFeeToolTip")} ${formatNumber(
              Number(mintBLSTFee).toFixed(2)
            )} $${getTranslation("blst")}
            `}
          </>
        )}
      </Box>
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
        {createLegionBox.map((item: ILegionBox, index: Number) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={3}
            key={index.valueOf()}
            onClick={() =>
              !createLegionLoading && handleBoxOut(item.type, item.item)
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

export default CreateLegionBox;
