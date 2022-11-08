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
  whitepaper: "https://docs.cryptolegions.app/",
  tutorialVideoLink: "https://youtu.be/Ujn7WhSymXE",
  reincarnationDocLink:
    "https://docs.cryptolegions.app/new-updates-in-v3/reincarnation",
};

const itemNames = {
  beasts: {
    1: "Centaur",
    2: "Barghest",
    3: "Pegasus",
    4: "Griffin",
    5: "Dragon",
    20: "Phoenix",
  },
  warriors: {
    1: "Hobbit",
    2: "Gnome",
    3: "Satyr",
    4: "Dwarf",
    5: "Minotaur",
    6: "Dragon",
  },
  monsters: {
    1: "bat",
    2: "wereshark",
    3: "rhinark",
    4: "lacodon",
    5: "oliphant",
    6: "ogre",
    7: "werewolf",
    8: "orc",
    9: "cyclops",
    10: "gargoyle",
    11: "golem",
    12: "land dragon",
    13: "chimera",
    14: "earthworm",
    15: "hydra",
    16: "rancor",
    17: "cerberus",
    18: "titan",
    19: "forest dragon",
    20: "ice dragon",
    21: "undead dragon",
    22: "volcano dragon",
    23: "fire demon",
    24: "invisible",
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
  color1: "#e89f38",
  color2: "#f66810",
  color3: "#a44916",
  bg1: "#121212",
  bg2: "#161616",
  bg3: "linear-gradient(0deg,hsl(0deg 0% 12%) 0%,hsl(0deg 0% 7%) 100%)",
  bg4: "#16161699",
  bg5: "#161616cc",
  bg6: "linear-gradient(360deg, #622500, #ffffff29),radial-gradient(#953e0a, #9ca90b)",
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
