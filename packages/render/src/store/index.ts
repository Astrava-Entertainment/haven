import { combineReducers, configureStore } from "@reduxjs/toolkit";
import gizmoReducer from "./slices/gizmoSlice";
import metadataReducer from "./slices/metadataSlice";
import controlsReducer from "./slices/controlsSlice";
import fileReducer from "./slices/fileSlice";

const rootReducer = combineReducers({
  gizmo: gizmoReducer,
  metadata: metadataReducer,
  controls: controlsReducer,
  file: fileReducer,
});

export const createStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
