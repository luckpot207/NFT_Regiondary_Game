import { IWarrior, IBeast } from "./";

export interface ILegion {
  id: String;
  name: String;
  beastIds: Number[];
  warriorIds: Number[];
  attackPower: Number;
  supplies: Number;
  huntStatus: boolean;
  jpg: String;
  mp4: String;
  executeStatus: boolean;
}

export interface ILegionBox {
  type: Number;
  item: IBeast | IWarrior;
}

export interface ILegionState {
  massHuntResult: any[];
  allLegions: ILegion[];
  getAllLegionsLoading: boolean;
  executeLegionsLoading: boolean;
  isApprovedBeastForLegion: boolean;
  isApprovedWarriorForLegion: boolean;
  createLegionBox: ILegionBox[];
  createLegionLoading: boolean;

  legionForUpdate: ILegion;
  updateLegionBox: ILegionBox[];
  updateLegionLoading: boolean;

  legionForSupplies: ILegion;
  buySuppliesLoading: boolean;

  huntPending: boolean;
  huntVRFPending: boolean;
  initialHuntLoading: boolean;
  revealHuntLoading: boolean;

  massHuntPending: boolean;
  massHuntVRFPending: boolean;
  initialMassHuntLoading: boolean;
  revealMassHuntLoading: boolean;

  huntingMonsterId: Number;
  huntingLegionId: Number;
  huntingSuccessPercent: Number;
}
