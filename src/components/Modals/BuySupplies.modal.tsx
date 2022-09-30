import {
  Box,
  Dialog,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getAllLegionsAct } from "../../helpers/legion";
import {
  gameState,
  reloadContractStatus,
  updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import {
  addSupply,
  getBloodstoneAllowance,
  getSupplyCost,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions";
import { getLegionAddress } from "../../web3hooks/getAddress";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import Tutorial from "../Tutorial/Tutorial";
import LanguageTranslate from "../UI/LanguageTranslate";

const BuySupppliesModal: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const {
    language,
    isShowBuySuppliesModal,
    legionForSupplies,
    BLSTBalance,
    unclaimedBLST,
    reinvestedWalletBLST,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const feehandlerContract = useFeeHandler();
  const bloodstoneContract = useBloodstone();
  const legionContract = useLegion();

  // States
  const [supplyValues, setSupplyValues] = useState<Number[]>([0, 0, 0]);
  const [supplyCostLoading, setSupplyCostLoading] = useState<boolean>(false);
  const [supplyOrder, setSupplyOrder] = useState<number>(0);

  // Functions
  const getBalance = async () => {
    setSupplyCostLoading(true);
    try {
      let temp = [];
      temp.push(
        (
          await getSupplyCost(
            web3,
            feehandlerContract,
            legionForSupplies.warriorIds.length,
            7
          )
        ).blst
      );
      temp.push(
        (
          await getSupplyCost(
            web3,
            feehandlerContract,
            legionForSupplies.warriorIds.length,
            14
          )
        ).blst
      );
      temp.push(
        (
          await getSupplyCost(
            web3,
            feehandlerContract,
            legionForSupplies.warriorIds.length,
            28
          )
        ).blst
      );
      setSupplyValues(temp);
    } catch (error) {}
    setSupplyCostLoading(false);
  };

  const handleSupplyClose = () => {
    dispatch(updateState({ isShowBuySuppliesModal: false }));
  };

  const handleBuySupplies = async (fromWallet: string) => {
    dispatch(
      updateState({ buySuppliesLoading: true, isShowBuySuppliesModal: false })
    );
    try {
      let price = supplyValues[supplyOrder];
      const allowance = await getBloodstoneAllowance(
        web3,
        bloodstoneContract,
        getLegionAddress(),
        account
      );
      if (allowance < Number(price) + 100) {
        await setBloodstoneApprove(
          web3,
          bloodstoneContract,
          getLegionAddress(),
          account
        );
      }
      await addSupply(
        legionContract,
        account,
        legionForSupplies.id,
        supplyOrder == 0 ? 7 : supplyOrder == 1 ? 14 : 28,
        fromWallet
      );
      dispatch(updateState({ buySuppliesLoading: false }));
      dispatch(reloadContractStatus());
      getAllLegionsAct(dispatch, account, legionContract);
    } catch (error) {}
    dispatch(updateState({ buySuppliesLoading: false }));
  };

  // Use Effect
  useEffect(() => {
    getBalance();
  }, [legionForSupplies]);

  return (
    <Dialog onClose={handleSupplyClose} open={isShowBuySuppliesModal.valueOf()}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center" }}>
          <LanguageTranslate translateKey="buySupply" />
        </DialogTitle>
        <Box sx={{ p: 1, cursor: "pointer" }} onClick={handleSupplyClose}>
          <FaTimes />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <RadioGroup
          sx={{ margin: "0 auto" }}
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={(e) => setSupplyOrder(parseInt(e.target.value))}
          value={supplyOrder}
        >
          <FormControlLabel
            value={0}
            control={<Radio />}
            label={
              <>
                7 <LanguageTranslate translateKey="hunts" />{" "}
                {Number(supplyValues[0]).toFixed(2)}{" "}
                <LanguageTranslate translateKey="$" />
                <LanguageTranslate translateKey="blst" />
              </>
            }
          />
          <FormControlLabel
            value={1}
            control={<Radio />}
            label={
              <>
                14 <LanguageTranslate translateKey="hunts" />{" "}
                {Number(supplyValues[1]).toFixed(2)}{" "}
                <LanguageTranslate translateKey="$" />
                <LanguageTranslate translateKey="blst" />
              </>
            }
          />
          <FormControlLabel
            value={2}
            control={<Radio />}
            label={
              <>
                28 <LanguageTranslate translateKey="hunts" />{" "}
                {Number(supplyValues[2]).toFixed(2)}{" "}
                <LanguageTranslate translateKey="$" />
                <LanguageTranslate translateKey="blst" />
              </>
            }
          />
        </RadioGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          p: 1,
        }}
      >
        <FireBtn
          onClick={() => handleBuySupplies("0")}
          sx={{ marginRight: 1, fontWeight: "bold" }}
          disabled={
            Number(BLSTBalance) < Number(supplyValues[supplyOrder]) ||
            supplyCostLoading
          }
          id="add-supplies-from-wallet"
        >
          <LanguageTranslate translateKey="useMyWallet" />
        </FireBtn>
        <FireBtn
          onClick={() => handleBuySupplies("1")}
          sx={{ marginRight: 0, fontWeight: "bold" }}
          disabled={
            Number(unclaimedBLST) < Number(supplyValues[supplyOrder]) ||
            supplyCostLoading
          }
        >
          <LanguageTranslate translateKey="useUnclaimed" />
        </FireBtn>
        {/* <FireBtn
          onClick={() => handleBuySupplies("2")}
          sx={{ fontWeight: "bold" }}
          disabled={
            Number(reinvestedBLST) < Number(supplyValues[supplyOrder]) ||
            supplyCostLoading
          }
        >
          Reinvest
        </FireBtn> */}
      </Box>
      {supplyCostLoading && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            paddingLeft: 10,
            paddingRight: 10,
            display: "flex",
            alignItems: "center",
            background: "#222222ee",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ textAlign: "center", marginBottom: 1 }}>
              <LanguageTranslate translateKey="supplyCostLoading" />
            </Box>
            <LinearProgress sx={{ width: "100%" }} color="success" />
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default BuySupppliesModal;
