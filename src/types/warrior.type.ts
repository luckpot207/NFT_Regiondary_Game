export type IStrength = 1 | 2 | 3 | 4 | 5 | 6;
export interface IWarrior {
  id: String;
  type: String;
  strength: IStrength;
  attackPower: Number;
  mp4: String;
  jpg: String;
  executeStatus: boolean;
}

export interface IWarriorState {
  allWarriors: IWarrior[];
  getAllWarriorsLoading: boolean;
  executeWarriorsLoading: boolean;

  mintWarriorPending: boolean;
  mintWarriorVRFPending: boolean;
  initialMintWarriorLoading: boolean;
  revealWarriorLoading: boolean;
}
