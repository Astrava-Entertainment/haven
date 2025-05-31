import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionStackItem, FileExplorerState } from "../../common/type";
import { MAX_UNDO_SIZE } from "../../constants";

const initialState: FileExplorerState = {
  fullTree: [],
  visibleNodes: [],
  currentPath: [],
  searchInput: "",
  actionStack: [],
  renamingNodeId: null,
  originalTree: [],
  sortOrder: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    pushAction(state, action: PayloadAction<ActionStackItem>) {
      if (state.actionStack.length >= MAX_UNDO_SIZE) {
        state.actionStack.shift();
      }
      state.actionStack.push(action.payload);
    },

    undoLastAction(state) {
      const lastAction = state.actionStack.pop();
      if (!lastAction) return;
      // TODO:
    },
  },
});

export const { pushAction, undoLastAction } = historySlice.actions;

export default historySlice.reducer;
