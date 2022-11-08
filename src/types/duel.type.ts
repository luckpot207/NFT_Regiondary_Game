import { ILegion } from "./legion.type";

export interface IDuel {
  duelId: String;
  isMine: boolean;
  creatorLegion: ILegion;
  creatorEstmatePrice: Number;
  joinerLegion: ILegion;
  joinerEstmatePrice: Number;
  type: Number;
  status: Number;
  endDateTime: String;
  betPrice: Number;
  result: Number;
}

export interface IDivision {
  minAP: Number;
  maxAP: Number;
  betPrice: Number;
}

export interface IDuelState {
  duelStatus: Number;
  allDuels: IDuel[];
  getAllDulesLoading: boolean;
  currentDuelId: String;
  endDateJoinDuel: String;
  divisions: IDivision[];
  cancelDuelLoading: boolean;
}
