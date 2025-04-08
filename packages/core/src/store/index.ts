import { combineReducers, configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/render/filesSlice";

const renderReducers = combineReducers({
  render: fileReducer,
})

export const reducers = combineReducers({
  core: renderReducers
});

export const store = configureStore({
  reducer: reducers
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
