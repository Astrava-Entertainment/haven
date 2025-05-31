import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHavenDirectory } from "./types";
import {HavenFile} from "../../../../core/src/common/havenFile.ts";

interface HavenState {
  tree: IHavenDirectory[];
}

const initialState: HavenState = {
  tree: [],
};

const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    loadJson(state, action: PayloadAction<any>) {
      state.tree = action.payload as HavenFile
    },
  },
});

export const { loadJson } = crudSlice.actions;
export default crudSlice.reducer;
