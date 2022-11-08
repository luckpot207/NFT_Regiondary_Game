import React, { useState } from "react";
import { Box, DialogTitle, Popover } from "@mui/material";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import FireBtn from "../Buttons/FireBtn";
import { useWeb3React } from "@web3-react/core";
import {
  useBeast,
  useBloodstone,
  useVRF,
  useWeb3,
} from "../../web3hooks/useContract";
import { getBeastAddress } from "../../web3hooks/getAddress";
import WalletSelectModal from "../Modals/WalletSelect.modal";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import { inventoryState } from "../../reducers/inventory.reducer";
import {
  getBloodstoneAllowance,
  getWalletMintPending,
  initialMintBeastAndWarrior,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions/common.contract";
import BeastService from "../../services/beast.service";
import { updateModalState } from "../../reducers/modal.reducer";
import { updateBeastState } from "../../reducers/beast.reducer";

const SummonBeastPopover: React.FC = () => {
  const dispatch = useDispatch();
  const { summonBeastAnchorEl, summonPrice, summonReductionPer } =
    AppSelector(commonState);
  const { reinvestedWalletUSD, reinvestedTotalUSD, voucherWalletUSD } =
    AppSelector(inventoryState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const bloodstoneContract = useBloodstone();
  const beastContract = useBeast();
  const vrfContract = useVRF();

  const open = Boolean(summonBeastAnchorEl);
  const [quantity, setQuantity] = useState<Number>(0);

  const handleClose = () => {
    dispatch(
      updateCommonState({
        summonBeastAnchorEl: null,
      })
    );
  };

  const handleSelectWallet = async (walletNumber: number) => {
    handleClose();
    dispatch(updateModalState({ walletSelectModalOpen: false }));
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
    dispatch(updateBeastState({ initialMintBeastLoading: true }));
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
            getTranslation("notEnoughUSDInReinvestWalletToMintBeasts")
          );
          dispatch(updateBeastState({ initialMintBeastLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (
          Number(voucherWalletUSD) <
          Number(summonPrice[key as keyof typeof summonPrice].usd)
        ) {
          toast.error(
            getTranslation("notEnoughUSDInVoucherWalletToMintBeasts")
          );
          dispatch(updateBeastState({ initialMintBeastLoading: false }));
          return;
        }
      }
      const mintBeastPending = await getWalletMintPending(
        beastContract,
        account
      );
      dispatch(updateBeastState({ mintBeastPending }));
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
          updateBeastState({ mintBeastPending, initialMintBeastLoading: false })
        );
        BeastService.checkBeastRevealStatus(
          dispatch,
          account,
          beastContract,
          vrfContract
        );
        toast.success(getTranslation("plzRevealBeast"));
      }
      setTimeout(() => {
        BeastService.checkMintBeastPending(dispatch, account, beastContract);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    dispatch(updateBeastState({ initialMintBeastLoading: false }));
  };

  const handleMint = async (quantity: Number) => {
    setQuantity(quantity);
    dispatch(updateModalState({ walletSelectModalOpen: true }));
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
      <DialogTitle>{getTranslation("summonBeastQuantity")}</DialogTitle>
      <Box
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(1)}>
          1 ({Number(summonPrice["p1"].blst).toFixed(2)} $
          {getTranslation("blst")})
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(10)}>
          10 ({summonReductionPer["p10"]}% |{" "}
          {Number(summonPrice["p10"].blst).toFixed(2)} ${getTranslation("blst")}
          )
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(50)}>
          50 ({summonReductionPer["p50"]}% |{" "}
          {Number(summonPrice["p50"].blst).toFixed(2)} ${getTranslation("blst")}
          )
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(100)}>
          100 ({summonReductionPer["p100"]}% |{" "}
          {Number(summonPrice["p100"].blst).toFixed(2)} $
          {getTranslation("blst")})
        </FireBtn>
        <FireBtn sx={{ fontSize: 14, mb: 1 }} onClick={() => handleMint(150)}>
          150 ({summonReductionPer["p150"]}% |{" "}
          {Number(summonPrice["p150"].blst).toFixed(2)} $
          {getTranslation("blst")})
        </FireBtn>
      </Box>
      <WalletSelectModal handleSelectWallet={handleSelectWallet} />
    </Popover>
  );
};

export default SummonBeastPopover;
