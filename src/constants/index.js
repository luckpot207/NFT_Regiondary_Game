const navlink = {
  toSocial: [
    {
      type: "Discord",
      link: "https://www.cryptolegions.app/d",
    },
    {
      type: "Telegram",
      link: "https://www.cryptolegions.app/t",
    },
    {
      type: "Twitter",
      link: "https://www.cryptolegions.app/tw",
    },
    {
      type: "Youtube",
      link: "https://www.cryptolegions.app/y",
    },
    {
      type: "Medium",
      link: "https://www.cryptolegions.app/m",
    },
    {
      type: "ShowAnimation",
      link: "",
    },
  ],
  discord: "https://www.cryptolegions.app/d",
  telegram: "https://www.cryptolegions.app/t",
  twitter: "https://www.cryptolegions.app/tw",
  youtube: "https://www.cryptolegions.app/y",
  medium: "https://www.cryptolegions.app/m",
  pancake:
    "https://pancakeswap.finance/swap?outputCurrency=0x63441E5C9F55B5A9141f3D834a28426Ca1c5C5cC&inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  dextool:
    "https://www.dextools.io/app/bnb/pair-explorer/0x13fade99f5d7038cd53261770d80902c8756adae",
  whitepaper: "https://docs.bigcrypto.game/",
  tutorialVideoLink: "https://youtu.be/Ujn7WhSymXE",
  reincarnationDocLink:
    "https://docs.bigcrypto.game/awesome-features/reincarnation",
};

const itemNames = {
  beasts: {
    1: "Puppy",
    2: "Sandbox",
    3: "Olympus",
    4: "Lion",
    5: "Titan",
    20: "Fortress",
  },
  warriors: {
    1: "Student",
    2: "Junior",
    3: "Medior",
    4: "Senior",
    5: "Lead",
    6: "Undercover",
  },
  monsters: {
    1: "Grassland",
    2: "River",
    3: "rhinark",
    4: "Wind",
    5: "Mountain",
    6: "Ice",
    7: "Eclipse",
    8: "Desert",
    9: "Forest",
    10: "Solar",
    11: "Ocean",
    12: "Volcano",
    13: "Interstellar",
    14: "Universe",
    15: "Shiba Inu",
    16: "Polygon",
    17: "Polkadot",
    18: "titan",
    19: "Solana",
    20: "Cardano",
    21: "XRP",
    22: "Binance",
    23: "Ethereum",
    24: "Bitcoin",
    25: "iPhone 14",
  },
};

const filterAndPage = {
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

  duelStatus: 1,
  duelLegionFilterMinConstAP: 10,
  duelLegionFilterMaxConstAP: 70,
  duelLegionFilterMinAP: 10,
  duelLegionFilterMaxAP: 70,
  duelJoinLeftMaxTime: 360,
  duelJoinLeftMinTime: 1,
  duelJoinLeftMaxConstTime: 360,
  duelJoinLeftMinConstTime: 1,
  duelLeftMaxTime: 1080,
  duelLeftMinTime: 1,
  duelLeftMaxConstTime: 1080,
  duelLeftMinConstTime: 1,
  duelResultFilterStart: 0,
  duelResultFilterEnd: 30,
  duelResultFilterStartConst: 1,
  duelResultFilterEndConst: 30,
  duelShowOnlyMine: false,
  duelType: 0,
};

const vote = {
  endDate: "2022-09-13 16:24:34",
};

const color = {
  color1: "#24feff",
  color2: "#2da6f7",
  color3: "#195db3",
  bg1: "#121212",
  bg2: "#161616",
  bg3: "linear-gradient(0deg,hsl(0deg 0% 12%) 0%,hsl(0deg 0% 7%) 100%)",
  bg4: "#16161699",
  bg5: "#161616cc",
  bg6: "linear-gradient(360deg, #174f95, #ffffff29),radial-gradient(#12273c, #75a3c5)",
  popupBGColor: "#20253a",
};

const alarmAudio = "assets/audio/busdclaimedalarm.mp3";

const tokenPriceUrl =
  "https://coinmarketcap.com/dexscan/bsc/0x13fade99f5d7038cd53261770d80902c8756adae";

const all = {
  itemNames,
  navlink,
  filterAndPage,
  vote,
  color,
  alarmAudio,
  tokenPriceUrl,
};

export default all;
