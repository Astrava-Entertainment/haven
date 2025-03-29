import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from '../features/render/renderSlice';

const renderStore = configureStore({
  reducer: {
    uploads: uploadReducer,
  },
});

export type RootState = ReturnType<typeof renderStore.getState>;
export type AppDispatch = typeof renderStore.dispatch;

export default renderStore;
