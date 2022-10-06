import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TUTORIAL_STEPS } from "../constants/tutorialSteps";
import {
  I_Beast,
  I_Legion,
  I_ReduxState,
  I_Warrior,
  IVoteInput,
  I_Duel,
} from "../interfaces";
import { RootState } from "../store";
import ApiService from "../services/api.service";
import { toast } from "react-toastify";
import languageTexts from "../constants/cryptolegions-languages.json";
import allItemNames from "../constants/cryptolegions-itemnames.json";

let allDulesTest: I_Duel[] = [
  {
    creatorAddress: "0x9090989340930940",
    creatorLegion: {
      id : "41",
      name : "九筒1号",
      beastIds: [176, 175, 4286, 5581],
      warriorIds: [472, 474, 473, 5452, 16596, 16598],
      attackPower: 13879,
      supplies : 0,
      huntStatus : false, 
      jpg :  "/assets/images/characters/jpg/legions/0.jpg",
      mp4 : "/assets/images/characters/mp4/legions/0.mp4",
      executeStatus: false,
    },
    creatorEstmatePrice: 3.78,
    joinerAddress: "0x31234232d232423242",
    joinerLegion: {
      id : "45",
      name : "hunter",
      beastIds: [176, 175, 4286, 5581],
      warriorIds: [472, 474, 473, 5452, 16596, 16598],
      attackPower: 13889,
      supplies : 0,
      huntStatus : false, 
      jpg :  "/assets/images/characters/jpg/legions/0.jpg",
      mp4 : "/assets/images/characters/mp4/legions/0.mp4",
      executeStatus: false,
    },
    joinerEstmatePrice: 3.13,
    type: false,
    status: 0,
    endDateTime: "2022-10-07 21:00:35",
    betPrice: 40,
    result: 3.4
  }
]

let initialState: I_ReduxState = {
  reloadContractStatus: new Date().getTime(),
  massHuntResult: [],
  tutorialStep: [1],
  tutorialForPopover: false,
  stepInfo: TUTORIAL_STEPS,
  tutorialOn: false,
  isSideBarOpen: false,
  claimInfo: {
    BLSTReward: 0,
    BUSDReward: 0,
  },
  tutorialRestartStep: 0,
  language: localStorage.getItem("lang")
    ? localStorage.getItem("lang") + ""
    : "en",
  showAnimation: localStorage.getItem("showAnimation") === "1" ? true : false,

  // game info

  // Beast
  allBeasts: [],
  getAllBeastsLoading: false,
  executeBeastsLoading: false,

  // Warrior
  allWarriors: [],
  getAllWarriorsLoading: false,
  executeWarriorsLoading: false,

  // Legion
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

  // Monsters && Hunt
  allMonsters: [],
  getAllMonsterLoading: false,

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

  // Marketplace
  listingPrice: 0,
  listingType: 0,
  listingId: "0",
  listingLoading: false,

  allBeastsMarketItems: [],
  getAllBeastsMarketItemsLoading: false,

  allWarriorsMarketItems: [],
  getAllWarriorsMarketItemsLoading: false,

  allLegionsMarketItems: [],
  getAllLegionsMarketItemsLoading: false,

  updatePriceLoading: false,
  buyItemLoading: false,
  cancelItemLoading: false,

  //// Your Inventory
  BLSTBalance: 0,
  beastBalance: 0,
  warriorBalance: 0,
  legionBalance: 0,
  availableLegionsCount: 0,
  unclaimedUSD: 0,
  unclaimedBLST: 0,
  taxLeftDaysForClaim: 0,
  taxLeftDaysForReinvest: 0,
  maxAttackPower: 0,
  USDToBLST: 0,
  BLSTToUSD: 0,
  BUSDForTotalBLST: 0,
  inventoryLoading: false,

  // Reinvest
  claimMinTaxPercent: 0,
  reinvestedWalletUSD: 0,
  reinvestedWalletBLST: 0,
  reinvestedTotalUSD: 0,
  additionalInvestment: 0,
  startupInvestment: 0,
  totalClaimedUSD: 0,

  currentReinvestPercent: 0,
  currentSamaritanStars: 0,

  futureReinvestPercentWhenClaim: 0,
  futureReinvestPercentWhenReinvest: 0,
  futureSamaritanStarsWhenClaim: 0,
  futureSamaritanStarsWhenReinvest: 0,
  remainUnclaimedUSDWhenClaim: 0,
  remainUnclaimedUSDWhenReinvest: 0,
  claimingUSDWithoutTax: 0,
  reinvestingUSDWithoutTax: 0,
  firstHuntTime: 0,
  daysLeftUntilAbove3Stars: 0,

  // Voucher
  voucherWalletUSD: 0,
  showVoucherWalletBtn: true,

  //// Nadodo Watch
  marketplaceTax: 0,
  huntTax: 0,
  buyTax: 0,
  sellTax: 0,
  damageReduction: 0,
  summonFee: 0,
  suppliesFee14: 0,
  suppliesFee28: 0,
  rewardStatus: "lime",
  rewardDesc: "Healthy",
  reserveStatus: "lime",
  reserveDesc: "Healthy",
  liquidityStatus: "lime",
  liquidityDesc: "Healthy",
  nadodoWatchLoading: false,

  //// Take Action
  summonReductionPer: {
    p1: 0,
    p10: -1,
    p50: -2,
    p100: -3,
    p150: -5,
  },
  summonPrice: {
    p1: { usd: 0, blst: 0 },
    p10: { usd: 0, blst: 0 },
    p50: { usd: 0, blst: 0 },
    p100: { usd: 0, blst: 0 },
    p150: { usd: 0, blst: 0 },
  },

  // Referral System
  referralStatsLoading: false,
  referralStats: {
    referrals: [],
    layer1Comission: 0,
    layer2Comission: 0,
    layer1Count: 0,
    layer2Count: 0,
  },
  hasFreeMint: false,

  summonWarriorAnchorEl: null,
  summonBeastAnchorEl: null,

  mintBeastPending: false,
  mintBeastVRFPending: false,
  initialMintBeastLoading: false,
  revealBeastLoading: false,

  mintWarriorPending: false,
  mintWarriorVRFPending: false,
  initialMintWarriorLoading: false,
  revealWarriorLoading: false,

  // Filter and Pagination
  currentPage: 1,
  pageSize: 20,
  warriorFilterLevel: 0,
  beastFilterCapacity: 0,
  warriorFilterMinAP: 500,
  warriorFilterMaxAP: 6000,
  warriorFilterMinConstAP: 500,
  warriorFilterMaxConstAP: 6000,
  legionFilterMinAP: 0,
  legionFilterMaxAP: 100000,
  legionFilterMinConstAP: 0,
  legionFilterMaxConstAP: 100000,

  sortAP: 1,
  sortPrice: 0,
  sortAPandPrice: 0,
  showOnlyNew: false,
  showOnlyMine: false,
  hideWeakLegion: false,
  legionFilterHuntStatus: 0,
  legionFilterMinSupplies: 0,
  legionFilterMaxSupplies: 14,
  legionFilterMinConstSupplies: 0,
  legionFilterMaxConstSupplies: 14,

  // Vote
  hadSamaritanStar: true,
  goodVote: 1,
  badVote: 1,
  playerSentiment: 0,
  alreadyVoted: false,
  voteExpired: false,
  expireVoteDate: "",
  lastestVoteDate: "",

  // Reincarnation
  reincarnationProcess: false,
  allowReincarnation: false,
  endDate: "2022-09-13 16:24:34",

  // Duel
  duelStatus: 0,
  allDuels: allDulesTest,
  duelLegionFilterMinConstAP: 10,
  duelLegionFilterMaxConstAP: 70,
  duelLegionFilterMinAP: 10,
  duelLegionFilterMaxAP: 70,
  duelJoinLeftMaxTime: 360,
  duelJoinLeftMinTime: 1,
  duelLeftMaxTime: 1080,
  duelLeftMinTime: 1,
  duelResultFilterStart: 1,
  duelResultFilterEnd: 30,
  
  // modal
  tutorialModalOpen: localStorage.getItem("tutorial") === "true" ? false : true,
  listOnMarketplaceModal: false,
  isShowBuySuppliesModal: false,
  updatePriceModal: false,
  claimAndReinvestModalOpen: false,
  walletSelectModalOpen: false,
  referralTGModalOpen: false,
  allowVote: false,

  /// Initial data from the backend
  initialDataLoading: false,
  allLanguageTexts: languageTexts,
  contactInfo: null,
  addContactLoading: false,
  editContactLoading: false,
  itemnames: allItemNames.map((item) => {
    return {
      _id: item._id.$oid,
      number: item.number,
      name: item.name,
      type: item.type,
    };
  }),
  presentItem: {
    jpg: "",
    mp4: "",
    diedjpg: "",
    diedmp4: "",
    show: true,
  },
};

export const getAllLanguageTexts = createAsyncThunk(
  "language/getAllLanguageTexts",
  async () => {
    const { data } = await ApiService.getAllLanguageTexts();
    return data;
  }
);

export const getContactInfo = createAsyncThunk(
  "contact/getContactInfo",
  async (wallet: string | undefined) => {
    const { data } = await ApiService.getContactInfo(wallet);
    return data;
  }
);

export const addContactInfo = createAsyncThunk(
  "contact/addContactInfo",
  async ({ wallet, tgname }: { wallet: string; tgname: string }) => {
    const { data } = await ApiService.addContactInfo(wallet, tgname);
    return data;
  }
);

export const editContactInfo = createAsyncThunk(
  "contact/editContactInfo",
  async ({ wallet, tgname }: { wallet: string; tgname: string }) => {
    const { data } = await ApiService.editContactInfo(wallet, tgname);
    return data;
  }
);

export const getAllItemnames = createAsyncThunk(
  "itemname/getAllItemnames",
  async () => {
    const { data } = await ApiService.getAllItemnames();
    console.log(data);
    return data;
  }
);

export const getPresentItem = createAsyncThunk(
  "presentitem/getPresentItem",
  async () => {
    const { data } = await ApiService.getPresentItem();
    return data;
  }
);

export const vote = createAsyncThunk(
  "vote/addVote",
  async ({ address, vote }: { address: string; vote: boolean }) => {
    const { data } = await ApiService.vote(address, vote);
    return data;
  }
);

export const getVoteByAddress = createAsyncThunk(
  "vote/getVoteByAddress",
  async ({ address }: { address: string }) => {
    const { data } = await ApiService.getVoteByAddress(address);
    return data;
  }
);

export const getVoteStatus = createAsyncThunk("vote/getVoteCnt", async () => {
  const { data } = await ApiService.getVoteStatus();
  return data;
});

export const confirmSamaritanStarHolder = createAsyncThunk(
  "samaritan/confirmSamaritanStarHolder",
  async ({ account }: { account: string }) => {
    const { data } = await ApiService.confirmSamaritanStarHolder(account);
    return data;
  }
);

export const addSamaritanStarHolder = createAsyncThunk(
  "samaritan/addSamaritanStarHolder",
  async ({ account }: { account: string }) => {
    const { data } = await ApiService.addSamaritanStarHolder(account);
    return data;
  }
);

export const getReincarnation = createAsyncThunk(
  "reincarnation/getReincarnation",
  async ({ version }: { version: number }) => {
    const { data } = await ApiService.getReincarnation(version);
    return data;
  }
);

export const addReincarnationValue = createAsyncThunk(
  "reincarnation/addReincarnationValue",
  async ({ address, value }: { address: string; value: number }) => {
    const { data } = await ApiService.addReincarnationValue(address, value);
    return data;
  }
);

export const cryptolegionsSlice = createSlice({
  name: "cryptolegions",
  initialState,
  reducers: {
    reloadContractStatus: (state) => {
      state.reloadContractStatus = new Date().getTime();
    },
    initMassHuntResult: (state) => {
      state.massHuntResult = [];
    },
    setMassHuntResult: (state, action: PayloadAction<any>) => {
      state.massHuntResult = [...state.massHuntResult, action.payload];
    },
    updateState: (state, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key: any) => {
        state[key as keyof I_ReduxState] = action.payload[key];
      });
    },
    changeAllBeastExecuteStatus: (state, action: PayloadAction<any>) => {
      const { status, ids } = action.payload;
      let temp: I_Beast[] = [];
      state.allBeasts.forEach((item) => {
        if (ids.find((id: String) => item.id === id)) {
          temp.push({ ...item, executeStatus: status });
        } else {
          temp.push({ ...item, executeStatus: false });
        }
      });
      state.allBeasts = temp;
    },
    changeAllWarriorExecuteStatus: (state, action: PayloadAction<any>) => {
      const { status, ids } = action.payload;
      let temp: I_Warrior[] = [];
      state.allWarriors.forEach((item) => {
        if (ids.find((id: String) => item.id === id)) {
          temp.push({ ...item, executeStatus: status });
        } else {
          temp.push({ ...item, executeStatus: false });
        }
      });
      state.allWarriors = temp;
    },
    changeAllLegionExecuteStatus: (state, action: PayloadAction<any>) => {
      const { status, ids } = action.payload;
      let temp: I_Legion[] = [];
      state.allLegions.forEach((item) => {
        if (ids.find((id: String) => id === item.id)) {
          temp.push({ ...item, executeStatus: status });
        } else {
          temp.push({ ...item, executeStatus: false });
        }
      });
      state.allLegions = temp;
    },
    changeBeastExecuteStatus: (state, action: PayloadAction<any>) => {
      let id = action.payload;
      let temp = state.allBeasts.map((beast) => {
        if (beast.id === id) {
          return {
            ...beast,
            executeStatus: !beast.executeStatus,
          };
        }
        return beast;
      });
      state.allBeasts = temp;
    },
    changeWarriorExecuteStatus: (state, action: PayloadAction<any>) => {
      let id = action.payload;
      let temp = state.allWarriors.map((warrior) => {
        if (warrior.id === id) {
          return {
            ...warrior,
            executeStatus: !warrior.executeStatus,
          };
        }
        return warrior;
      });
      state.allWarriors = temp;
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
    handleLegionBoxIn: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let temp = [
        ...state.createLegionBox,
        {
          type,
          item,
        },
      ];
      if (type === 0) {
        let tempBeasts = state.allBeasts.filter(
          (beast: I_Beast) => beast.id !== item.id
        );
        state.allBeasts = tempBeasts;
      }
      if (type === 1) {
        let tempWarriors = state.allWarriors.filter(
          (warrior: I_Warrior) => warrior.id !== item.id
        );
        state.allWarriors = tempWarriors;
      }
      state.createLegionBox = temp;
    },
    handleLegionBoxOut: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let tempBox = state.createLegionBox.filter((boxItem) => {
        if (boxItem.type === type && boxItem.item.id === item.id) {
          return false;
        }
        return true;
      });
      state.createLegionBox = tempBox;
      if (type === 0) {
        let tempBeasts = [...state.allBeasts, item];
        state.allBeasts = tempBeasts;
      }
      if (type === 1) {
        let tempWarriors = [...state.allWarriors, item];
        state.allWarriors = tempWarriors;
      }
    },
    handleUpdateLegionBoxIn: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let temp = [
        ...state.updateLegionBox,
        {
          type,
          item,
        },
      ];
      if (type === 0) {
        let tempBeasts = state.allBeasts.filter(
          (beast: I_Beast) => beast.id !== item.id
        );
        state.allBeasts = tempBeasts;
      }
      if (type === 1) {
        let tempWarriors = state.allWarriors.filter(
          (warrior: I_Warrior) => warrior.id !== item.id
        );
        state.allWarriors = tempWarriors;
      }
      state.updateLegionBox = temp;
    },
    handleUpdateLegionBoxOut: (state, action: PayloadAction<any>) => {
      let { type, item } = action.payload;
      let tempBox = state.updateLegionBox.filter((boxItem) => {
        if (boxItem.type === type && boxItem.item.id === item.id) {
          return false;
        }
        return true;
      });
      state.updateLegionBox = tempBox;
      if (type === 0) {
        let tempBeasts = [...state.allBeasts, item];
        state.allBeasts = tempBeasts;
      }
      if (type === 1) {
        let tempWarriors = [...state.allWarriors, item];
        state.allWarriors = tempWarriors;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllLanguageTexts.fulfilled, (state, { payload }) => {
      console.log("get all language texts", payload);
      state.allLanguageTexts = payload;
    });
    builder.addCase(getContactInfo.fulfilled, (state, { payload }) => {
      console.log(payload);
      state.contactInfo = payload.data;
    });
    builder.addCase(getAllItemnames.fulfilled, (state, { payload }) => {
      console.log(payload);
      state.itemnames = payload.data;
    });
    builder.addCase(getPresentItem.fulfilled, (state, { payload }) => {
      console.log("get present item: ", payload);
      state.presentItem = payload.data;
    });

    builder.addCase(addContactInfo.pending, (state) => {
      state.addContactLoading = true;
    });
    builder.addCase(addContactInfo.fulfilled, (state, { payload }) => {
      state.addContactLoading = false;
      state.referralTGModalOpen = false;
      if (payload.success) {
        toast.success("Telegram name is added");
      } else {
        toast.error(payload.msg);
      }
    });
    builder.addCase(addContactInfo.rejected, (state) => {
      state.addContactLoading = false;
    });

    builder.addCase(editContactInfo.pending, (state) => {
      state.editContactLoading = true;
    });
    builder.addCase(editContactInfo.fulfilled, (state, { payload }) => {
      state.editContactLoading = false;
      state.referralTGModalOpen = false;
      if (payload.success) {
        toast.success("Telegram name is updated");
      } else {
        toast.error(payload.msg);
      }
    });
    builder.addCase(editContactInfo.rejected, (state) => {
      state.editContactLoading = false;
    });

    builder.addCase(vote.pending, (state) => {});
    builder.addCase(vote.fulfilled, (state, { payload }) => {
      toast.success("Successfully voted!");
    });
    builder.addCase(vote.rejected, (state) => {
      toast.error("Failed!");
    });

    builder.addCase(getVoteByAddress.pending, (state) => {});
    builder.addCase(getVoteByAddress.fulfilled, (state, { payload }) => {
      // toast.success("success");
      if (payload.length == 0) {
        state.alreadyVoted = false;
      } else {
        state.alreadyVoted = true;
        state.lastestVoteDate = payload[0].lastest_date;
        if (
          new Date().getTime() -
            new Date(payload[0].lastest_date as string).getTime() <
          3 * 24 * 60 * 60 * 1000
        ) {
          state.voteExpired = false;
          state.expireVoteDate = new Date(
            new Date(
              new Date(payload[0].lastest_date as string).getTime() +
                3 * 24 * 60 * 60 * 1000
            )
          ).toString();
        } else {
          state.voteExpired = true;
        }
      }
    });
    builder.addCase(getVoteByAddress.rejected, (state) => {
      // toast.error("Failed!");
    });

    builder.addCase(getVoteStatus.pending, (state) => {});
    builder.addCase(getVoteStatus.fulfilled, (state, { payload }) => {
      state.goodVote = payload.goodCnt;
      state.badVote = payload.badCnt;
      if (payload.goodCnt + payload.badCnt != 0) {
        state.playerSentiment = Math.round(
          (payload.goodCnt * 100) / (payload.goodCnt + payload.badCnt)
        );
      } else {
        state.playerSentiment = 0;
      }
    });
    builder.addCase(getVoteStatus.rejected, (state) => {});

    builder.addCase(confirmSamaritanStarHolder.pending, (state) => {});
    builder.addCase(
      confirmSamaritanStarHolder.fulfilled,
      (state, { payload }) => {
        state.hadSamaritanStar = payload;
      }
    );
    builder.addCase(confirmSamaritanStarHolder.rejected, (state) => {});

    builder.addCase(addSamaritanStarHolder.pending, (state) => {});
    builder.addCase(
      addSamaritanStarHolder.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(addSamaritanStarHolder.rejected, (state) => {});

    builder.addCase(getReincarnation.pending, (state) => {});
    builder.addCase(getReincarnation.fulfilled, (state, { payload }) => {
      state.reincarnationProcess = payload.process;
      state.endDate = payload.close_date as string;
    });
    builder.addCase(getReincarnation.rejected, (state) => {});

    builder.addCase(addReincarnationValue.pending, (state) => {});
    builder.addCase(
      addReincarnationValue.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(addReincarnationValue.rejected, (state) => {});
  },
});

export const {
  reloadContractStatus,
  initMassHuntResult,
  setMassHuntResult,
  updateState,
  changeAllBeastExecuteStatus,
  changeAllWarriorExecuteStatus,
  changeAllLegionExecuteStatus,
  changeBeastExecuteStatus,
  changeWarriorExecuteStatus,
  changeLegionExecuteStatus,
  handleLegionBoxIn,
  handleLegionBoxOut,
  handleUpdateLegionBoxIn,
  handleUpdateLegionBoxOut,
} = cryptolegionsSlice.actions;

export const gameState = (state: RootState) => state.cryptolegions;

export default cryptolegionsSlice.reducer;
