// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { FileExplorerState } from "~/common/type";
// import {
//   findDirectoryAtPath,
//   flattenFileTree,
//   HavenFileNode,
// } from "~/utils/directory";

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

// const searchSlice = createSlice({
//   name: "search",
//   initialState,
//   reducers: {
//     setSearchInput(state, action: PayloadAction<string>) {
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

//     sortByName(state) {
//       state.fullTree = [...state.originalTree].sort((a, b) =>
//         a.name.localeCompare(b.name)
//       );
//       state.visibleNodes = [...state.fullTree];
//       state.sortOrder = "name";
//     },

//     sortByTagAsc(state) {
//       state.fullTree = [...state.originalTree].sort(
//         (a: HavenFile, b: HavenFile) => {
//           const tagA = a.tag ?? "";
//           const tagB = b.tag ?? "";
//           return tagA.localeCompare(tagB);
//         }
//       );
//       state.visibleNodes = [...state.fullTree];
//       state.sortOrder = "tag";
//     },

//     resetSort(state) {
//       state.fullTree = state.originalTree;
//       state.visibleNodes = [...state.originalTree];
//       state.sortOrder = null;
//     },

//     setOriginalTree(state, action: PayloadAction<HavenFileNode[]>) {
//       state.originalTree = action.payload;
//       state.fullTree = action.payload;
//       state.visibleNodes = action.payload;
//       state.currentPath = [];
//       state.searchInput = "";
//       state.sortOrder = null;
//     },
//   },
// });

// export const {
//   setSearchInput,
//   sortByName,
//   sortByTagAsc,
//   resetSort,
//   setOriginalTree,
// } = searchSlice.actions;

// export default searchSlice.reducer;
