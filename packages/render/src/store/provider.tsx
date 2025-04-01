import React, {FC, PropsWithChildren} from "react";
import {Provider} from "react-redux";
import {store} from "./index.ts";

export const ReduxProvider : FC<PropsWithChildren> = ({children})=>
{
  //TODO: use a custom context
  const renderContext = React.createContext(null);

  return (
    <Provider store={store} context={renderContext}>
      {children}
    </Provider>
  );
};
