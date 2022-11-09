import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IReferralState } from "../types";

let initialState: IReferralState = {
  referralStatsLoading: false,
  referralStats: {
    referrals: [],
    layer1Comission: 0,
    layer2Comission: 0,
    layer1Count: 0,
    layer2Count: 0,
  },
  hasFreeMint: false,
};

export const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    updateReferralState: (
      state: IReferralState,
      action: PayloadAction<any>
    ) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IReferralState] = action.payload[key];
      });
    },
  },
});

export const { updateReferralState } = referralSlice.actions;

export const referralState = (state: RootState) => state.referral;

export default referralSlice.reducer;
