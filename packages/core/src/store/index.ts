import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducers from './slices/globalStore'

export const reducers = combineReducers({
  global: globalReducers,
});

const store = configureStore({
  reducer: reducers
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
