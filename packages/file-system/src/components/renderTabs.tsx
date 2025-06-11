import React, { useState } from "react";
import { HavenFile } from './common/havenFile.ts';
import Renderer from '../../../render/src/index.tsx'


interface RendererTabs {
  files: HavenFile[];
  activeFileId: string | null;
  onTabChange: (fileId: string) => void;
  onCloseTab: (file: HavenFile) => void;
}

type Props = RendererTabs;

export const RendererTabs: React.FC<Props> = (props) => {
  const { files, activeFileId, onTabChange, onCloseTab } = props;

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
                if (onCloseTab) onCloseTab(file);
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
        {activeFileId && (
          <Renderer file={files.find(f => f.id === activeFileId)!} />
        )}
        {!activeFileId && <div className="text-neutral-500 text-center mt-20">No hay archivos abiertos</div>}
      </div>
    </div>
  );
};

export default RendererTabs;
