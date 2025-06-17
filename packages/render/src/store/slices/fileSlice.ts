import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {HavenFile}                    from "@haven/core/shared";

const initialState = {
  currentFile: null as HavenFile | null,
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    displayFile: (state, action: PayloadAction<HavenFile>) => {
      state.currentFile = { ...action.payload };
    },
    unloadFile: (state, _) => {
      state.currentFile = null;
    },
  },
});

export const { displayFile, unloadFile } = fileSlice.actions;
export default fileSlice.reducer;
