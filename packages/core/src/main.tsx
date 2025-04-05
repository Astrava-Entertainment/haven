import "./App.css";
import React from "react";
import ReactDOM from "react-dom/client";
import RenderApp from "../../render/src/index";
import { CoreProvider } from "./store/provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CoreProvider>
      <RenderApp />
    </CoreProvider>
  </React.StrictMode>
);
