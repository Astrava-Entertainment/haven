import { useContext, useSyncExternalStore } from "react";
import type { AppDispatch, RootState } from "./index";
import { context as coreContext } from "./provider";

export const useCoreDispatch: () => AppDispatch = () => {
  const context = useContext(coreContext);

  if (!context) {
    throw new Error("Redux core context is not available.");
  }

  return context.store.dispatch
};

export function useCoreSelector<T>(selector: (state: RootState) => T): T {
  const context = useContext(coreContext);

  if (!context) {
    throw new Error("Redux core context is not available.");
  }

  const { store } = context;

  const subscribe = store.subscribe;
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(subscribe, getSnapshot);
}
