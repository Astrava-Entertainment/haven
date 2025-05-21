import React from "react";
import { useRenderSelector } from "./store/hooks";
import Viewer3d from "./views/viewer3d";
import InputFile from "./components/fileManager";
import { EFileExtension } from "./common";
import { getFileExtension } from "./utils/extension";
import { HavenLogo } from "./constants/logo";
import Viewer2d from "./views/viewer2d";
import ViewerMD from "./views/viewerMd";
import ViewerPDF from "./views/viewerPdf";
import AudioPlayer from "./views/audioPlayer";
import "@astrava/design-system/dist/style.css";

export function App() {
  const fileData = useRenderSelector((state) => state.file.data);
  const fileType = fileData?.ext;
  const extension = getFileExtension(fileType) || EFileExtension.Empty;

  const renderViewer = () => {
    console.log("extension: ", extension);
    switch (extension) {
      case EFileExtension.Empty:
        return (
          <div className="flex flex-col justify-center items-center my-12">
            <h1 className="text-4xl">Welcome to Haven.</h1>
            <img src={HavenLogo} alt="Haven Logo" className="size-[200px]" />
          </div>
        );

      case EFileExtension.Model3D:
        return <Viewer3d />;

      case EFileExtension.Image:
        console.log("EFileExtension.Image");
        return <Viewer2d />;

      case EFileExtension.Markdown:
        return <ViewerMD />;

      case EFileExtension.PDF:
        return <ViewerPDF />;

      case EFileExtension.Audio:
        return <AudioPlayer />;

      default:
        return (
          <div className="flex flex-col justify-center items-center my-12">
            <p>No viewer available for this file type.</p>
            <img src={HavenLogo} alt="Haven Logo" className="size-[200px]" />
          </div>
        );
    }
  };

  return (
    <div className="bg-neutral-800 text-white h-full relative">
      {renderViewer()}
    </div>
  );
}

export default App;
