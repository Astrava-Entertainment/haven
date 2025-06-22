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
    // This is not currently used
    addFile: (state, action: PayloadAction<HavenFile>) => {
      state.push(action.payload);
    },

    // This is not currently used
    popFile: (state, action: PayloadAction<HavenFile>) => {
      const fileName = action.payload.name;
      const index = state.findIndex((file) => file.name === fileName);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

export const { displayFile, addFile, popFile } = fileSlice.actions;
export default fileSlice.reducer;
