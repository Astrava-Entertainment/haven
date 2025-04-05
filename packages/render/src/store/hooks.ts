import { useContext, useSyncExternalStore } from "react";
import type { AppDispatch } from "./index";
import type { RootState } from "./index";
import { context as renderContext } from "./provider";

export const useRenderDispatch: () => AppDispatch = () => {
  const context = useContext(renderContext);

  if (!context) {
    throw new Error("Redux render context is not available.");
  }

  return context.store.dispatch;
};

export function useRenderSelector<T>(selector: (state: RootState) => T): T {
  const context = useContext(renderContext);

  if (!context) {
    throw new Error("Redux render context is not available.");
  }

  const { store } = context;

  const subscribe = store.subscribe;
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(subscribe, getSnapshot);
}
