import { combineReducers, configureStore } from "@reduxjs/toolkit";
import fileExplorerReducer from "./slices/fileExplorer";

const rootReducer = combineReducers({
  fileExplorer: fileExplorerReducer,
});

export const createStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
