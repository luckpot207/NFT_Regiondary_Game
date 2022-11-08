import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IBeast, IBeastState } from "../types";
import {
  createLegionBoxIn,
  createLegionBoxOut,
  updateLegionBoxIn,
  updateLegionBoxOut,
} from "./legion.reducer";
import gameConfig from "../config/game.config";

let initialState: IBeastState = {
  allBeasts: [],
  getAllBeastsLoading: false,
  executeBeastsLoading: false,
  mintBeastPending: false,
  mintBeastVRFPending: false,
  initialMintBeastLoading: false,
  revealBeastLoading: false,
};

export const beastSlice = createSlice({
  name: "beast",
  initialState,
  reducers: {
    updateBeastState: (state: IBeastState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IBeastState] = action.payload[key];
      });
    },
    changeBeastExecuteStatus: (state, action: PayloadAction<any>) => {
      let id = action.payload;
      let temp = state.allBeasts.map((beast) => {
        if (beast.id === id) {
          return {
            ...beast,
            executeStatus: !beast.executeStatus,
          };
        }
        return beast;
      });
      state.allBeasts = temp;
    },
    changeAllBeastExecuteStatus: (state, action: PayloadAction<any>) => {
      const { status, ids } = action.payload;
      let temp: IBeast[] = [];
      state.allBeasts.forEach((item) => {
        if (ids.find((id: String) => item.id === id)) {
          temp.push({ ...item, executeStatus: status });
        } else {
          temp.push({ ...item, executeStatus: false });
        }
      });
      state.allBeasts = temp;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(createLegionBoxIn, updateLegionBoxIn),
      (state: IBeastState, action: PayloadAction<any>) => {
        let { type, item } = action.payload;
        if (type === gameConfig.nftItemType.beast) {
          let tempBeasts = state.allBeasts.filter(
            (beast: IBeast) => beast.id !== item.id
          );
          state.allBeasts = tempBeasts;
        }
      }
    );
    builder.addMatcher(
      isAnyOf(createLegionBoxOut, updateLegionBoxOut),
      (state: IBeastState, action: PayloadAction<any>) => {
        let { type, item } = action.payload;
        if (type === gameConfig.nftItemType.beast) {
          let tempBeasts = [...state.allBeasts, item];
          state.allBeasts = tempBeasts;
        }
      }
    );
  },
});

export const {
  updateBeastState,
  changeBeastExecuteStatus,
  changeAllBeastExecuteStatus,
} = beastSlice.actions;

export const beastState = (state: RootState) => state.beast;

export default beastSlice.reducer;
