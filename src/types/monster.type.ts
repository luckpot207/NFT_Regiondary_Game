export type IMonsterId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25;
export interface IMonster {
  id: IMonsterId;
  name: String;
  attackPower: Number;
  BUSDReward: Number;
  BLSTReward: Number;
  percent: Number;
}

export interface IMonsterState {
  allMonsters: IMonster[];
  getAllMonsterLoading: boolean;
}
