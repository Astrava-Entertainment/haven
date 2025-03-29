import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import renderStore from "../../render/src/store/render-store";
import App from "../../render/src/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={renderStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
