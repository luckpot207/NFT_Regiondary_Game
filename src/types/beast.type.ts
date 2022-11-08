export type ICapacity = 1 | 2 | 3 | 4 | 5 | 20;
export interface IBeast {
  id: String;
  type: String;
  capacity: ICapacity;
  mp4: String;
  jpg: String;
  executeStatus: boolean;
}

export interface IBeastState {
  allBeasts: IBeast[];
  getAllBeastsLoading: boolean;
  executeBeastsLoading: boolean;

  mintBeastPending: boolean;
  mintBeastVRFPending: boolean;
  initialMintBeastLoading: boolean;
  revealBeastLoading: boolean;
}
