import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { Box, DialogTitle, Popover } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { getReferralInfo } from "../../helpers/referral";
import {
  checkMintWarriorPending,
  checkWarriorRevealStatus,
} from "../../helpers/warrior";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import {
  getBloodstoneAllowance,
  getWalletMintPending,
  initializeFreeMint,
  initialMintBeastAndWarrior,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions";
import { getWarriorAddress } from "../../web3hooks/getAddress";
import {
  useBloodstone,
  useReferralSystem,
  useVRF,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import WalletSelectModal from "../Modals/WalletSelect.modal";
import LanguageTranslate from "../UI/LanguageTranslate";

const SummonWarriorPopover: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    summonWarriorAnchorEl,
    language,
    summonPrice,
    summonReductionPer,
    reinvestedWalletBLST,
    mintWarriorPending,
    hasFreeMint,
    reinvestedWalletUSD,
    voucherWalletUSD,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const bloodstoneContract = useBloodstone();
  const warriorContract = useWarrior();
  const vrfContract = useVRF();
  const referralSystemContract = useReferralSystem();

  // State
  const open = Boolean(summonWarriorAnchorEl);
  const [quantity, setQuantity] = useState<Number>(0);

  // Function
  const handleClose = () => {
    dispatch(
      updateState({
        summonWarriorAnchorEl: null,
      })
    );
  };

  const handleSelectWallet = async (walletNumber: number) => {
    handleClose();
    dispatch(updateState({ walletSelectModalOpen: false }));
    let key: any = "p1";
    switch (quantity) {
      case 1:
        key = "p1";
        break;
      case 10:
        key = "p10";
        break;
      case 50:
        key = "p50";
        break;
      case 100:
        key = "p100";
        break;
      case 150:
        key = "p150";
        break;
      default:
        break;
    }
    dispatch(updateState({ initialMintWarriorLoading: true }));
    try {
      const allowance = await getBloodstoneAllowance(
        web3,
        bloodstoneContract,
        getWarriorAddress(),
        account
      );
      if (walletNumber === 0) {
        if (
          allowance < Number(summonPrice[key as keyof typeof summonPrice].blst)
        ) {
          await setBloodstoneApprove(
            web3,
            bloodstoneContract,
            getWarriorAddress(),
            account
          );
        }
      } else if (walletNumber === 1) {
        if (
          Number(reinvestedWalletUSD) <
          Number(summonPrice[key as keyof typeof summonPrice].usd)
        ) {
          toast.error(
            <LanguageTranslate translateKey="notEnoughUSDInReinvestWalletToMintWarriors" />
          );
          dispatch(updateState({ initialMintWarriorLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (
          Number(voucherWalletUSD) <
          Number(summonPrice[key as keyof typeof summonPrice].usd)
        ) {
          console.log("notEnoughUSDInVoucherWalletToMintWarriors");
          toast.error(
            <LanguageTranslate translateKey="notEnoughUSDInVoucherWalletToMintWarriors" />
          );
          dispatch(updateState({ initialMintWarriorLoading: false }));
          return;
        }
      }
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      dispatch(updateState({ mintWarriorPending }));
      if (!mintWarriorPending) {
        await initialMintBeastAndWarrior(
          warriorContract,
          account,
          quantity,
          walletNumber
        );
        const mintWarriorPending = await getWalletMintPending(
          warriorContract,
          account
        );
        dispatch(
          updateState({ mintWarriorPending, initialMintWarriorLoading: false })
        );
        checkWarriorRevealStatus(
          dispatch,
          account,
          warriorContract,
          vrfContract
        );
        toast.success(<LanguageTranslate translateKey="plzRevealWarrior" />);
      }
      setTimeout(() => {
        checkMintWarriorPending(dispatch, account, warriorContract);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ initialMintWarriorLoading: false }));
  };

  const handleMint = async (quantity: Number) => {
    setQuantity(quantity);
    dispatch(updateState({ walletSelectModalOpen: true }));
  };

  const handleFreeMint = async () => {
    try {
      handleClose();
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      dispatch(updateState({ mintWarriorPending }));
      if (!mintWarriorPending) {
        dispatch(updateState({ initialMintWarriorLoading: true }));
        await initializeFreeMint(warriorContract, account);
        const mintWarriorPending = await getWalletMintPending(
          warriorContract,
          account
        );
        dispatch(
          updateState({
            mintWarriorPending,
            initialMintWarriorLoading: false,
          })
        );
        checkWarriorRevealStatus(
          dispatch,
          account,
          warriorContract,
          vrfContract
        );
        toast.success(<LanguageTranslate translateKey="plzRevealWarrior" />);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ initialMintWarriorLoading: false }));
  };

  useEffect(() => {
    getReferralInfo(
      dispatch,
      web3,
      account,
      referralSystemContract,
      warriorContract
    );
  }, [mintWarriorPending]);

  return (
    <Popover
      id={"summon-warrior-btn"}
      open={open}
      anchorEl={summonWarriorAnchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            marginLeft: "auto",
            cursor: "pointer",
            marginRight: 1,
            marginTop: 1,
          }}
        >
          <FaTimes onClick={handleClose} />
        </Box>
      </Box>
      <DialogTitle>
        <LanguageTranslate translateKey="summonWarriorQuantity" />
      </DialogTitle>
      <Box
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {hasFreeMint && (
          <FireBtn
            sx={{ fontSize: 14, mb: 1 }}
            onClick={() => handleFreeMint()}
          >
            Free Mint Available
          </FireBtn>
        )}
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(1)}>
          1 ({Number(summonPrice["p1"].blst).toFixed(2)} $BLST)
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(10)}>
          10 ({summonReductionPer["p10"]}% |{" "}
          {Number(summonPrice["p10"].blst).toFixed(2)} $BLST)
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(50)}>
          50 ({summonReductionPer["p50"]}% |{" "}
          {Number(summonPrice["p50"].blst).toFixed(2)} $BLST)
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(100)}>
          100 ({summonReductionPer["p100"]}% |{" "}
          {Number(summonPrice["p100"].blst).toFixed(2)} $BLST)
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(150)}>
          150 ({summonReductionPer["p150"]}% |{" "}
          {Number(summonPrice["p150"].blst).toFixed(2)} $BLST)
        </FireBtn>
      </Box>
      <WalletSelectModal handleSelectWallet={handleSelectWallet} />
    </Popover>
  );
};

export default SummonWarriorPopover;
