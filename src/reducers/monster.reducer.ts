import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IMonsterState } from "../types";

let initialState: IMonsterState = {
  allMonsters: [],
  getAllMonsterLoading: false,
};

export const monsterSlice = createSlice({
  name: "monster",
  initialState,
  reducers: {
    updateMonsterState: (state: IMonsterState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IMonsterState] = action.payload[key];
      });
    },
  },
});

export const { updateMonsterState } = monsterSlice.actions;

export const monsterState = (state: RootState) => state.monster;

export default monsterSlice.reducer;
