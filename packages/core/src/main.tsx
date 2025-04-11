import "./App.css";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import RenderApp from "../../render/src/index";
import { CoreProvider } from "./store/provider";

const Core = () => {
  const [apps, setApps] = useState([0]); // Array de IDs para RenderApp

  const addApp = () => {
    setApps((prev) => [...prev, prev.length]);
  };

  const removeApp = () => {
    setApps((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  return (
    <React.StrictMode>
      <CoreProvider>
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={addApp} style={{ marginRight: "0.5rem" }}>
            Añadir RenderApp
          </button>
          <button onClick={removeApp} disabled={apps.length === 0}>
            Quitar RenderApp
          </button>
        </div>
        {apps.map((id) => (
          <RenderApp key={id} />
        ))}
      </CoreProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Core />
);
