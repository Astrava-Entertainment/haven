import React from 'react';
import { HavenFile } from '@haven/core/shared';

interface TagFileItemProps {
  file: HavenFile;
  onClick: () => void;
  onDoubleClick: () => void;
}

export const TagFileItem: React.FC<TagFileItemProps> = (props) => {
  const {file, onClick, onDoubleClick} = props;
  return (
    <li
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className="text-sm text-gray-300 hover:text-white hover:bg-neutral-600 rounded px-2 py-1 cursor-pointer"
      title={file.name}
    >
      📄 {file.name}
    </li>
  );
};
