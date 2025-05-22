import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HavenFileNode,
  findDirectoryAtPath,
  flattenFileTree,
} from "../../utils/directory";
import { MAX_STACK_SIZE } from "../../constants";
import { findNodeById } from "../../utils/nodeSearch";

interface FileExplorerState {
  fullTree: HavenFileNode[];
  visibleNodes: HavenFileNode[];
  selectedNode?: HavenFileNode | null;
  currentPath: string[];
  searchInput: string;
  actionStack: ActionStackItem[];
}

interface ActionStackItem {
  type: "cut" | "copy" | "paste" | "rename" | "delete";
  payload: any; // What you need to reverse the action, for example:
  // for rename: { oldName: string, newName: string, nodeId: string }
  // for cut/paste: nodes involved and their original and new paths.
};

const initialState: FileExplorerState = {
  fullTree: [],
  visibleNodes: [],
  currentPath: [],
  searchInput: "",
  actionStack: [],
};



export const fileExplorerSlice = createSlice({
  name: "fileExplorer",
  initialState,
  reducers: {
    pushAction(state, action: PayloadAction<ActionStackItem>) {
      if (state.actionStack.length >= MAX_STACK_SIZE) {
        state.actionStack.shift();
      }
      state.actionStack.push(action.payload);
    },

    undoLastAction(state) {
      const lastAction = state.actionStack.pop();
      if (!lastAction) return;

      switch (lastAction.type) {
        case "rename": {
          const node = findNodeById(state.fullTree, lastAction.payload.nodeId);
          if (node) {
            node.name = lastAction.payload.oldName;
          }
          break;
        }
        case "cut": {
          // Here you should move the node to its original parent, using payload.originalParentId
          // Implement move node from wherever it is to originalParentId
          break;
        }
        case "copy": {
          // Generally you cannot “undo” a copy alone, you may not save copy alone.
          break;
        }
        case "paste": {
          // Move node from newParentId to oldParentId to reverse pasting
          break;
        }
        case "delete": {
          // Insert node back into its parentId
          break;
        }
      }
    },

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

      // !TODO: Node Id
      if (!folderExists) {
        state.fullTree.push({ id: "" , name: newFolderName, type: "directory" });
        state.visibleNodes.push({ id: "" , name: newFolderName, type: "directory" });
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
  deleteSelected,
  selectNode,
  loadTree,
  navigateInto,
  navigateBack,
  setSearchInput,
} = fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;
