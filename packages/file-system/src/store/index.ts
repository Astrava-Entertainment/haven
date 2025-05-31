import { combineReducers, configureStore } from "@reduxjs/toolkit";
import crudReducer from "./slices/crudSlice.ts";

const fileReducer = combineReducers({
  crud: crudReducer,
});

export const createStore = () =>
  configureStore({
    reducer: fileReducer,
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
