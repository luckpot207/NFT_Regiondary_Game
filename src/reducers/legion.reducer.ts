import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ILegion, ILegionState } from "../types";

let initialState: ILegionState = {
  massHuntResult: [],
  allLegions: [],
  getAllLegionsLoading: false,
  executeLegionsLoading: false,
  isApprovedBeastForLegion: false,
  isApprovedWarriorForLegion: false,
  createLegionBox: [],
  createLegionLoading: false,

  legionForUpdate: {
    id: "",
    name: "",
    beastIds: [],
    warriorIds: [],
    attackPower: 0,
    supplies: 0,
    huntStatus: false,
    jpg: "",
    mp4: "",
    executeStatus: false,
  },
  updateLegionBox: [],
  updateLegionLoading: false,

  legionForSupplies: {
    id: "",
    name: "",
    beastIds: [],
    warriorIds: [],
    attackPower: 0,
    supplies: 0,
    huntStatus: false,
    jpg: "",
    mp4: "",
    executeStatus: false,
  },
  buySuppliesLoading: false,

  huntPending: false,
  huntVRFPending: false,
  initialHuntLoading: false,
  revealHuntLoading: false,

  massHuntPending: false,
  massHuntVRFPending: false,
  initialMassHuntLoading: false,
  revealMassHuntLoading: false,

  huntingLegionId: 0,
  huntingMonsterId: 1,
  huntingSuccessPercent: 0,
};

export const legionSlice = createSlice({
  name: "legion",
  initialState,
  reducers: {
    updateLegionState: (state: ILegionState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof ILegionState] = action.payload[key];
      });
    },
    initMassHuntResult: (state) => {
      state.massHuntResult = [];
    },
    setMassHuntResult: (state, action: PayloadAction<any>) => {
      state.massHuntResult = [...state.massHuntResult, action.payload];
    },
    changeAllLegionExecuteStatus: (state, action: PayloadAction<any>) => {
      const { status, ids } = action.payload;
      let temp: ILegion[] = [];
      state.allLegions.forEach((item) => {
        if (ids.find((id: String) => id === item.id)) {
          temp.push({ ...item, executeStatus: status });
        } else {
          temp.push({ ...item, executeStatus: false });
        }
      });
      state.allLegions = temp;
    },
    changeLegionExecuteStatus: (state, action: PayloadAction<any>) => {
      let id = action.payload;
      let temp = state.allLegions.map((legion) => {
        if (legion.id === id) {
          return {
            ...legion,
            executeStatus: !legion.executeStatus,
          };
        }
        return legion;
      });
      state.allLegions = temp;
    },
    createLegionBoxIn: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let temp = [
        ...state.createLegionBox,
        {
          type,
          item,
        },
      ];
      state.createLegionBox = temp;
    },
    createLegionBoxOut: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let tempBox = state.createLegionBox.filter((boxItem) => {
        if (boxItem.type === type && boxItem.item.id === item.id) {
          return false;
        }
        return true;
      });
      state.createLegionBox = tempBox;
    },
    updateLegionBoxIn: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let temp = [
        ...state.updateLegionBox,
        {
          type,
          item,
        },
      ];
      state.updateLegionBox = temp;
    },
    updateLegionBoxOut: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let tempBox = state.updateLegionBox.filter((boxItem) => {
        if (boxItem.type === type && boxItem.item.id === item.id) {
          return false;
        }
        return true;
      });
      state.updateLegionBox = tempBox;
    },
  },
});

export const {
  updateLegionState,
  initMassHuntResult,
  setMassHuntResult,
  changeAllLegionExecuteStatus,
  changeLegionExecuteStatus,
  createLegionBoxIn,
  createLegionBoxOut,
  updateLegionBoxIn,
  updateLegionBoxOut,
} = legionSlice.actions;

export const legionState = (state: RootState) => state.legion;

export default legionSlice.reducer;
