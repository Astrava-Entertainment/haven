import { combineReducers, configureStore } from '@reduxjs/toolkit';
import crudReducer from 'packages/file-system/src/store/slices/fileTreeSlice.ts';

const fileReducer = combineReducers({
  crud: crudReducer,
});

export const createStore = () =>
  configureStore({
    reducer: fileReducer,
  });

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
