import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HavenFile } from "../../../common/file";

const initialState: HavenFile[] = [];

export const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<HavenFile>) => {
      state.push(action.payload);
    },
    popFile: (state, action: PayloadAction<HavenFile>) => {
      const fileName = action.payload.name;
      const newFiles = state.filter((file) => file.name !== fileName);
      state = newFiles;
    },
  },
});

export const { addFile, popFile } = fileSlice.actions;
export default fileSlice.reducer;
