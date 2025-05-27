import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findDirectoryAtPath, HavenFileNode } from "../../utils/directory";
import { findNodeById, removeNodeById } from "../../utils/nodeSearch";
import { InitialState } from "../../constants";

const initialState = InitialState;

const crudSlice = createSlice({
  name: "fileExplorer",
  initialState,
  reducers: {
    forceSetVisibleNodes(state, action: PayloadAction<HavenFileNode[]>) {
     state.visibleNodes = action.payload;
    },

    selectNode: (state, action: PayloadAction<HavenFileNode | null>) => {
      state.selectedNode = action.payload;
    },

    loadTree(state, action: PayloadAction<HavenFileNode[]>) {
      state.originalTree = action.payload;
      state.fullTree = action.payload;
      state.visibleNodes = action.payload;
      state.sortOrder = null;
    },

    addNewFolder(state) {
      const id = crypto.randomUUID();
      const newFolder: HavenFileNode = {
        id,
        name: "New Folder",
        type: "directory",
        children: [],
      };

      const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
      if (currentDir && currentDir.children) {
        currentDir.children.push(newFolder);
        state.visibleNodes = currentDir.children;
      } else {
        state.fullTree.push(newFolder);
        state.visibleNodes = state.fullTree;
      }

      state.renamingNodeId = id;
    },

    startRenamingNode: (state, action: PayloadAction<string>) => {
      state.renamingNodeId = action.payload;
    },

    renameNode(state, action: PayloadAction<{ id: string; newName: string }>) {
      const { id, newName } = action.payload;
      const node = findNodeById(state.fullTree, id);
      if (node) {
        node.name = newName;
      }

      const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
      state.visibleNodes = currentDir?.children || [];

      state.renamingNodeId = null;
    },

    moveNode(state, action: PayloadAction<{ sourceId: string; targetId: string }>) {
      const { sourceId, targetId } = action.payload;
      const nodeToMove = findNodeById(state.fullTree, sourceId);
      if (!nodeToMove) return;

      state.fullTree = removeNodeById(state.fullTree, sourceId);

      const targetDir = findNodeById(state.fullTree, targetId);
      if (targetDir && targetDir.type === "directory") {
        targetDir.children = targetDir.children || [];
        targetDir.children.push(nodeToMove);
      }

      const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
      state.visibleNodes = currentDir?.children || [];
    },

    deleteSelected(state) {
      if (!state.selectedNode) return;
      state.fullTree = removeNodeById(state.fullTree, state.selectedNode.id);
      const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
      state.visibleNodes = currentDir?.children || [];
      state.selectedNode = null;
    },
  },
});

export const {
  forceSetVisibleNodes,
  selectNode,
  loadTree,
  addNewFolder,
  startRenamingNode,
  renameNode,
  moveNode,
  deleteSelected,
} = crudSlice.actions;

export default crudSlice.reducer;
