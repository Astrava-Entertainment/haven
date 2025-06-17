import React, {useEffect} from "react";
import ReactDOM           from "react-dom/client";
import {CoreProvider}     from "@haven/core/store/provider";
import {FileProvider}     from "@haven/file-system";
import {RenderProvider} from "@haven/render";
import App              from "@haven/core/app.tsx";


const CoreApp = () =>
{
  useEffect(() =>
  {
    const handleContextMenu = ((event: MouseEvent) => event.preventDefault());
    document.addEventListener("contextmenu", handleContextMenu);
    return () =>
    {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <React.StrictMode>
      <CoreProvider>
        <FileProvider>
          <RenderProvider>
            <App/>
          </RenderProvider>
        </FileProvider>
      </CoreProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CoreApp/>,
);
