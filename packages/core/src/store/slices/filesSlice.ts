import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HavenFile } from "@haven/core/shared";

const initialState: HavenFile[] = [];

export const fileSlice = createSlice({
  name: "openFiles",
  initialState,
  reducers: {
    displayFile: (state, action: PayloadAction<HavenFile>) => {
      state.length = 0;
      state.push(action.payload);
    },
  },
});

export const { displayFile } = fileSlice.actions;
export default fileSlice.reducer;
