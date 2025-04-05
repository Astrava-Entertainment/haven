import { configureStore, combineReducers } from "@reduxjs/toolkit";
import coreReducer from "../features/render/fileReducer";
import { reducers as renderReducers } from '../../../../render/src/store/index'

const rootReducer = combineReducers({
  core: coreReducer,
  render: renderReducers,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
