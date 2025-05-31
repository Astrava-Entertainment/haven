import { combineReducers, configureStore } from "@reduxjs/toolkit";
import crudReducer from "./slices/crud";
import historyReducer from "./slices/history";
import navigationReducer from "./slices/navigation";
// import searchReducer from "./slices/search";

const rootReducer = combineReducers({
  crud: crudReducer,
  history: historyReducer,
  navigator: navigationReducer,
  // searcher: searchReducer
});

export const createStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
