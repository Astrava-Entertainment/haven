import '@haven/design-system/style.css';
import { useRenderSelector } from "./store/hooks";
import { HavenLogo } from "./constants/logo";
import ImageViewer    from "@haven/render/views/imageViewer.tsx";
import AudioPlayer    from "./views/audioPlayer";
import {FC, useEffect}     from "react";
import {useRenderDispatch} from "./store/hooks";
import {displayFile}       from "./store/slices/fileSlice";
import {setMetadata}       from "./store/slices/metadataSlice";
import {HavenFile} from "@haven/core/shared";
import {classifyFileByExtension} from "@haven/render/file/fileType";
import MeshViewport from '@haven/render/views/meshViewport';
import MarkdownViewer from "@haven/render/views/markdownViewer";
import PdfViewer from "@haven/render/views/pdfViewer";

function App({file}: { file: HavenFile }) {
  const fileData = useRenderSelector((state) => state.file.currentFile);
  const fileType : string = fileData?.ext ?? "";
  const extension : EFileExtension = classifyFileByExtension(fileType);
  const dispatch = useRenderDispatch();

  useEffect(() =>
  {
    dispatch(setMetadata(null));
    dispatch(displayFile(file));
  }, [file, dispatch]);

  const RenderViewer: FC = () => {
    switch (extension) {
      case "mesh":
        return <MeshViewport />;

      case "image":
        return <ImageViewer />;

      case "markdown":
        return <MarkdownViewer />;

      case "pdf":
        return <PdfViewer />;

      case "audio":
        return <AudioPlayer />;

      case "unsupported":
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
      <RenderViewer />
    </div>
  );
}

export default App;
