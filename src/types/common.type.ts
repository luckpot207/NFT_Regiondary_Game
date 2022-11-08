export interface IContact {
  _id?: string;
  wallet: string;
  firstTG: string;
  lastTG: string;
}

export interface IPresentITem {
  _id?: string;
  jpg: string;
  mp4: string;
  diedjpg: string;
  diedmp4: string;
  show: boolean;
}

export interface ICommonState {
  reloadStatusTime: Number;
  isSideBarOpen: boolean;
  language: String;
  showAnimation: boolean;
  showVoucherWalletBtn: boolean;

  summonWarriorAnchorEl: any;
  summonBeastAnchorEl: any;

  summonReductionPer: {
    p1: Number;
    p10: Number;
    p50: Number;
    p100: Number;
    p150: Number;
  };
  summonPrice: {
    p1: { usd: Number; blst: Number };
    p10: { usd: Number; blst: Number };
    p50: { usd: Number; blst: Number };
    p100: { usd: Number; blst: Number };
    p150: { usd: Number; blst: Number };
  };

  presentItem: IPresentITem;
  contactInfo: IContact | null;
  initialDataLoading: boolean;
  addContactLoading: boolean;
  editContactLoading: boolean;

  marketplaceTax: Number;
  huntTax: Number;
  damageReduction: Number;
  summonFee: Number;
  suppliesFee14: Number;
  suppliesFee28: Number;
  buyTax: Number;
  sellTax: Number;
}
