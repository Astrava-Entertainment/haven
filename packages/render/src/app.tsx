import React from "react";
import { useRenderSelector } from "./store/hooks";
import Viewer3d from "./views/viewer3d";
import InputFile from "./components/fileManager";
import { EFileExtension } from "./common";
import { getFileExtension } from "./utils/extension";
import { HavenLogo } from "./constants/logo";
import Viewer2d from "./views/viewer2d";

export function App() {
  const fileType = useRenderSelector((state) => state.file.data?.type);

  const extension = getFileExtension(fileType) | EFileExtension.Empty;

  const renderViewer = () => {
    switch (extension) {
      case EFileExtension.Empty:
        return (
          <div className="flex flex-col justify-center items-center my-12">
            <h1 className="text-4xl">Welcome to Haven.</h1>
            <img src={HavenLogo} alt="Haven Logo" className="size-[200px]" />
          </div>
        );
        break;

      case EFileExtension.Model3D:
        return <Viewer3d />;

      case EFileExtension.Image:
        return <Viewer2d />;

      case EFileExtension.Markdown:
      case EFileExtension.PDF:
      case EFileExtension.Audio:
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
    <div className="bg-neutral-800 text-white">
      <InputFile />
      {renderViewer()}
    </div>
  );
}

export default App;
