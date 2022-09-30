import { Box, Card, Input, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FireBtn from "../../../components/Buttons/FireBtn";
import HomeTypo from "../../../components/UI/HomeTypo";
import {
  gameState,
  updateState,
} from "../../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../../store";
import {
  addVoucherWallet,
  getVoucherWalletUSDBalance,
} from "../../../web3hooks/contractFunctions";
import { useRewardPool, useWeb3 } from "../../../web3hooks/useContract";

const TestVoucher: React.FC = () => {
  const dispatch = useDispatch();
  const { voucherWalletUSD } = AppSelector(gameState);

  const rewardpoolContract = useRewardPool();

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [addVoucherLoading, setAddVoucherLoading] = useState(false);

  const handleAddVoucherWallet = async () => {
    setAddVoucherLoading(true);
    try {
      await addVoucherWallet(
        web3,
        rewardpoolContract,
        account,
        address,
        amount
      );
      const voucherWalletUSD = await getVoucherWalletUSDBalance(
        web3,
        rewardpoolContract,
        account
      );
      dispatch(updateState({ voucherWalletUSD }));
      setAddress("");
      setAmount("0");
    } catch (error) {
      console.log(error);
    }
    setAddVoucherLoading(false);
  };
  return (
    <Card
      className="bg-c4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 4, justifyContent: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #fff",
            marginBottom: 3,
          }}
        >
          TestVoucher
        </Typography>
        <Box>
          <Box>Voucher Balance: {Number(voucherWalletUSD).toFixed(2)}</Box>
          <Box>
            Address:{" "}
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Box>
          <Box>
            Amount:{" "}
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Box>
          <Box sx={{ my: 1, textAlign: "center" }}>
            <FireBtn
              onClick={() => handleAddVoucherWallet()}
              loading={addVoucherLoading}
            >
              Add Voucher
            </FireBtn>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default TestVoucher;
