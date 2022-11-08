import React, { useEffect, useState } from "react";
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
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { AppSelector } from "../../store";
import { getLegionAddress } from "../../web3hooks/getAddress";
import {
  useBloodstone,
  useFeeHandler,
  useLegion,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { inventoryState } from "../../reducers/inventory.reducer";
import { updateCommonState } from "../../reducers/common.reduer";
import { legionState, updateLegionState } from "../../reducers/legion.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { getSupplyCost } from "../../web3hooks/contractFunctions/feehandler.contract";
import LegionService from "../../services/legion.service";
import { addSupply } from "../../web3hooks/contractFunctions/legion.contract";
import {
  getBloodstoneAllowance,
  setBloodstoneApprove,
} from "../../web3hooks/contractFunctions/common.contract";
import { getTranslation } from "../../utils/utils";

const BuySupppliesModal: React.FC = () => {
  // Hook info
  const dispatch = useDispatch();
  const { BLSTBalance, unclaimedBLST } = AppSelector(inventoryState);
  const { legionForSupplies } = AppSelector(legionState);
  const { buySuppliesModalOpen } = AppSelector(modalState);
  const unclaimedBLSTFromWei = Number(unclaimedBLST) / 10 ** 18;

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

  useEffect(() => {
    getBalance();
  }, [legionForSupplies]);

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
    dispatch(updateModalState({ buySuppliesModalOpen: false }));
  };

  const handleBuySupplies = async (fromWallet: string) => {
    dispatch(updateModalState({ buySuppliesModalOpen: false }));
    dispatch(updateLegionState({ buySuppliesLoading: true }));
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
      dispatch(updateLegionState({ buySuppliesLoading: false }));
      dispatch(updateCommonState({ reloadStatusTime: new Date().getTime() }));
      LegionService.getAllLegionsAct(dispatch, account, legionContract);
    } catch (error) {}
    dispatch(updateLegionState({ buySuppliesLoading: false }));
  };

  return (
    <Dialog onClose={handleSupplyClose} open={buySuppliesModalOpen}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("buySupply")}
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
            label={`7 ${getTranslation("hunts")} ${Number(
              supplyValues[0]
            ).toFixed(2)} ${getTranslation("$")}${getTranslation("blst")}`}
          />
          <FormControlLabel
            value={1}
            control={<Radio />}
            label={`14 ${getTranslation("hunts")} ${Number(
              supplyValues[1]
            ).toFixed(2)} ${getTranslation("$")}${getTranslation("blst")}`}
          />
          <FormControlLabel
            value={2}
            control={<Radio />}
            label={`28 ${getTranslation("hunts")} ${Number(
              supplyValues[2]
            ).toFixed(2)} ${getTranslation("$")}${getTranslation("blst")}`}
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
          {getTranslation("useMyWallet")}
        </FireBtn>
        <FireBtn
          onClick={() => handleBuySupplies("1")}
          sx={{ marginRight: 0, fontWeight: "bold" }}
          disabled={
            Number(unclaimedBLSTFromWei) < Number(supplyValues[supplyOrder]) ||
            supplyCostLoading
          }
        >
          {getTranslation("useUnclaimed")}
        </FireBtn>
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
              {getTranslation("supplyCostLoading")}
            </Box>
            <LinearProgress sx={{ width: "100%" }} color="success" />
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default BuySupppliesModal;
