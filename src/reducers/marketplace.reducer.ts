import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IMarketplaceState } from "../types";

let initialState: IMarketplaceState = {
  listingPrice: 0,
  listingType: 0,
  listingId: "0",
  listingLoading: false,
  listingAttackPower: 0,

  allBeastsMarketItems: [],
  getAllBeastsMarketItemsLoading: false,

  allWarriorsMarketItems: [],
  getAllWarriorsMarketItemsLoading: false,

  allLegionsMarketItems: [],
  getAllLegionsMarketItemsLoading: false,

  updatePriceLoading: false,
  buyItemLoading: false,
  cancelItemLoading: false,
};

export const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    updateMarketplaceState: (
      state: IMarketplaceState,
      action: PayloadAction<any>
    ) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IMarketplaceState] = action.payload[key];
      });
    },
  },
});

export const { updateMarketplaceState } = marketplaceSlice.actions;

export const marketplaceState = (state: RootState) => state.marketplace;

export default marketplaceSlice.reducer;
