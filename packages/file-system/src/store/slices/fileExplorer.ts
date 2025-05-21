import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HavenFileNode,
  findDirectoryAtPath,
  flattenFileTree,
} from "../../utils/directory";

interface FileExplorerState {
  fullTree: HavenFileNode[];
  visibleNodes: HavenFileNode[];
  selectedNode?: HavenFileNode | null;
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
    selectNode: (state, action: PayloadAction<HavenFileNode | null>) => {
      state.selectedNode = action.payload;
    },
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

    addNewFolder: (state) => {
      const newFolderName = "New Folder";
      const folderExists = state.fullTree.some(
        (node) => node.name === newFolderName
      );

      if (!folderExists) {
        state.fullTree.push({ name: newFolderName, type: "directory" });
        state.visibleNodes.push({ name: newFolderName, type: "directory" });
      } else {
      }
    },

    deleteSelected: (state) => {
      if (!state.selectedNode) return;

      state.fullTree = state.fullTree.filter(
        (node) => node.name !== state.selectedNode!.name
      );
      state.visibleNodes = state.visibleNodes.filter(
        (node) => node.name !== state.selectedNode!.name
      );
      state.selectedNode = null;
    },
  },
});

export const {
  addNewFolder,
  selectNode,
  loadTree,
  navigateInto,
  navigateBack,
  setSearchInput,
} = fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;
