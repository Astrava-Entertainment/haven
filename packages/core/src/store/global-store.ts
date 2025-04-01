import { configureStore, combineReducers } from "@reduxjs/toolkit";
import coreReducer from "../features/render/fileReducer";
import gizmoReducer from "../../../render/src/features/gizmoReducer";
import wireframeReducer from "../../../render/src/features/wireframeReducer";
import metadataReducer from "../../../render/src/features/metadataReducer";

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
