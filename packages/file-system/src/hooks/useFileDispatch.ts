import { useContext } from 'react';
import type { AppDispatch } from '../store';
import { context as fileContext } from '../store/provider';

export const useFileDispatch = (): AppDispatch => {
  const context = useContext(fileContext);

  if (!context) {
    throw new Error('Redux file context is not available.');
  }

  return context.store.dispatch;
};
