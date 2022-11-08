import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ICommonState } from "../types";
import ApiService from "../services/api.service";
import { toast } from "react-toastify";

let initialState: ICommonState = {
  reloadStatusTime: new Date().getTime(),
  isSideBarOpen: false,
  language: localStorage.getItem("lang")
    ? localStorage.getItem("lang") + ""
    : "en",
  showAnimation: localStorage.getItem("showAnimation") === "1" ? true : false,
  showVoucherWalletBtn: true,

  summonWarriorAnchorEl: null,
  summonBeastAnchorEl: null,

  summonReductionPer: {
    p1: 0,
    p10: -1,
    p50: -2,
    p100: -3,
    p150: -5,
  },
  summonPrice: {
    p1: { usd: 0, blst: 0 },
    p10: { usd: 0, blst: 0 },
    p50: { usd: 0, blst: 0 },
    p100: { usd: 0, blst: 0 },
    p150: { usd: 0, blst: 0 },
  },

  presentItem: {
    jpg: "",
    mp4: "",
    diedjpg: "",
    diedmp4: "",
    show: true,
  },
  contactInfo: null,
  initialDataLoading: false,
  addContactLoading: false,
  editContactLoading: false,

  marketplaceTax: 0,
  huntTax: 0,
  damageReduction: 0,
  summonFee: 0,
  suppliesFee14: 0,
  suppliesFee28: 0,
  buyTax: 0,
  sellTax: 0,
};

export const getContactInfo = createAsyncThunk(
  "contact/getContactInfo",
  async (wallet: string | undefined) => {
    const { data } = await ApiService.getContactInfo(wallet);
    return data;
  }
);

export const addContactInfo = createAsyncThunk(
  "contact/addContactInfo",
  async ({ wallet, tgname }: { wallet: string; tgname: string }) => {
    const { data } = await ApiService.addContactInfo(wallet, tgname);
    return data;
  }
);

export const editContactInfo = createAsyncThunk(
  "contact/editContactInfo",
  async ({ wallet, tgname }: { wallet: string; tgname: string }) => {
    const { data } = await ApiService.editContactInfo(wallet, tgname);
    return data;
  }
);

export const getPresentItem = createAsyncThunk(
  "presentitem/getPresentItem",
  async () => {
    const { data } = await ApiService.getPresentItem();
    return data;
  }
);

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    updateCommonState: (state: ICommonState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof ICommonState] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContactInfo.fulfilled, (state, { payload }) => {
      state.contactInfo = payload.data;
    });
    builder.addCase(getPresentItem.fulfilled, (state, { payload }) => {
      state.presentItem = payload.data;
    });

    builder.addCase(addContactInfo.pending, (state) => {
      state.addContactLoading = true;
    });
    builder.addCase(addContactInfo.fulfilled, (state, { payload }) => {
      state.addContactLoading = false;
      if (payload.success) {
        toast.success("Telegram name is added");
      } else {
        toast.error(payload.msg);
      }
    });
    builder.addCase(addContactInfo.rejected, (state) => {
      state.addContactLoading = false;
    });

    builder.addCase(editContactInfo.pending, (state) => {
      state.editContactLoading = true;
    });
    builder.addCase(editContactInfo.fulfilled, (state, { payload }) => {
      state.editContactLoading = false;
      if (payload.success) {
        toast.success("Telegram name is updated");
      } else {
        toast.error(payload.msg);
      }
    });
    builder.addCase(editContactInfo.rejected, (state) => {
      state.editContactLoading = false;
    });
  },
});

export const { updateCommonState } = commonSlice.actions;

export const commonState = (state: RootState) => state.common;

export default commonSlice.reducer;
