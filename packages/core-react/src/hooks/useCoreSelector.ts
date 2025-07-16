import { useContext, useSyncExternalStore } from 'react';
import type { RootState } from '../store';
import { context as coreContext } from '../store/provider';

export function useCoreSelector<T>(selector: (state: RootState) => T): T {
  const context = useContext(coreContext);

  if (!context) {
    throw new Error('Redux core context is not available.');
  }

  const { store } = context;

  const subscribe = store.subscribe;
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(subscribe, getSnapshot);
}
