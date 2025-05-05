import "./App.css";
import { useState } from "react";
import { CoreProvider } from "./store/provider";
import RenderApp from "../../render/src/index";

function App() {
  const [apps, setApps] = useState([0]); // Array for RenderApps

  const addApp = () => {
    setApps((prev) => [...prev, prev.length]);
  };

  const removeApp = () => {
    setApps((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  return (
    <CoreProvider>
      <div className="flex gap-x-2 m-2">
        <button className="bg-black text-white p-1" onClick={addApp}>
          Add RenderApp
        </button>
        <button
          className="bg-black text-white p-1"
          onClick={removeApp}
          disabled={apps.length === 0}
        >
          Drop RenderApp
        </button>
      </div>
      {apps.map((id) => (
        <RenderApp key={id} />
      ))}
    </CoreProvider>
  );
}

export default App;
