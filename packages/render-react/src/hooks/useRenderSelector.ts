import { useContext, useSyncExternalStore } from 'react';
import type { RootState } from '../store';
import { context as renderContext } from '../store/provider';

export function useRenderSelector<T>(selector: (state: RootState) => T): T {
  const context = useContext(renderContext);

  if (!context) {
    throw new Error('Redux render context is not available.');
  }

  const { store } = context;

  const subscribe = store.subscribe;
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(subscribe, getSnapshot);
}
