import React, { useState, useEffect, useRef } from "react";
import { HavenFile } from './common/havenFile.ts';
import Renderer from '../../../render/src/index.tsx';

interface RenderTab {
  files: HavenFile[];
  activeFileId: string | null;
  onTabChange: (fileId: string) => void;
  onCloseTab: (file: HavenFile) => void;
}

type Props = RenderTab

export const RendererTabs: React.FC<Props> = (props) => {
  const { files, activeFileId, onTabChange, onCloseTab } = props;

  const [activeFile, setActiveFile] = useState<HavenFile | null>(null);
  const prevActiveFileId = useRef<string | null>(null);

  // Save the file when other is opened
  useEffect(() => {
    const prevId = prevActiveFileId.current;
    const prevFile = files.find(f => f.id === prevId);
    if (prevFile && prevId !== activeFileId) {
      localStorage.setItem(`file-${prevFile.id}`, JSON.stringify(prevFile));
    }

    if (activeFileId) {
      const newFile = files.find(f => f.id === activeFileId);
      if (newFile) {
        setActiveFile(newFile);
      } else {
        const stored = localStorage.getItem(`file-${activeFileId}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as HavenFile;
            setActiveFile(parsed);
          } catch {
            console.warn('Error parsing localStorage file');
            setActiveFile(null);
          }
        } else {
          setActiveFile(null);
        }
      }
    } else {
      setActiveFile(null);
    }

    prevActiveFileId.current = activeFileId;
  }, [activeFileId, files]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-neutral-700 bg-neutral-900">
        {files.map(file => (
          <div
            key={file.id}
            onClick={() => onTabChange(file.id)}
            className={`cursor-pointer px-4 py-2 select-none flex items-center gap-2 ${
              activeFileId === file.id ? "bg-neutral-700 font-semibold" : "hover:bg-neutral-800"
            }`}
          >
            <span>{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(file);
              }}
              className="text-red-500 hover:text-red-400"
              aria-label={`Cerrar ${file.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 bg-neutral-800">
        {activeFile ? (
          <Renderer file={activeFile} />
        ) : (
          <div className="text-neutral-500 text-center mt-20">No hay archivos abiertos</div>
        )}
      </div>
    </div>
  );
};
