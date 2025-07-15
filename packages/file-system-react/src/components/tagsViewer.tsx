import React, { useRef, useState } from 'react';
import { HavenFile } from '@haven/core/shared';
import { useClickOutside } from '@haven/core/utils';
import { TagActions, TagCard } from './tag-viewer/index';

interface IContextMenu {
  x: number;
  y: number;
  tag: string;
  furniture: string;
}

interface TagsViewerProps {
  maxShowTags?: number;
  tagsMap: Map<string, { files: HavenFile[]; furniture: Set<string> }>;
  handleViewFile: (file: HavenFile | null) => void;
  setPreviewFile: (file: HavenFile | null) => void;
}

export const TagsViewer: React.FC<TagsViewerProps> = (props) => {
  const { maxShowTags, tagsMap, handleViewFile, setPreviewFile } = props;
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<IContextMenu | null>(null);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const ignoredPopRef = useRef<HTMLDivElement | null>(null);

  useClickOutside({
    containerRef: popupRef,
    onClickOutside: () => setContextMenu(null),
    ignoredRefs: [ignoredPopRef],
  });

  const toggleTag = (tag: string) => {
    setExpandedTags((prev) => {
      const newSet = new Set(prev);
      newSet.has(tag) ? newSet.delete(tag) : newSet.add(tag);
      return newSet;
    });
  };

  const handleRightClick = (
    e: React.MouseEvent,
    tag: string,
    furniture: string
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tag, furniture });
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto px-2">
      {[...tagsMap.entries()].map(([tag, data]) => {
        const isExpanded = expandedTags.has(tag);
        const [firstFurniture] = Array.from(data.furniture);

        return (
          <TagCard
            key={tag}
            tag={tag}
            color={firstFurniture}
            files={data.files}
            isExpanded={isExpanded}
            toggleTag={() => toggleTag(tag)}
            onRightClick={(e) => handleRightClick(e, tag, firstFurniture)}
            onFileClick={setPreviewFile}
            onFileDoubleClick={handleViewFile}
            maxShowTags={maxShowTags}
          />
        );
      })}

      {contextMenu && (
        <div ref={popupRef}>
          <TagActions
            ignoredPopRef={ignoredPopRef}
            x={contextMenu.x}
            y={contextMenu.y}
            tag={contextMenu.tag}
            furniture={contextMenu.furniture}
            onRename={(newName) => {
              console.log('Renamed tag to:', newName);
            }}
            onChangeColor={(newColor) => {
              console.log('Changed color to:', newColor);
            }}
            onClose={() => setContextMenu(null)}
          />
        </div>
      )}
    </div>
  );
};
