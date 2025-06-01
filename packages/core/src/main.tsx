import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-ignore
import FileSystem from "../../file-system/src/index";
import { CoreProvider } from "./store/provider";
import { FileProvider } from "../../file-system/src/store/provider";
import { RenderProvider } from "../../render/src/store/provider.tsx";

const CoreApp = () => {

  useEffect(() => {
    const handleContextMenu = ((event: MouseEvent) => event.preventDefault());
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    }
  }, []);

  return (
    <React.StrictMode>
      <CoreProvider>
        <FileProvider>
          <RenderProvider>
            <App />
          </RenderProvider>
        </FileProvider>
      </CoreProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CoreApp />
);
