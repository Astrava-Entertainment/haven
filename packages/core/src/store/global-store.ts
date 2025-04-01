import { configureStore, combineReducers } from "@reduxjs/toolkit";
import coreReducer from "../features/render/fileReducer";
import gizmoReducer from "../../../render/src/store/slices/gizmoSlice.ts";
import wireframeReducer from "../../../render/src/store/slices/controlsSlice.ts";
import metadataReducer from "../../../render/src/store/slices/metadataSlice.ts";

const renderReducer = combineReducers({
  gizmo: gizmoReducer,
  wireframe: wireframeReducer,
  metadata: metadataReducer
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
