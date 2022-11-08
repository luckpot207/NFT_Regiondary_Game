import { combineReducers } from "@reduxjs/toolkit";
import commonReduer from "./common.reduer";
import inventoryReducer from "./inventory.reducer";
import beastReducer from "./beast.reducer";
import warriorReducer from "./warrior.reducer";
import legionReducer from "./legion.reducer";
import monsterReducer from "./monster.reducer";
import marketplaceReducer from "./marketplace.reducer";
import referralReducer from "./referral.reducer";
import filterAndPageReducer from "./filterAndPage.reducer";
import voteReducer from "./vote.reducer";
import modalReducer from "./modal.reducer";
import duelReducer from "./duel.reducer";

const CryptolegionsReducer = combineReducers({
  common: commonReduer,
  inventory: inventoryReducer,
  beast: beastReducer,
  warrior: warriorReducer,
  legion: legionReducer,
  monster: monsterReducer,
  marketplace: marketplaceReducer,
  referral: referralReducer,
  filterAndPage: filterAndPageReducer,
  vote: voteReducer,
  duel: duelReducer,
  modal: modalReducer,
});

export default CryptolegionsReducer;
