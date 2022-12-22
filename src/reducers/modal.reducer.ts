import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IModalState } from "../types";
import { addContactInfo, editContactInfo } from "./common.reduer";

let initialState: IModalState = {
  buySuppliesModalOpen: false,
  listOnMarketplaceModalOpen: false,
  updatePriceModalOpen: false,
  claimAndReinvestModalOpen: false,
  walletSelectModalOpen: false,
  referralTGModalOpen: false,
  voteModalOpen: false,
  reincarnationModalOpen: false,
  claimedBUSDAlertAmountModalOpen: false,
  claimedBUSDAlertModalOpen: false,
  claimToWalletModalOpen: false,
  createDuelModalOpen: false,
  joinDuelModalOpen: false,
  updatePredictionModalOpen: false,
  reinvestPercentCalculatorModalOpen: true,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    updateModalState: (state: IModalState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IModalState] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(addContactInfo.fulfilled),
      (state: IModalState) => {
        state.referralTGModalOpen = false;
      }
    );
    builder.addMatcher(
      isAnyOf(editContactInfo.fulfilled),
      (state: IModalState) => {
        state.referralTGModalOpen = false;
      }
    );
  },
});

export const { updateModalState } = modalSlice.actions;

export const modalState = (state: RootState) => state.modal;

export default modalSlice.reducer;
