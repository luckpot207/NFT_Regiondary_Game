const testVersion = {
  version: "test",
  chain: "testnet",
  chainID: process.env.REACT_APP_TEST_CHAIN_ID,
  chainIDHex: process.env.REACT_APP_TEST_CHAIN_ID_HEX,
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  rpcWsUrl:
    "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/testnet/ws",
  walletAddRpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
  blockExplorerUrls: ["https://testnet.bscscan.com/"],
  baseTimeToShowMonster25: new Date(2022, 5, 30),
  moralisServerUrl: process.env.REACT_APP_TEST_MORALIS_SERVER_URL,
  moralisAppId: process.env.REACT_APP_TEST_MORALIS_APP_ID,
  moralisMasterKey: process.env.REACT_APP_TEST_MORALIS_MASTERKEY,
};

const mainVersion = {
  version: "main",
  chain: "mainnet",
  chainID: process.env.REACT_APP_MAIN_CHAIN_ID,
  chainIDHex: process.env.REACT_APP_MAIN_CHAIN_ID_HEX,
  rpcUrl:
    "https://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/mainnet",
  rpcWsUrl:
    "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/mainnet/ws",
  walletAddRpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
  baseTimeToShowMonster25: new Date(2022, 5, 30),
  moralisServerUrl: process.env.REACT_APP_MAIN_MORALIS_SERVER_URL,
  moralisAppId: process.env.REACT_APP_MAIN_MORALIS_APP_ID,
  moralisMasterKey: process.env.REACT_APP_MAIN_MORALIS_MASTERKEY,
};

// const gameVersion = testVersion;
const gameVersion = mainVersion;

export default gameVersion;
