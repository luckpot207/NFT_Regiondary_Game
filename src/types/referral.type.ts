export interface IReferralStats {
  referrals: any;
  layer1Comission: Number;
  layer2Comission: Number;
  layer1Count: Number;
  layer2Count: Number;
}

export interface ICommission {
  from: String;
  layer: Number;
  mintAmount: Number;
  usdAmount: Number;
  timestamp: Number;
}

export interface IReferral {
  addr: String;
  timestamp: Number;
  availableUntil: Number;
}

export interface IReferralState {
  referralStatsLoading: boolean;
  referralStats: IReferralStats;
  hasFreeMint: boolean;
}
