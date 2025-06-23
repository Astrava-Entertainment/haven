import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/filesSlice.ts";

export const store = configureStore({
  reducer: {
    core: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
