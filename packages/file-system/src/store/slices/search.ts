import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findDirectoryAtPath, flattenFileTree, HavenFileNode } from "../../utils/directory";
import { InitialState } from "../../constants";

const initialState = InitialState;


const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchInput(state, action: PayloadAction<string>) {
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

    sortByName(state) {
      state.fullTree = [...state.originalTree].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      state.visibleNodes = [...state.fullTree];
      state.sortOrder = "name";
    },

    sortByTag(state) {
      state.fullTree = [...state.originalTree].sort((a, b) => {
        const tagA = a.tag ?? "";
        const tagB = b.tag ?? "";
        return tagA.localeCompare(tagB);
      });
      state.visibleNodes = [...state.fullTree];
      state.sortOrder = "tag";
    },

    resetSort(state) {
      state.fullTree = state.originalTree;
      state.visibleNodes = [...state.originalTree];
      state.sortOrder = null;
    },

    setOriginalTree(state, action: PayloadAction<HavenFileNode[]>) {
      state.originalTree = action.payload;
      state.fullTree = action.payload;
      state.visibleNodes = action.payload;
      state.currentPath = [];
      state.searchInput = "";
      state.sortOrder = null;
    },
  },
});

export const {
  setSearchInput,
  sortByName,
  sortByTag,
  resetSort,
  setOriginalTree,
} = searchSlice.actions;

export default searchSlice.reducer;
