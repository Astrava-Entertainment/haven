import { useContext } from 'react';
import type { AppDispatch } from '../store';
import { context as renderContext } from '../store/provider';

export const useRenderDispatch = (): AppDispatch => {
  const context = useContext(renderContext);

  if (!context) {
    throw new Error('Redux render context is not available.');
  }

  return context.store.dispatch;
};
