import React from 'react';
import { HavenFile } from '@haven/core/shared';

interface Props {
  file: HavenFile;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

export const TabBarItem: React.FC<Props> = ({ file, isActive, onClick, onClose }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-4 py-2 select-none flex items-center gap-2 ${
        isActive ? 'bg-neutral-700 font-semibold' : 'hover:bg-neutral-800'
      }`}
    >
      <span>{file.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="text-red-500 hover:text-red-400"
        aria-label={`Close ${file.name}`}
      >
        ×
      </button>
    </div>
  );
};
