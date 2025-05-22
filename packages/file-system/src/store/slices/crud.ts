import { PayloadAction } from "@reduxjs/toolkit";
import { FileExplorerState } from "../../common/type";
import { HavenFileNode } from "../../utils/directory";

const crud = {
  selectNode(state: FileExplorerState, action: PayloadAction<HavenFileNode | null>) {
    state.selectedNode = action.payload;
  },

  loadTree(state: FileExplorerState, action: PayloadAction<HavenFileNode[]>) {
    state.fullTree = action.payload;
    state.visibleNodes = action.payload;
    state.currentPath = [];
    state.searchInput = "";
  },

  addNewFolder(state: FileExplorerState) {
    const name = "New Folder";
    const exists = state.fullTree.some((node) => node.name === name);
    const newFolder = { id: "", name, type: "directory" };

    if (!exists) {
      state.fullTree.push(newFolder);
      state.visibleNodes.push(newFolder);
    }
  },

  deleteSelected(state: FileExplorerState) {
    if (!state.selectedNode) return;
    const { name } = state.selectedNode;

    state.fullTree = state.fullTree.filter((n) => n.name !== name);
    state.visibleNodes = state.visibleNodes.filter((n) => n.name !== name);
    state.selectedNode = null;
  },
};

// export const {
//   addNewFolder,
//   deleteSelected,
//   selectNode,
//   loadTree,
//   navigateInto,
//   navigateBack,
//   setSearchInput,
// } = fileExplorerSlice.actions;

// export default fileExplorerSlice.reducer;

export default crud;
