import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { Box, DialogTitle, Popover } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { AppSelector } from "../../store";
import { getWarriorAddress } from "../../web3hooks/getAddress";
import {
  useBloodstone,
  useReferralSystem,
  useVRF,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import { inventoryState } from "../../reducers/inventory.reducer";
import { referralState } from "../../reducers/referral.reducer";
import {
  warriorState,
  updateWarriorState,
} from "../../reducers/warrior.reducer";
import { updateModalState } from "../../reducers/modal.reducer";
import { getTranslation } from "../../utils/utils";
import {
  getBloodstoneAllowance,
  getWalletMintPending,
  initialMintBeastAndWarrior,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions/common.contract";
import WarriorService from "../../services/warrior.service";
import { initializeFreeMint } from "../../web3hooks/contractFunctions/referral.contract";
import ReferralService from "../../services/referral.service";
import WalletSelectModal from "../Modals/WalletSelect.modal";

const SummonWarriorPopover: React.FC = () => {
  const dispatch = useDispatch();

  const { summonWarriorAnchorEl, summonPrice, summonReductionPer } =
    AppSelector(commonState);
  const { voucherWalletUSD, reinvestedWalletUSD } = AppSelector(inventoryState);
  const { hasFreeMint } = AppSelector(referralState);
  const { mintWarriorPending } = AppSelector(warriorState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const bloodstoneContract = useBloodstone();
  const warriorContract = useWarrior();
  const vrfContract = useVRF();
  const referralSystemContract = useReferralSystem();

  const open = Boolean(summonWarriorAnchorEl);
  const [quantity, setQuantity] = useState<Number>(0);

  useEffect(() => {
    ReferralService.getReferralInfo(
      dispatch,
      web3,
      account,
      referralSystemContract,
      warriorContract
    );
  }, [mintWarriorPending, account]);

  const handleClose = () => {
    dispatch(
      updateCommonState({
        summonWarriorAnchorEl: null,
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
    dispatch(updateWarriorState({ initialMintWarriorLoading: true }));
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
            getTranslation("notEnoughUSDInReinvestWalletToMintWarriors")
          );
          dispatch(updateWarriorState({ initialMintWarriorLoading: false }));
          return;
        }
      } else if (walletNumber === 2) {
        if (
          Number(voucherWalletUSD) <
          Number(summonPrice[key as keyof typeof summonPrice].usd)
        ) {
          toast.error(
            getTranslation("notEnoughUSDInVoucherWalletToMintWarriors")
          );
          dispatch(updateWarriorState({ initialMintWarriorLoading: false }));
          return;
        }
      }
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      dispatch(updateWarriorState({ mintWarriorPending }));
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
          updateWarriorState({
            mintWarriorPending,
            initialMintWarriorLoading: false,
          })
        );
        WarriorService.checkWarriorRevealStatus(
          dispatch,
          account,
          warriorContract,
          vrfContract
        );
        toast.success(getTranslation("plzRevealWarrior"));
      }
      setTimeout(() => {
        WarriorService.checkMintWarriorPending(
          dispatch,
          account,
          warriorContract
        );
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    dispatch(updateWarriorState({ initialMintWarriorLoading: false }));
  };

  const handleMint = async (quantity: Number) => {
    setQuantity(quantity);
    dispatch(updateModalState({ walletSelectModalOpen: true }));
  };

  const handleFreeMint = async () => {
    try {
      handleClose();
      const mintWarriorPending = await getWalletMintPending(
        warriorContract,
        account
      );
      dispatch(updateWarriorState({ mintWarriorPending }));
      if (!mintWarriorPending) {
        dispatch(updateWarriorState({ initialMintWarriorLoading: true }));
        await initializeFreeMint(warriorContract, account);
        const mintWarriorPending = await getWalletMintPending(
          warriorContract,
          account
        );
        dispatch(
          updateWarriorState({
            mintWarriorPending,
            initialMintWarriorLoading: false,
          })
        );
        WarriorService.checkWarriorRevealStatus(
          dispatch,
          account,
          warriorContract,
          vrfContract
        );
        toast.success(getTranslation("plzRevealWarrior"));
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateWarriorState({ initialMintWarriorLoading: false }));
  };

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
      <DialogTitle>{getTranslation("summonWarriorQuantity")}</DialogTitle>
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

export default SummonWarriorPopover;
