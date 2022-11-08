import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CryptolegionsReducer from "../reducers";

export const store = configureStore({
  reducer: CryptolegionsReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<{}, {}, any>;

export const AppSelector: TypedUseSelectorHook<RootState> = useSelector;
