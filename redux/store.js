/** @format */

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CountrySlice } from "./CountryApi";
import { combineReducers } from "@reduxjs/toolkit";
import { middleware } from "@reduxjs/toolkit/query";
import { persistReducer } from "redux-persist";

export const store = configureStore({
  reducer: {
    [CountrySlice.reducerPath]: CountrySlice.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // For ignore checking proccess , becuse to lardge data
      immutableCheck: false,
      serializableCheck: false,
    }).concat(CountrySlice.middleware),
});
