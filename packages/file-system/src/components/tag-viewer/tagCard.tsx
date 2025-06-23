import React, { CSSProperties } from 'react';
import { HavenFile } from '@haven/core/shared';
import { TagFileItem } from './tagFileItem';

interface TagCardProps {
  tag: string;
  color: string;
  files: HavenFile[];
  isExpanded: boolean;
  toggleTag: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  onFileClick: (file: HavenFile) => void;
  onFileDoubleClick: (file: HavenFile) => void;
  maxShowTags?: number;
}

export const TagCard: React.FC<TagCardProps> = (props) => {
  const {tag, color, files, isExpanded, toggleTag, onRightClick, onFileClick, onFileDoubleClick, maxShowTags = files.length} = props;

  const limitedFiles = files.slice(0, maxShowTags);

  return (
    <div
      className="bg-neutral-800 rounded-lg p-2 cursor-pointer select-none hover:bg-neutral-700"
      onContextMenu={onRightClick}
    >
      <div className="flex flex-row items-center justify-between gap-2 p-2" onClick={toggleTag}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border border-white/20 shadow"
            style={{ backgroundColor: color ?? '#ffffff' } as CSSProperties}
          />
          <h3 className="text-white font-semibold">{tag}</h3>
        </div>
        <span className="ml-auto text-sm text-white/50">{isExpanded ? '▾' : '▸'}</span>
      </div>

      {isExpanded && (
        <ul className="space-y-1 ml-2 border-l border-neutral-600 pl-2">
          {limitedFiles.map((file) => (
            <TagFileItem
              key={file.id}
              file={file}
              onClick={() => onFileClick(file)}
              onDoubleClick={() => onFileDoubleClick(file)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
