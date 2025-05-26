// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
//   HavenFileNode,
//   findDirectoryAtPath,
//   flattenFileTree,
// } from "../../utils/directory";
// import { MAX_UNDO_SIZE } from "../../constants";
// import { findNodeById, removeNodeById } from "../../utils/nodeSearch";
// import { ActionStackItem, FileExplorerState } from "../../common/type";

// const initialState: FileExplorerState = {
//   fullTree: [],
//   visibleNodes: [],
//   currentPath: [],
//   searchInput: "",
//   actionStack: [],
//   renamingNodeId: null,
//   originalTree: [],
//   sortOrder: null,
// };

// export const fileExplorerSlice = createSlice({
//   name: "fileExplorer",
//   initialState,
//   reducers: {
//     moveNode: (
//       state,
//       action: PayloadAction<{ sourceId: string; targetId: string }>
//     ) => {
//       const { sourceId, targetId } = action.payload;
//       const nodeToMove = findNodeById(state.fullTree, sourceId);
//       if (!nodeToMove) return;

//       state.fullTree = removeNodeById(state.fullTree, sourceId);

//       const targetDir = findNodeById(state.fullTree, targetId);
//       if (targetDir && targetDir.type === "directory") {
//         targetDir.children = targetDir.children || [];
//         targetDir.children.push(nodeToMove);
//       }

//       const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
//       state.visibleNodes = currentDir?.children || [];
//     },

//     pushAction(state, action: PayloadAction<ActionStackItem>) {
//       if (state.actionStack.length >= MAX_UNDO_SIZE) {
//         state.actionStack.shift();
//       }
//       state.actionStack.push(action.payload);
//     },

//     undoLastAction(state) {
//       const lastAction = state.actionStack.pop();
//       if (!lastAction) return;
//       // Handle undo cases
//     },

//     selectNode: (state, action: PayloadAction<HavenFileNode | null>) => {
//       state.selectedNode = action.payload;
//     },

//     startRenamingNode: (state, action: PayloadAction<string>) => {
//       state.renamingNodeId = action.payload;
//     },

//     renameNode: (
//       state,
//       action: PayloadAction<{ id: string; newName: string }>
//     ) => {
//       const { id, newName } = action.payload;
//       const node = findNodeById(state.fullTree, id);
//       if (node) {
//         node.name = newName;
//       }

//       // Update tree
//       const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
//       state.visibleNodes = currentDir?.children || [];

//       state.renamingNodeId = null;
//     },

//     loadTree(state, action: PayloadAction<HavenFileNode[]>) {
//       state.originalTree = action.payload;
//       state.fullTree = action.payload;
//       state.visibleNodes = action.payload;
//       state.sortOrder = null;
//     },

//     navigateInto: (state, action: PayloadAction<string>) => {
//       const newPath = [...state.currentPath, action.payload];
//       const dir = findDirectoryAtPath(state.fullTree, newPath);
//       if (dir?.children) {
//         state.visibleNodes = dir.children;
//         state.currentPath = newPath;
//       }
//     },

//     navigateBack: (state) => {
//       if (state.currentPath.length === 0) return;
//       const newPath = state.currentPath.slice(0, -1);
//       const dir = findDirectoryAtPath(state.fullTree, newPath);
//       state.currentPath = newPath;
//       state.visibleNodes = dir?.children || [];
//     },

//     setSearchInput: (state, action: PayloadAction<string>) => {
//       state.searchInput = action.payload;
//       if (action.payload.trim() === "") {
//         const dir = findDirectoryAtPath(state.fullTree, state.currentPath);
//         state.visibleNodes = dir?.children || [];
//       } else {
//         state.visibleNodes = flattenFileTree(state.fullTree).filter((node) =>
//           node.name.toLowerCase().includes(action.payload.toLowerCase())
//         );
//       }
//     },

//     addNewFolder: (state) => {
//       const id = crypto.randomUUID();
//       const newFolder: HavenFileNode = {
//         id,
//         name: "New Folder",
//         type: "directory",
//         children: [],
//       };

//       const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
//       if (currentDir && currentDir.children) {
//         currentDir.children.push(newFolder);
//         state.visibleNodes = currentDir.children;
//       } else {
//         state.fullTree.push(newFolder);
//         state.visibleNodes = state.fullTree;
//       }

//       state.renamingNodeId = id;
//     },

//     deleteSelected: (state) => {
//       if (!state.selectedNode) return;
//       state.fullTree = removeNodeById(state.fullTree, state.selectedNode.id);
//       const currentDir = findDirectoryAtPath(state.fullTree, state.currentPath);
//       state.visibleNodes = currentDir?.children || [];
//       state.selectedNode = null;
//     },

//     sortByName(state) {
//       state.fullTree = [...state.originalTree].sort((a, b) =>
//         a.name.localeCompare(b.name)
//       );
//       state.visibleNodes = [...state.fullTree];
//       state.sortOrder = "name";
//     },

//     sortByTag(state) {
//       state.fullTree = [...state.originalTree].sort((a, b) => {
//         const tagA = a.tag ?? "";
//         const tagB = b.tag ?? "";
//         return tagA.localeCompare(tagB);
//       });
//       state.visibleNodes = [...state.fullTree];
//       state.sortOrder = "tag";
//     },

//     resetSort(state) {
//       state.fullTree = state.originalTree;
//       state.visibleNodes = [...state.originalTree];
//       state.sortOrder = null;
//     },
//   },
// });

// export const {
//   addNewFolder,
//   deleteSelected,
//   selectNode,
//   loadTree,
//   navigateInto,
//   navigateBack,
//   setSearchInput,
//   moveNode,
//   pushAction,
//   undoLastAction,
//   startRenamingNode,
//   renameNode,
//   sortByName,
//   sortByTag,
//   resetSort,
// } = fileExplorerSlice.actions;

// export default fileExplorerSlice.reducer;
