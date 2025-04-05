import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "../features/render/fileReducer";

const coreStore = configureStore({
  reducer: {
    render: fileReducer
  }
})

export type RootState = ReturnType<typeof coreStore.getState>;
export type AppDispatch = typeof coreStore.dispatch;
export default coreStore;
