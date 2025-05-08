import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-ignore
import FileSystem from "../../file-system/src/index";
import { CoreProvider } from "./store/provider";

const CoreApp = () => {
  return (
    <React.StrictMode>
      <CoreProvider>
        <App />
      </CoreProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CoreApp />
);
