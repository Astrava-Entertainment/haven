import { configureStore, combineReducers } from "@reduxjs/toolkit";
import coreReducer from "../features/render/fileReducer";
import gizmoReducer from "../../../render/src/features/gizmoReducer";

const rootReducer = combineReducers({
  core: coreReducer,
  render: gizmoReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
