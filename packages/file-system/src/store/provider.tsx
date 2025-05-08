import { FC, PropsWithChildren, createContext, useMemo } from "react";
import { Provider, ReactReduxContextValue } from "react-redux";
import { createStore, RootState } from "./index";

export const context = createContext<ReactReduxContextValue<RootState> | null>(
  null
);

export const FileExplorerProvider: FC<PropsWithChildren> = ({ children }) => {
  const store = useMemo(() => createStore(), []);

  return (
    <Provider store={store} context={context}>
      {children}
    </Provider>
  );
};
