import '@haven/design-system/style.css';
import { HavenLogo } from './constants';
import ImageViewer from '@haven/render/views/imageViewer.tsx';
import AudioPlayer from './views/audioPlayer';
import { useEffect } from 'react';
import { displayFile } from './store/slices/fileSlice';
import { setMetadata } from './store/slices/metadataSlice';
import { HavenFile } from '@haven/core/shared';
import MeshViewport from '@haven/render/views/meshViewport';
import MarkdownViewer from '@haven/render/views/markdownViewer';
import PdfViewer from '@haven/render/views/pdfViewer';
import { useRenderSelector, useRenderDispatch } from '@haven/render/shared';
import {classifyFileByExtension} from '@haven/render/utils/classifyFileByExtension.ts';

export function App({ file }: { file: HavenFile }) {
  const fileData = useRenderSelector((state) => state.file.currentFile);
  const extension = classifyFileByExtension(fileData?.name);
  const dispatch = useRenderDispatch();

  useEffect(() => {
    dispatch(setMetadata(null));
    dispatch(displayFile(file));
  }, [file, dispatch]);

  const RenderViewer = () => {
    switch (extension) {
      case 'mesh':
        return <MeshViewport />;

      case 'image':
        return <ImageViewer />;

      case 'markdown':
        return <MarkdownViewer />;

      case 'pdf':
        return <PdfViewer />;

      case 'audio':
        return <AudioPlayer />;

      case 'unsupported':
      default:
        return (
          <div className="flex flex-col items-center">
            <h1>No viewer available for this file.</h1>
            <img
              src={HavenLogo} alt="Haven Logo"
              className="size-[200px]"
            />
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
