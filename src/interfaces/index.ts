export interface I_Monster {
  id: Number;
  name: String;
  attackPower: Number;
  BUSDReward: Number;
  BLSTReward: Number;
  percent: Number;
}

export interface I_Beast {
  id: String;
  type: String;
  capacity: Number;
  mp4: String;
  jpg: String;
  executeStatus: boolean;
}

export interface I_Warrior {
  id: String;
  type: String;
  strength: Number;
  attackPower: Number;
  mp4: String;
  jpg: String;
  executeStatus: boolean;
}

export interface I_Legion {
  id: String;
  name: String;
  beastIds: Number[];
  warriorIds: Number[];
  attackPower: Number;
  supplies: Number;
  huntStatus: Boolean;
  duelStatus: Boolean;
  jpg: String;
  mp4: String;
  executeStatus: boolean;
}

export interface I_LegionBox {
  type: Number;
  item: I_Beast | I_Warrior;
}

export interface I_Beast_Market {
  id: String;
  type: String;
  capacity: Number;
  mp4: String;
  jpg: String;
  seller: String;
  price: Number;
  listingTime: Number;
  newItem: Boolean;
}

export interface I_Warrior_Market {
  id: String;
  type: String;
  strength: Number;
  attackPower: Number;
  mp4: String;
  jpg: String;
  seller: String;
  price: Number;
  listingTime: Number;
  newItem: Boolean;
}

export interface I_Legion_Market {
  id: String;
  name: String;
  beastIds: Number[];
  warriorIds: Number[];
  attackPower: Number;
  supplies: Number;
  huntStatus: Boolean;
  jpg: String;
  mp4: String;
  seller: String;
  price: Number;
  listingTime: Number;
  newItem: Boolean;
}

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

export interface IContact {
  _id?: string;
  wallet: string;
  firstTG: string;
  lastTG: string;
}
export interface IItemname {
  _id?: string;
  number: number;
  name: string;
  type: string;
}

export interface IPresentITem {
  _id?: string;
  jpg: string;
  mp4: string;
  diedjpg: string;
  diedmp4: string;
  show: boolean;
}

// Vote
export interface IVoteInput {
  address: String;
  vote: Boolean;
}

export interface IVoteStatus {
  goodCnt: Number;
  badCnt: Number;
}

export interface ISamaritanStarHolder {
  _id?: String;
  address: String;
}

// Duel

export interface I_Duel {
  creatorAddress: String;
  creatorLegion: I_Legion;
  creatorEstmatePrice: Number;
  joinerAddress: String;
  joinerLegion: I_Legion;
  joinerEstmatePrice: Number;
  type: Boolean;
  status: Number;
  endDateTime: String;
  betPrice: Number;
  result: Number;
}

export interface I_Division {
  minAP: Number,
  maxAP: Number,
  betPrice: Number,
}

export interface I_ReduxState {
  reloadContractStatus: Number;
  massHuntResult: any[];
  tutorialStep: Number[];
  tutorialForPopover: Boolean;
  stepInfo: any;
  tutorialOn: Boolean;
  isSideBarOpen: Boolean;
  claimInfo: {
    BLSTReward: Number;
    BUSDReward: Number;
  };
  tutorialRestartStep: Number;
  language: string;
  showAnimation: Boolean;

  // game info
  /// beasts
  allBeasts: I_Beast[];
  getAllBeastsLoading: Boolean;
  executeBeastsLoading: Boolean;

  /// warriors
  allWarriors: I_Warrior[];
  getAllWarriorsLoading: Boolean;
  executeWarriorsLoading: Boolean;

  /// legions
  allLegions: I_Legion[];
  getAllLegionsLoading: Boolean;
  executeLegionsLoading: Boolean;
  isApprovedBeastForLegion: Boolean;
  isApprovedWarriorForLegion: Boolean;
  createLegionBox: I_LegionBox[];
  createLegionLoading: Boolean;

  legionForUpdate: I_Legion;
  updateLegionBox: I_LegionBox[];
  updateLegionLoading: Boolean;

  legionForSupplies: I_Legion;
  buySuppliesLoading: Boolean;

  // Monsters
  allMonsters: I_Monster[];
  getAllMonsterLoading: Boolean;

  // Marketplace
  listingPrice: Number;
  listingType: Number;
  listingId: String;
  listingLoading: Boolean;

  allBeastsMarketItems: I_Beast_Market[];
  getAllBeastsMarketItemsLoading: Boolean;

  allWarriorsMarketItems: I_Warrior_Market[];
  getAllWarriorsMarketItemsLoading: Boolean;

  allLegionsMarketItems: I_Legion_Market[];
  getAllLegionsMarketItemsLoading: Boolean;

  updatePriceLoading: Boolean;
  cancelItemLoading: Boolean;
  buyItemLoading: Boolean;

  //// Your Inventory
  BLSTBalance: Number;
  beastBalance: Number;
  warriorBalance: Number;
  legionBalance: Number;
  availableLegionsCount: Number;
  unclaimedUSD: Number;
  unclaimedBLST: Number;
  taxLeftDaysForClaim: Number;
  taxLeftDaysForReinvest: Number;
  maxAttackPower: Number;
  USDToBLST: Number;
  BLSTToUSD: Number;
  BUSDForTotalBLST: Number;
  inventoryLoading: Boolean;
  // reinvest
  claimMinTaxPercent: Number;
  reinvestedWalletUSD: Number;
  reinvestedWalletBLST: Number;
  reinvestedTotalUSD: Number;
  additionalInvestment: Number;
  startupInvestment: Number;
  totalClaimedUSD: Number;

  currentReinvestPercent: Number;
  currentSamaritanStars: Number;

  futureReinvestPercentWhenClaim: Number;
  futureReinvestPercentWhenReinvest: Number;
  futureSamaritanStarsWhenClaim: Number;
  futureSamaritanStarsWhenReinvest: Number;
  remainUnclaimedUSDWhenClaim: Number;
  remainUnclaimedUSDWhenReinvest: Number;
  claimingUSDWithoutTax: Number;
  reinvestingUSDWithoutTax: Number;
  firstHuntTime: Number;
  daysLeftUntilAbove3Stars: Number;

  // Voucher
  voucherWalletUSD: Number;
  showVoucherWalletBtn: Boolean;

  //// Nadodo Watch
  marketplaceTax: Number;
  huntTax: Number;
  buyTax: Number;
  sellTax: Number;
  damageReduction: Number;
  summonFee: Number;
  suppliesFee14: Number;
  suppliesFee28: Number;

  rewardStatus: String;
  rewardDesc: String;
  reserveStatus: String;
  reserveDesc: String;
  liquidityStatus: String;
  liquidityDesc: String;
  nadodoWatchLoading: Boolean;

  //// Take Action
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

  // Referral System
  referralStatsLoading: Boolean;
  referralStats: IReferralStats;
  hasFreeMint: Boolean;

  summonWarriorAnchorEl: HTMLButtonElement | null;
  summonBeastAnchorEl: HTMLButtonElement | null;

  mintBeastPending: Boolean;
  mintBeastVRFPending: Boolean;
  initialMintBeastLoading: Boolean;
  revealBeastLoading: Boolean;

  mintWarriorPending: Boolean;
  mintWarriorVRFPending: Boolean;
  initialMintWarriorLoading: Boolean;
  revealWarriorLoading: Boolean;

  huntPending: Boolean;
  huntVRFPending: Boolean;
  initialHuntLoading: Boolean;
  revealHuntLoading: Boolean;

  massHuntPending: Boolean;
  massHuntVRFPending: Boolean;
  initialMassHuntLoading: Boolean;
  revealMassHuntLoading: Boolean;

  huntingMonsterId: Number;
  huntingLegionId: Number;
  huntingSuccessPercent: Number;

  // Reincarnation

  // Filter and Pagination
  currentPage: Number;
  pageSize: Number;
  warriorFilterLevel: Number;
  beastFilterCapacity: Number;
  warriorFilterMinAP: Number;
  warriorFilterMaxAP: Number;
  warriorFilterMinConstAP: Number;
  warriorFilterMaxConstAP: Number;
  legionFilterMinAP: Number;
  legionFilterMaxAP: Number;
  legionFilterMinConstAP: Number;
  legionFilterMaxConstAP: Number;
  duelLegionFilterMinAP: Number; 
  duelLegionFilterMaxAP: Number;
  duelLegionFilterMinConstAP: Number;
  duelLegionFilterMaxConstAP: Number;
  duelJoinLeftMaxTime: Number;
  duelJoinLeftMinTime: Number;
  duelJoinLeftMaxConstTime: Number;
  duelJoinLeftMinConstTime: Number;
  duelLeftMaxTime: Number;
  duelLeftMinTime: Number;
  duelLeftMaxConstTime: Number;
  duelLeftMinConstTime: Number;
  duelResultFilterStart: Number;
  duelResultFilterEnd: Number;
  duelResultFilterStartConst: Number;
  duelResultFilterEndConst: Number;
  duelShowOnlyMine: Boolean;
  duelType: Boolean;
  // 
  sortAP: Number;
  sortPrice: Number;
  sortAPandPrice: Number;
  showOnlyNew: Boolean;
  showOnlyMine: Boolean;
  hideWeakLegion: Boolean;
  legionFilterHuntStatus: Number;
  legionFilterMinSupplies: Number;
  legionFilterMaxSupplies: Number;
  legionFilterMinConstSupplies: Number;
  legionFilterMaxConstSupplies: Number;

  // Vote
  hadSamaritanStar: Boolean;
  goodVote: Number;
  badVote: Number;
  playerSentiment: Number;
  alreadyVoted: Boolean;
  voteExpired: Boolean;
  lastestVoteDate: string;
  expireVoteDate: string;

  // Reincarnation
  reincarnationProcess: Boolean;
  allowReincarnation: Boolean;
  endDate: string;

  // Duel
  duelStatus: Number;
  allDuels: I_Duel[];
  getAllDulesLoading: Boolean;

  // modal
  tutorialModalOpen: Boolean;
  isShowBuySuppliesModal: Boolean;
  listOnMarketplaceModal: Boolean;
  updatePriceModal: Boolean;
  claimAndReinvestModalOpen: Boolean;
  walletSelectModalOpen: Boolean;
  referralTGModalOpen: Boolean;
  allowVote: Boolean;
  createDuelModalOpen: Boolean;

  /// Initial data from the backend
  initialDataLoading: Boolean;
  allLanguageTexts: any;
  contactInfo: IContact | null;
  addContactLoading: Boolean;
  editContactLoading: Boolean;
  itemnames: IItemname[];
  presentItem: IPresentITem;
}
