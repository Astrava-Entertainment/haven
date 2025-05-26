import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-ignore
import FileSystem from "../../file-system/src/index";
import { CoreProvider } from "./store/provider";
import { FileExplorerProvider } from "../../file-system/src/store/provider";

const CoreApp = () => {
  return (
    <React.StrictMode>
      <CoreProvider>
        <FileExplorerProvider>
          <App />
        </FileExplorerProvider>
      </CoreProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CoreApp />
);
