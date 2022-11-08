import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IDuel, IDivision, IDuelState } from "../types";

let divisions: IDivision[] = [
  {
    minAP: 10000,
    maxAP: 13000,
    betPrice: 40,
  },
  {
    minAP: 13000,
    maxAP: 16000,
    betPrice: 60,
  },
  {
    minAP: 16000,
    maxAP: 20000,
    betPrice: 70,
  },
  {
    minAP: 20000,
    maxAP: 25000,
    betPrice: 100,
  },
  {
    minAP: 25000,
    maxAP: 30000,
    betPrice: 140,
  },
  {
    minAP: 30000,
    maxAP: 37000,
    betPrice: 190,
  },
  {
    minAP: 37000,
    maxAP: 45000,
    betPrice: 250,
  },
  {
    minAP: 45000,
    maxAP: 55000,
    betPrice: 400,
  },
  {
    minAP: 55000,
    maxAP: 70000,
    betPrice: 500,
  },
];

let initialState: IDuelState = {
  duelStatus: 1,
  allDuels: [],
  getAllDulesLoading: false,
  currentDuelId: "",
  endDateJoinDuel: "",
  divisions: divisions,
  cancelDuelLoading: false,
};

export const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    updateDuelState: (state: IDuelState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IDuelState] = action.payload[key];
      });
    },
    extraReducers: (builder) => {},
  },
});

export const { updateDuelState } = duelSlice.actions;

export const duelState = (state: RootState) => state.duel;

export default duelSlice.reducer;
