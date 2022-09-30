import { AnyAction, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import cryptolegionsReducer from "../reducers/cryptolegions.reducer";

export const store = configureStore({
  reducer: {
    cryptolegions: cryptolegionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<{}, {}, any>;

export const AppSelector: TypedUseSelectorHook<RootState> = useSelector;
