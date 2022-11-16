import React, { useState, useEffect } from "react";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import {
  useFeeHandler,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { updateCommonState } from "../../reducers/common.reduer";
import { getVoucherWalletUSDBalance } from "../../web3hooks/contractFunctions/rewardpool.contract";
import { getBLSTAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import constants from "../../constants";

type Props = {
  handleSelectWallet: Function;
};

const WalletSelectModal: React.FC<Props> = ({ handleSelectWallet }) => {
  const dispatch = useDispatch();
  const { walletSelectModalOpen } = AppSelector(modalState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const feehandlerContract = useFeeHandler();
  const rewardpoolContract = useRewardPool();

  // States
  const [voucherWalletUSD, setVoucherWalletUSD] = useState(0);
  const [voucherBLST, setVoucherBLST] = useState(0);
  const isShowVoucher = voucherWalletUSD > 0;

  // Functions
  const handleClose = () => {
    dispatch(
      updateCommonState({
        summonBeastAnchorEl: null,
        summonWarriorAnchorEl: null,
      })
    );
    dispatch(updateModalState({ walletSelectModalOpen: false }));
  };

  const getBalance = async () => {
    try {
      const voucherWalletUSD = await getVoucherWalletUSDBalance(
        web3,
        rewardpoolContract,
        account
      );
      setVoucherBLST(
        await getBLSTAmount(web3, feehandlerContract, voucherWalletUSD)
      );
      setVoucherWalletUSD(voucherWalletUSD);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Dialog
      open={walletSelectModalOpen.valueOf()}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ position: "relative", textAlign: "center", px: 2 }}>
        {/* <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box> */}
        <DialogTitle sx={{ textAlign: "center", wordBreak: "break-word" }}>
          {getTranslation("plzSelectWallet")}
        </DialogTitle>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 1,
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <FaTimes />
        </Box>
      </Box>
      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <FireBtn
            sx={{ fontWeight: "bold", mx: 1, mb: 1 }}
            onClick={() => handleSelectWallet(0)}
          >
            {getTranslation("metamask")}
          </FireBtn>
          <FireBtn
            sx={{ fontWeight: "bold", mx: 1, mb: 1 }}
            onClick={() => handleSelectWallet(1)}
          >
            {getTranslation("reinvest")}
          </FireBtn>
          {isShowVoucher && (
            <FireBtn
              sx={{ fontWeight: "bold", mx: 1, mb: 1 }}
              onClick={() => handleSelectWallet(2)}
            >
              {getTranslation("voucher")} ({Number(voucherBLST).toFixed(2)} $
              {getTranslation("blst")} {getTranslation("left")})
            </FireBtn>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelectModal;
