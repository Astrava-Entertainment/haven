import '@astrava/design-system/dist/style.css'

import React from "react";
import { useRenderSelector } from "./store/hooks";
import Viewer3d from "./views/viewer3d";
import { EFileExtension } from "./common";
import { getFileExtension } from "./utils/extension";
import { HavenLogo } from "./constants/logo";
import Viewer2d from "./views/viewer2d";
import ViewerMD from "./views/viewerMd";
import ViewerPDF from "./views/viewerPdf";
import AudioPlayer from "./views/audioPlayer";


export function App() {
  const fileData = useRenderSelector((state) => state.file.data);
  const fileType = fileData?.ext;
  const extension = getFileExtension(fileType) || EFileExtension.Empty;

  const renderViewer = () => {
    switch (extension) {
      case EFileExtension.Model3D:
        return <Viewer3d />;

      case EFileExtension.Image:
        return <Viewer2d />;

      case EFileExtension.Markdown:
        return <ViewerMD />;

      case EFileExtension.PDF:
        return <ViewerPDF />;

      case EFileExtension.Audio:
        return <AudioPlayer />;

      case EFileExtension.Empty:
      default:
        return (
          <div className="flex flex-col items-center">
            <h1>No viewer available for this file.</h1>
            <img src={HavenLogo} alt="Haven Logo" className="size-[200px]" />
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full">
      {renderViewer()}
    </div>
  );
}

export default App;
