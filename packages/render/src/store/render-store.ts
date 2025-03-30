import { configureStore } from "@reduxjs/toolkit";
import gizmoReducer from "../features/gizmoReducer";

const renderStore = configureStore({
  reducer: {
    gizmo: gizmoReducer
  }
})

export type RootState = ReturnType<typeof renderStore.getState>;
export type AppDispatch = typeof renderStore.dispatch;
export default renderStore;
