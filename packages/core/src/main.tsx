import "./App.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "../../render/src/App";
import globalStore from "./store/globalStore";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={globalStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
