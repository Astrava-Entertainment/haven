import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "../../render/src/App";
import coreStore from "./store/core-store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={coreStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
