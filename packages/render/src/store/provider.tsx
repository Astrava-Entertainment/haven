import { FC, PropsWithChildren, createContext } from "react";
import { Provider, ReactReduxContextValue } from "react-redux";
import { RootState, store } from "./index";

export const context = createContext<ReactReduxContextValue<RootState> | null>(
  null
);

export const RenderProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store} context={context}>
      {children}
    </Provider>
  );
};
