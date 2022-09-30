import {
  Box,
  Card,
  Grid,
  Input,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { I_Beast, I_LegionBox, I_Warrior } from "../../../interfaces";
import React, { useEffect, useState } from "react";
import { formatNumber, getTranslation } from "../../../utils/utils";
import {
  gameState,
  handleLegionBoxOut,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import {
  getBloodstoneAllowance,
  getTrainingCost,
  mintLegion,
  setBloodstoneApprove,
} from "../../../web3hooks/contractFunctions";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../../web3hooks/useContract";
import { renderToString } from "react-dom/server";
import { AppSelector } from "../../../store";
import BeastCard from "../../../components/Cards/Beast.card";
import FireBtn from "../../../components/Buttons/FireBtn";
import WalletSelectModal from "../../../components/Modals/WalletSelect.modal";
import WarriorCard from "../../../components/Cards/Warrior.card";
import { getLegionAddress } from "../../../web3hooks/getAddress";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";

const CreateLegionBox: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    createLegionBox,
    createLegionLoading,
    reinvestedWalletBLST,
    reinvestedWalletUSD,
    voucherWalletUSD,
  } = AppSelector(gameState);
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

  const beastCount = createLegionBox.filter((item) => item.type === 0).length;
  const totalBeastCapacity = createLegionBox
    .filter((item) => item.type === 0)
    .reduce((a, b) => a + (b.item as I_Beast).capacity.valueOf(), 0);

  const warriorCount = createLegionBox.filter((item) => item.type === 1).length;
  const totalWarriorAttackPower = createLegionBox
    .filter((item) => item.type === 1)
    .reduce((a, b) => a + (b.item as I_Warrior).attackPower.valueOf(), 0);

  const isNotEnoughBeast = warriorCount > totalBeastCapacity;

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

  const handleBoxOut = (type: Number, item: I_Beast | I_Warrior) => {
    dispatch(handleLegionBoxOut({ type, item }));
  };

  const handleSelectWallet = async (walletNumber: number) => {
    dispatch(updateState({ walletSelectModalOpen: false }));
    try {
      dispatch(updateState({ createLegionLoading: true }));
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
            <LanguageTranslate translateKey="notEnoughUSDInReinvestWalletToCreateLegion" />
          );
          dispatch(updateState({ createLegionLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (Number(voucherWalletUSD) < Number(mintUSDFee)) {
          toast.error(
            <LanguageTranslate translateKey="notEnoughUSDInVoucherWalletToCreateLegion" />
          );
          dispatch(updateState({ createLegionLoading: false }));
          return;
        }
      }
      await mintLegion(
        legionContract,
        account,
        legionName,
        createLegionBox
          .filter((item) => item.type === 0)
          .map((item) => item.item.id),
        createLegionBox
          .filter((item) => item.type === 1)
          .map((item) => item.item.id),
        walletNumber
      );
      toast.success(
        <LanguageTranslate translateKey="summonLegionSuccessful" />
      );
      navigate("/legions");
    } catch (error) {}
    dispatch(updateState({ createLegionLoading: false }));
  };

  const handleMint = async () => {
    dispatch(updateState({ walletSelectModalOpen: true }));
  };

  const handleSetLegionName = (e: any) => {
    const name = e.target.value;
    console.log(name);
    console.log(name.length);
    if (name.length <= 40) {
      setLegionName(name);
    } else {
      toast.error(LanguageTranslate({ translateKey: "legionNameLimit" }));
    }
  };

  // Use Effect
  useEffect(() => {
    setFee();
  }, [createLegionBox]);

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
                ? LanguageTranslate({ translateKey: "name" })
                : LanguageTranslate({ translateKey: "nameLegion" })
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
            {isSmallerThanSM ? (
              <LanguageTranslate translateKey="create" />
            ) : (
              <LanguageTranslate translateKey="createLegion" />
            )}{" "}
            {totalWarriorAttackPower > 0
              ? formatNumber(totalWarriorAttackPower)
              : 0}
            {" AP "}
            {isNotEnoughBeast ? (
              <>
                (<LanguageTranslate translateKey="notEnoughBeasts" />)
              </>
            ) : totalWarriorAttackPower < 2000 ? (
              <>
                (
                <LanguageTranslate translateKey="min" /> 2000 AP{" "}
                <LanguageTranslate translateKey="needed" />)
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
            <LanguageTranslate translateKey="ShortFeeToolTip" />{" "}
            {formatNumber(Number(mintBLSTFee).toFixed(2))} $BLST
          </>
        ) : (
          <>
            <LanguageTranslate translateKey="LongFeeToolTip" />{" "}
            {formatNumber(Number(mintBLSTFee).toFixed(2))} $BLST
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
        {createLegionBox.map((item: I_LegionBox, index: Number) => (
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

export default CreateLegionBox;
