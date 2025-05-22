import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileExplorerState } from "../types";
import { findDirectoryAtPath } from "../../../utils/directory";

// const initialState: FileExplorerState = {
//   fullTree: [],
//   visibleNodes: [],
//   currentPath: [],
//   searchInput: "",
//   actionStack: [],
// };

export const navigation = ({
  navigateInto(state: FileExplorerState, action: PayloadAction<string>) {
    const newPath = [...state.currentPath, action.payload];
    const dir = findDirectoryAtPath(state.fullTree, newPath);
    if (dir?.children) {
      state.visibleNodes = dir.children;
      state.currentPath = newPath;
    }
  },

  navigateBack(state: FileExplorerState) {
    if (state.currentPath.length === 0) return;
    const newPath = state.currentPath.slice(0, -1);
    const dir = findDirectoryAtPath(state.fullTree, newPath);
    state.currentPath = newPath;
    state.visibleNodes = dir?.children || [];
  },
};)

export default navigation;
