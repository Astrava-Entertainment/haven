import { configureStore, combineReducers } from "@reduxjs/toolkit";
import coreReducer from "../features/render/fileReducer";
import gizmoReducer from "../../../render/src/features/gizmoReducer";
import wireframeReducer from "../../../render/src/features/wireframeReducer";

const renderReducer = combineReducers({
  gizmo: gizmoReducer,
  wireframe: wireframeReducer,
});

const rootReducer = combineReducers({
  core: coreReducer,
  render: renderReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
