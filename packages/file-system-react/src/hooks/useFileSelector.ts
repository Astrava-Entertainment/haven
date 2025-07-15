import { useContext, useSyncExternalStore } from 'react';
import type { RootState } from '../store';
import { context as fileContext } from '../store/provider';

export function useFileSelector<T>(selector: (state: RootState) => T): T {
  const context = useContext(fileContext);

  if (!context) {
    throw new Error('Redux file context is not available.');
  }

  const { store } = context;

  const subscribe = store.subscribe;
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(subscribe, getSnapshot);
}
