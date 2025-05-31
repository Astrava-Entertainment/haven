import { useContext, useSyncExternalStore } from "react";
import type { AppDispatch, RootState } from "./index";
import { context as fileContext } from "./provider";

export const useFileDispatch: () => AppDispatch = () => {
  const context = useContext(fileContext);

  if (!context) {
    throw new Error("Redux file context is not available.");
  }

  return context.store.dispatch
};

export function useFileSelector<T>(selector: (state: RootState) => T): T {
  const context = useContext(fileContext);

  if (!context) {
    throw new Error("Redux file context is not available.");
  }

  const { store } = context;

  const subscribe = store.subscribe;
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(subscribe, getSnapshot);
}
