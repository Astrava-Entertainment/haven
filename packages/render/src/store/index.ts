import { combineReducers, configureStore } from "@reduxjs/toolkit";
import gizmoReducer from "./slices/gizmoSlice";
import metadataReducer from "./slices/metadataSlice";
import controlsReducer from "./slices/controlsSlice";

export const reducers = combineReducers({
  gizmo: gizmoReducer,
  metadata: metadataReducer,
  controls: controlsReducer,
});


export const store = configureStore({
  reducer: reducers,
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
