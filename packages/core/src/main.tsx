import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
// @ts-ignore
import FileSystem from "../../file-system/src/index";

const CoreApp = () => {
  return (
    <React.StrictMode>
      {/* <App /> */}
      <FileSystem />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CoreApp />
);
