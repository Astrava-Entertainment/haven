import React from "react";
import { useRenderSelector } from "./store/hooks";
import Viewer3d from "./views/viewer3d";
import InputFile from "./components/fileManager";
import { EExtensionType } from "./common/types";
import { getFileExtension } from "./utils/extension";
import { HavenLogo } from "./constants/logo";
import Viewer2d from "./views/viewer2d";

export function App() {
  const fileType = useRenderSelector((state) => state.file.data?.type);

  const extension = getFileExtension(fileType) | EExtensionType.Empty;

  const renderViewer = () => {
    switch (extension) {
      case EExtensionType.Empty:
        return (
          <div className="flex flex-col justify-center items-center my-12">
            <h1 className="text-4xl">Welcome to Haven.</h1>
            <img src={HavenLogo} alt="Haven Logo" className="size-[200px]" />
          </div>
        );
        break;

      case EExtensionType.Model3D:
        return <Viewer3d />;

      case EExtensionType.Image:
        return <Viewer2d />;

      case EExtensionType.Markdown:
      case EExtensionType.PDF:
      case EExtensionType.Audio:
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
