import { PayloadAction } from "@reduxjs/toolkit";
import { FileExplorerState, ActionStackItem } from "../types";
import { findNodeById } from "../../../utils/nodeSearch";

const actions = {
  pushAction(state: FileExplorerState, action: PayloadAction<ActionStackItem>) {
    if (state.actionStack.length >= 5) {
      state.actionStack.shift();
    }
    state.actionStack.push(action.payload);
  },

  undoLastAction(state: FileExplorerState) {
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
      case "cut":
      case "paste":
      case "delete":
        // TODO: Implement undo logic for each
        break;
    }
  },
};

export default actions;
