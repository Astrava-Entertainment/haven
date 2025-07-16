import React, { useEffect, useRef, useState } from 'react';
import { HavenFile } from '@haven/core/shared';
import { RenderTabContent, TabBar } from './render-tabs/index';
import { findFileById, loadFileFromStorage, saveFileToStorage } from '../utils/renderTab';

interface IRenderTab {
  files: HavenFile[];
  activeFileId: string | null;
  onTabChange: (fileId: string) => void;
  onCloseTab: (file: HavenFile) => void;
}


type Props = IRenderTab;

export const RenderTabManager: React.FC<Props> = (props) => {
  const {files, activeFileId, onTabChange, onCloseTab} = props;

  const [activeFile, setActiveFile] = useState<HavenFile | null>(null);
  const previousActiveFileIdRef = useRef<string | null>(null);

  useEffect(() => {
    const previousFileId = previousActiveFileIdRef.current;
    const previousFile = findFileById(files, previousFileId);

    if (previousFile && previousFileId !== activeFileId) {
      saveFileToStorage(previousFile);
    }

    const nextFile = findFileById(files, activeFileId);
    if (nextFile) {
      setActiveFile(nextFile);
    } else {
      const storedFile = loadFileFromStorage(activeFileId);
      setActiveFile(storedFile);
    }

    previousActiveFileIdRef.current = activeFileId;
  }, [activeFileId, files]);

  return (
    <div className="flex flex-col h-full">
      <TabBar
        files={files}
        activeFileId={activeFileId}
        onTabChange={onTabChange}
        onCloseTab={onCloseTab}
      />
      <RenderTabContent file={activeFile} />
    </div>
  );
};
