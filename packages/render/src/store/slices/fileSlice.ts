import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HavenFile } from "../../../../core/src/common/havenFile.ts";
import {
  addFile,
  popFile,
} from "../../../../core/src/store/slices/render/filesSlice";

const initialState = {
  data: HavenFile | null,
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<HavenFile>) => {
      state.data = { ...action.payload };
    },
    dropFile: (state, _) => {
      state.data = null;
    },
  },
});

export const { setFile, dropFile } = fileSlice.actions;
export default fileSlice.reducer;
