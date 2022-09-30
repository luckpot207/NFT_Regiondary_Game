import gameVersion from "../constants/gameVersion";

export const ethereumConnect = () =>
  window.ethereum.request({ method: "eth_requestAccounts" });

export const isEthereumConnected = window.ethereum
  ? window.ethereum.isConnected()
  : false;

export const isEthereumMetaMask = window.ethereum
  ? window.ethereum.isMetaMask
  : null;

export const ethereumSendTransaction = (params) =>
  window.ethereum.request({
    method: "eth_sendTransaction",
    params,
  });

export const switchNetwork = () =>
  window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: gameVersion.chainIDHex }], // testnet // mainnet
  });

export const addNetwork = () =>
  window.ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: gameVersion.chainIDHex,
          chainName:
            gameVersion.chain === "mainnet"
              ? "Binance Smart Chain"
              : "Binance Smart Chain Testnet",
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: gameVersion.walletAddRpcUrls,
          blockExplorerUrls: gameVersion.blockExplorerUrls,
        },
      ],
    })
    .catch((error) => {});
