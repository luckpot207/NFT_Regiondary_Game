import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IFilterAndPageState } from "../types";
import constants from "../constants";

const {
  currentPage,
  pageSize,
  warriorFilterLevel,
  beastFilterCapacity,
  warriorFilterMinAP,
  warriorFilterMaxAP,
  warriorFilterMinConstAP,
  warriorFilterMaxConstAP,
  legionFilterMinAP,
  legionFilterMaxAP,
  legionFilterMinConstAP,
  legionFilterMaxConstAP,
  sortAP,
  sortPrice,
  sortAPandPrice,
  showOnlyMine,
  showOnlyNew,
  hideWeakLegion,
  legionFilterHuntStatus,
  legionFilterMinSupplies,
  legionFilterMaxSupplies,
  legionFilterMinConstSupplies,
  legionFilterMaxConstSupplies,
  duelStatus,
  duelLegionFilterMinConstAP,
  duelLegionFilterMaxConstAP,
  duelLegionFilterMinAP,
  duelLegionFilterMaxAP,
  duelJoinLeftMaxTime,
  duelJoinLeftMinTime,
  duelJoinLeftMaxConstTime,
  duelJoinLeftMinConstTime,
  duelLeftMaxTime,
  duelLeftMinTime,
  duelLeftMaxConstTime,
  duelLeftMinConstTime,
  duelResultFilterStart,
  duelResultFilterEnd,
  duelResultFilterStartConst,
  duelResultFilterEndConst,
  duelShowOnlyMine,
  duelType,
} = constants.filterAndPage;

let initialState: IFilterAndPageState = {
  currentPage: currentPage,
  pageSize: pageSize,
  warriorFilterLevel: warriorFilterLevel,
  beastFilterCapacity: beastFilterCapacity,
  warriorFilterMinAP: warriorFilterMinAP,
  warriorFilterMaxAP: warriorFilterMaxAP,
  warriorFilterMinConstAP: warriorFilterMinConstAP,
  warriorFilterMaxConstAP: warriorFilterMaxConstAP,
  legionFilterMinAP: legionFilterMinAP,
  legionFilterMaxAP: legionFilterMaxAP,
  legionFilterMinConstAP: legionFilterMinConstAP,
  legionFilterMaxConstAP: legionFilterMaxConstAP,

  sortAP: sortAP,
  sortPrice: sortPrice,
  sortAPandPrice: sortAPandPrice,
  showOnlyNew: showOnlyNew,
  showOnlyMine: showOnlyMine,
  hideWeakLegion: hideWeakLegion,
  legionFilterHuntStatus: legionFilterHuntStatus,
  legionFilterMinSupplies: legionFilterMinSupplies,
  legionFilterMaxSupplies: legionFilterMaxSupplies,
  legionFilterMinConstSupplies: legionFilterMinConstSupplies,
  legionFilterMaxConstSupplies: legionFilterMaxConstSupplies,

  duelStatus: duelStatus,
  duelLegionFilterMinAP: duelLegionFilterMinConstAP,
  duelLegionFilterMaxAP: duelLegionFilterMaxConstAP,
  duelLegionFilterMinConstAP: duelLegionFilterMinAP,
  duelLegionFilterMaxConstAP: duelLegionFilterMaxAP,
  duelJoinLeftMaxTime: duelJoinLeftMaxTime,
  duelJoinLeftMinTime: duelJoinLeftMinTime,
  duelJoinLeftMaxConstTime: duelJoinLeftMaxConstTime,
  duelJoinLeftMinConstTime: duelJoinLeftMinConstTime,
  duelLeftMaxTime: duelLeftMaxTime,
  duelLeftMinTime: duelLeftMinTime,
  duelLeftMaxConstTime: duelLeftMaxConstTime,
  duelLeftMinConstTime: duelLeftMinConstTime,
  duelResultFilterStart: duelResultFilterStart,
  duelResultFilterEnd: duelResultFilterEnd,
  duelResultFilterStartConst: duelResultFilterStartConst,
  duelResultFilterEndConst: duelResultFilterEndConst,
  duelShowOnlyMine: duelShowOnlyMine,
  duelType: duelType,
};

export const filterAndPageSlice = createSlice({
  name: "filterAndPage",
  initialState,
  reducers: {
    updateFilterAndPageState: (
      state: IFilterAndPageState,
      action: PayloadAction<any>
    ) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IFilterAndPageState] = action.payload[key];
      });
    },
  },
});

export const { updateFilterAndPageState } = filterAndPageSlice.actions;

export const filterAndPageState = (state: RootState) => state.filterAndPage;

export default filterAndPageSlice.reducer;
