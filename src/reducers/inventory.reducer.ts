import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IInventory } from "../types";
import ApiService from "../services/api.service";
import { toast } from "react-toastify";

let initialState: IInventory = {
  BLSTBalance: 0,
  beastBalance: 0,
  warriorBalance: 0,
  legionBalance: 0,
  availableLegionsCount: 0,
  unclaimedUSD: 0,
  unclaimedBLST: 0,
  claimedUSD: 0,
  claimedBLST: 0,
  taxLeftDaysForClaim: 0,
  taxLeftDaysForReinvest: 0,
  maxAttackPower: 0,
  USDToBLST: 0,
  BLSTToUSD: 0,
  BUSDForTotalBLST: 0,
  claimedBUSDAlertAmount: 0,
  claimMinTaxPercent: 0,
  reinvestedWalletUSD: 0,
  reinvestedWalletBLST: 0,
  reinvestedTotalUSD: 0,
  additionalInvestment: 0,
  startupInvestment: 0,
  totalClaimedUSD: 0,
  currentReinvestPercent: 0,
  currentSamaritanStars: 0,
  currentTaxCycleStars: 0,
  futureReinvestPercentWhenClaim: 0,
  futureReinvestPercentWhenReinvest: 0,
  futureSamaritanStarsWhenClaim: 0,
  futureSamaritanStarsWhenReinvest: 0,
  remainUnclaimedUSDWhenClaim: 0,
  remainUnclaimedUSDWhenReinvest: 0,
  claimingUSDWithoutTax: 0,
  reinvestingUSDWithoutTax: 0,
  daysLeftUntilAbove3Stars: 0,
  voucherWalletUSD: 0,
};

export const getClaimedBUSDAlertAmount = createAsyncThunk(
  "unclaimedBUSD/getClaimedBUSDAlertAmount",
  async ({ address }: { address: string }) => {
    const { data } = await ApiService.getClaimedBUSDAlertAmount(address);
    return data;
  }
);

export const setClaimedBUSDAlertAmount = createAsyncThunk(
  "unclaimedBUSD/setClaimedBUSDAlertAmount",
  async ({ address, amount }: { address: string; amount: number }) => {
    const { data } = await ApiService.setClaimedBUSDAlertAmount(
      address,
      amount
    );
    return data;
  }
);

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    updateInventoryState: (state: IInventory, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IInventory] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClaimedBUSDAlertAmount.pending, (state) => {});
    builder.addCase(
      getClaimedBUSDAlertAmount.fulfilled,
      (state, { payload }) => {
        if (payload.success) {
          state.claimedBUSDAlertAmount = payload.amount.amount;
        } else {
          state.claimedBUSDAlertAmount = 0;
        }
      }
    );
    builder.addCase(getClaimedBUSDAlertAmount.rejected, (state) => {});

    builder.addCase(setClaimedBUSDAlertAmount.pending, (state) => {});
    builder.addCase(
      setClaimedBUSDAlertAmount.fulfilled,
      (state, { payload }) => {
        state.claimedBUSDAlertAmount = payload.amount;
        toast.success("Set alert amount successfully");
      }
    );
    builder.addCase(setClaimedBUSDAlertAmount.rejected, (state) => {});
  },
});

export const { updateInventoryState } = inventorySlice.actions;

export const inventoryState = (state: RootState) => state.inventory;

export default inventorySlice.reducer;
