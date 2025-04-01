import { configureStore } from "@reduxjs/toolkit";
import gizmoReducer from "./slices/gizmoSlice.ts";
import metadataReducer from "./slices/metadataSlice";
import controlsReducer from "./slices/controlsSlice.ts";

export const store = configureStore({
  reducer: {
    gizmo: gizmoReducer,
    metadata: metadataReducer,
    controls: controlsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
