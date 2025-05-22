import { PayloadAction } from "@reduxjs/toolkit";
import { FileExplorerState } from "../types";
import { flattenFileTree, findDirectoryAtPath } from "../../../utils/directory";

const search = {
  setSearchInput(state: FileExplorerState, action: PayloadAction<string>) {
    const input = action.payload;
    state.searchInput = input;

    if (input.trim() === "") {
      const dir = findDirectoryAtPath(state.fullTree, state.currentPath);
      state.visibleNodes = dir?.children || [];
    } else {
      const matches = flattenFileTree(state.fullTree).filter((node) =>
        node.name.toLowerCase().includes(input.toLowerCase())
      );
      state.visibleNodes = matches;
    }
  },
};

export default search;
