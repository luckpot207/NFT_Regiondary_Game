import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IWarrior, IWarriorState } from "../types";
import {
  createLegionBoxIn,
  createLegionBoxOut,
  updateLegionBoxIn,
  updateLegionBoxOut,
} from "./legion.reducer";
import gameConfig from "../config/game.config";

let initialState: IWarriorState = {
  allWarriors: [],
  getAllWarriorsLoading: false,
  executeWarriorsLoading: false,

  mintWarriorPending: false,
  mintWarriorVRFPending: false,
  initialMintWarriorLoading: false,
  revealWarriorLoading: false,
};

export const warriorSlice = createSlice({
  name: "warrior",
  initialState,
  reducers: {
    updateWarriorState: (state: IWarriorState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IWarriorState] = action.payload[key];
      });
    },
    changeAllWarriorExecuteStatus: (state, action: PayloadAction<any>) => {
      const { status, ids } = action.payload;
      let temp: IWarrior[] = [];
      state.allWarriors.forEach((item) => {
        if (ids.find((id: String) => item.id === id)) {
          temp.push({ ...item, executeStatus: status });
        } else {
          temp.push({ ...item, executeStatus: false });
        }
      });
      state.allWarriors = temp;
    },
    changeWarriorExecuteStatus: (state, action: PayloadAction<any>) => {
      let id = action.payload;
      let temp = state.allWarriors.map((warrior) => {
        if (warrior.id === id) {
          return {
            ...warrior,
            executeStatus: !warrior.executeStatus,
          };
        }
        return warrior;
      });
      state.allWarriors = temp;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(createLegionBoxIn, updateLegionBoxIn),
      (state: IWarriorState, action: PayloadAction<any>) => {
        let { type, item } = action.payload;
        if (type === gameConfig.nftItemType.warrior) {
          let tempWarriors = state.allWarriors.filter(
            (warrior: IWarrior) => warrior.id !== item.id
          );
          state.allWarriors = tempWarriors;
        }
      }
    );
    builder.addMatcher(
      isAnyOf(createLegionBoxOut, updateLegionBoxOut),
      (state: IWarriorState, action: PayloadAction<any>) => {
        let { type, item } = action.payload;
        if (type === gameConfig.nftItemType.warrior) {
          let tempWarriors = [...state.allWarriors, item];
          state.allWarriors = tempWarriors;
        }
      }
    );
  },
});

export const {
  updateWarriorState,
  changeAllWarriorExecuteStatus,
  changeWarriorExecuteStatus,
} = warriorSlice.actions;

export const warriorState = (state: RootState) => state.warrior;

export default warriorSlice.reducer;
