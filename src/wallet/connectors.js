import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";
import gameConfig from "../config/game.config";

const gameVersion = gameConfig.version;

export const injected = new InjectedConnector({
  supportedChainIds: [parseInt(gameVersion.chainID)],
});

export const getLibrary = (provider) => new Web3(provider);
