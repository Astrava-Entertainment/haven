import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findDirectoryAtPath, HavenFileNode } from "../../utils/directory";
import { InitialState } from "../../constants";

const initialState = InitialState;

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    navigateInto(state, action: PayloadAction<string>) {
      const newPath = [...state.currentPath, action.payload];
      const dir = findDirectoryAtPath(state.fullTree, newPath);
      if (dir?.children) {
        state.visibleNodes = dir.children;
        state.currentPath = newPath;
      }
    },

    navigateBack(state) {
      if (state.currentPath.length === 0) return;
      const newPath = state.currentPath.slice(0, -1);
      const dir = findDirectoryAtPath(state.fullTree, newPath);
      state.currentPath = newPath;
      state.visibleNodes = dir?.children || [];
    },

    setFullTree(state, action: PayloadAction<HavenFileNode[]>) {
      state.fullTree = action.payload;
      state.currentPath = [];
      state.visibleNodes = action.payload;
    },
  },
});

export const { navigateInto, navigateBack, setFullTree } = navigationSlice.actions;

export default navigationSlice.reducer;
