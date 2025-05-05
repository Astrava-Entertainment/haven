import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const CoreApp = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CoreApp />
);
