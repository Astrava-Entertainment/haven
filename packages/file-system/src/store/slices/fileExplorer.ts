import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HavenFileNode,
  findDirectoryAtPath,
  flattenFileTree,
} from "../../utils/directory";

interface FileExplorerState {
  fullTree: HavenFileNode[];
  visibleNodes: HavenFileNode[];
  currentPath: string[];
  searchInput: string;
}

const initialState: FileExplorerState = {
  fullTree: [],
  visibleNodes: [],
  currentPath: [],
  searchInput: "",
};

export const fileExplorerSlice = createSlice({
  name: "fileExplorer",
  initialState,
  reducers: {
    loadTree: (state, action: PayloadAction<HavenFileNode[]>) => {
      state.fullTree = action.payload;
      state.visibleNodes = action.payload;
      state.currentPath = [];
      state.searchInput = "";
    },

    navigateInto: (state, action: PayloadAction<string>) => {
      const newPath = [...state.currentPath, action.payload];
      const dir = findDirectoryAtPath(state.fullTree, newPath);
      if (dir?.children) {
        state.visibleNodes = dir.children;
        state.currentPath = newPath;
      }
    },

    navigateBack: (state) => {
      if (state.currentPath.length === 0) return;
      const newPath = state.currentPath.slice(0, -1);
      const dir = findDirectoryAtPath(state.fullTree, newPath);
      state.currentPath = newPath;
      state.visibleNodes = dir?.children || [];
    },

    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
      if (action.payload.trim() === "") {
        const dir = findDirectoryAtPath(state.fullTree, state.currentPath);
        state.visibleNodes = dir?.children || [];
      } else {
        state.visibleNodes = flattenFileTree(state.fullTree).filter((node) =>
          node.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
  },
});

export const { loadTree, navigateInto, navigateBack, setSearchInput } =
  fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;
