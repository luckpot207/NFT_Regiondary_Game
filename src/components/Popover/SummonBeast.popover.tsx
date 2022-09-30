import React, { useState } from "react";
import { Box, DialogTitle, Popover } from "@mui/material";
import { AppSelector } from "../../store";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { getTranslation } from "../../utils/utils";
import FireBtn from "../Buttons/FireBtn";
import { useWeb3React } from "@web3-react/core";
import {
  useBeast,
  useBloodstone,
  useVRF,
  useWeb3,
} from "../../web3hooks/useContract";
import {
  getBloodstoneAllowance,
  getWalletMintPending,
  initialMintBeastAndWarrior,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions";
import { getBeastAddress } from "../../web3hooks/getAddress";
import { toast } from "react-toastify";
import {
  checkBeastRevealStatus,
  checkMintBeastPending,
} from "../../helpers/beast";
import Swal from "sweetalert2";
import WalletSelectModal from "../Modals/WalletSelect.modal";
import LanguageTranslate from "../UI/LanguageTranslate";

const SummonBeastPopover: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    summonBeastAnchorEl,
    language,
    summonPrice,
    summonReductionPer,
    reinvestedWalletBLST,
    reinvestedWalletUSD,
    voucherWalletUSD,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const bloodstoneContract = useBloodstone();
  const beastContract = useBeast();
  const vrfContract = useVRF();

  // State
  const open = Boolean(summonBeastAnchorEl);
  const [quantity, setQuantity] = useState<Number>(0);

  // Function
  const handleClose = () => {
    dispatch(
      updateState({
        summonBeastAnchorEl: null,
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
    dispatch(updateState({ initialMintBeastLoading: true }));
    try {
      const allowance = await getBloodstoneAllowance(
        web3,
        bloodstoneContract,
        getBeastAddress(),
        account
      );
      if (walletNumber === 0) {
        if (
          allowance < Number(summonPrice[key as keyof typeof summonPrice].blst)
        ) {
          await setBloodstoneApprove(
            web3,
            bloodstoneContract,
            getBeastAddress(),
            account
          );
        }
      } else if (walletNumber === 1) {
        if (
          Number(reinvestedWalletUSD) <
          Number(summonPrice[key as keyof typeof summonPrice].usd)
        ) {
          toast.error(
            <LanguageTranslate translateKey="notEnoughUSDInReinvestWalletToMintBeasts" />
          );
          dispatch(updateState({ initialMintBeastLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (
          Number(voucherWalletUSD) <
          Number(summonPrice[key as keyof typeof summonPrice].usd)
        ) {
          toast.error(
            <LanguageTranslate translateKey="notEnoughUSDInVoucherWalletToMintBeasts" />
          );
          dispatch(updateState({ initialMintBeastLoading: false }));
          return;
        }
      }
      const mintBeastPending = await getWalletMintPending(
        beastContract,
        account
      );
      dispatch(updateState({ mintBeastPending }));
      if (!mintBeastPending) {
        await initialMintBeastAndWarrior(
          beastContract,
          account,
          quantity,
          walletNumber
        );
        const mintBeastPending = await getWalletMintPending(
          beastContract,
          account
        );
        dispatch(
          updateState({ mintBeastPending, initialMintBeastLoading: false })
        );
        checkBeastRevealStatus(dispatch, account, beastContract, vrfContract);
        toast.success(<LanguageTranslate translateKey="plzRevealBeast" />);
      }
      setTimeout(() => {
        checkMintBeastPending(dispatch, account, beastContract);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ initialMintBeastLoading: false }));
  };

  const handleMint = async (quantity: Number) => {
    setQuantity(quantity);
    dispatch(updateState({ walletSelectModalOpen: true }));
  };

  return (
    <Popover
      id={"summon-beast-btn"}
      open={open}
      anchorEl={summonBeastAnchorEl}
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
        <LanguageTranslate translateKey="summonBeastQuantity" />
      </DialogTitle>
      <Box
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
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

export default SummonBeastPopover;
