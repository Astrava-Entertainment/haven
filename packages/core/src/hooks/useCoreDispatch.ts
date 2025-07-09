import { useContext } from 'react';
import { AppDispatch } from '../store';
import { context as coreContext } from '../store/provider';

export const useCoreDispatch = (): AppDispatch => {
  const context = useContext(coreContext);

  if (!context) {
    throw new Error('Redux core context is not available.');
  }

  return context.store.dispatch;
};
