import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionStackItem } from "../../common/type";
import { InitialState, MAX_UNDO_SIZE } from "../../constants";

const initialState = InitialState

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
