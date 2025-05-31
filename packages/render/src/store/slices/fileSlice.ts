import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HavenFile } from "../../../../core/src/common/havenFile.ts";
import {
  addFile,
  popFile,
} from "../../../../core/src/store/slices/render/filesSlice";

interface FilesReducer {
  data: HavenFile | null;
}

const initialState: FilesReducer = {
  data: null,
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<HavenFile>) => {
      state.data = action.payload;
      // addFile(action.payload);
    },
    dropFile: (state, action: PayloadAction<HavenFile>) => {
      state.data = null;
      // popFile(action.payload);
    },
  },
});

export const { setFile, dropFile } = fileSlice.actions;
export default fileSlice.reducer;
