import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { revealBeast } from "../../helpers/beast";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import {
  getBLSTAmount,
  getVoucherWalletUSDBalance,
} from "../../web3hooks/contractFunctions";
import {
  useBeast,
  useFeeHandler,
  useRewardPool,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import LanguageTranslate from "../UI/LanguageTranslate";

type Props = {
  handleSelectWallet: Function;
};

const WalletSelectModal: React.FC<Props> = ({ handleSelectWallet }) => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    walletSelectModalOpen,
    showVoucherWalletBtn,
    allBeasts,
    allWarriors,
    allLegions,
  } = AppSelector(gameState);

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
      updateState({
        summonBeastAnchorEl: null,
        summonWarriorAnchorEl: null,
      })
    );
    dispatch(updateState({ walletSelectModalOpen: false }));
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
    <Dialog open={walletSelectModalOpen.valueOf()} onClose={handleClose}>
      <Box sx={{ position: "relative", textAlign: "center", px: 2 }}>
        {/* <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box> */}
        <DialogTitle sx={{ textAlign: "center", wordBreak: "break-word" }}>
          <LanguageTranslate translateKey="plzSelectWallet" />
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
            <LanguageTranslate translateKey="metamask" />
          </FireBtn>
          <FireBtn
            sx={{ fontWeight: "bold", mx: 1, mb: 1 }}
            onClick={() => handleSelectWallet(1)}
          >
            <LanguageTranslate translateKey="reinvest" />
          </FireBtn>
          {isShowVoucher && (
            <FireBtn
              sx={{ fontWeight: "bold", mx: 1, mb: 1 }}
              onClick={() => handleSelectWallet(2)}
            >
              <LanguageTranslate translateKey="voucher" /> (
              {Number(voucherBLST).toFixed(2)} $BLST Left)
            </FireBtn>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelectModal;
