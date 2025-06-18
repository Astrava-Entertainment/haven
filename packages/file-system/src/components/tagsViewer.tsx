import React, { CSSProperties, useRef, useState } from 'react';
import { HavenFile } from '@haven/core/shared';
import { useClickOutside } from '@haven/core/utils/useClickOutside.tsx';
import { TagActions } from '@haven/file-system/components/tagActions.tsx';

// import { IContextMenu } from '~/common/interfaces.ts';

interface TagsViewer {
  maxShowTags?: number;
  tagsMap: Map<string, { files: HavenFile[]; furniture: Set<string> }>;
  handleViewFile: (file: HavenFile | null) => void;
  setPreviewFile: (file: HavenFile | null) => void;
}

type Props = TagsViewer;

export const TagsViewer: React.FC<Props> = (props) => {
  const { maxShowTags, tagsMap, handleViewFile, setPreviewFile } = props;
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  const [contextMenu, setContextMenu] = useState<IContextMenu | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const ignoredRef = useRef<HTMLUListElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const ignoredPopRef = useRef<HTMLDivElement | null>(null);

  // This is to unselect the current tag
  useClickOutside({
    containerRef: popupRef,
    onClickOutside: () => setContextMenu(null),
    ignoredRefs: [ignoredPopRef],
  });

  const toggleTag = (tag: string) => {
    setExpandedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      }
      else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: string,
    furniture: string
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tag, furniture });
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto px-2">
      {[...tagsMap?.entries()].map(([tag, data]) => {
        const isExpanded = expandedTags?.has(tag);
        const limitedFiles = data.files.slice(0, maxShowTags);

        const [firstFurniture] = Array.from(data.furniture);

        return (
          <div
            ref={containerRef}
            key={tag}
            className="bg-neutral-800 rounded-lg p-2 cursor-pointer select-none hover:bg-neutral-700"
          >
            <div
              className="flex flex-row items-center justify-between gap-2 p-2"
              onClick={() => toggleTag(tag)}
              onContextMenu={(e) => handleRightClick(e, tag, firstFurniture as string)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-white/20 shadow"
                  style={{ backgroundColor: firstFurniture ?? '#ffffff' } as CSSProperties}
                >
                </div>

                <h3
                  className="text-white font-semibold"
                  title="Doble click para expandir/colapsar"
                >
                  <span>{tag}</span>
                </h3>
              </div>

              <span className="ml-auto text-sm text-white/50">{isExpanded ? '▾' : '▸'}</span>
            </div>

            {isExpanded && (
              <ul
                ref={ignoredRef}

                className="space-y-1 ml-2 border-l hover:rounded-lg border-neutral-600"
              >
                {limitedFiles.map((file) => (
                  <li
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    onDoubleClick={() => handleViewFile(file)}
                    className="text-sm text-gray-300 hover:text-white hover:bg-neutral-600 rounded px-2 py-1 cursor-pointer"
                    title={file.name}
                  >
                    📄 {file.name}
                  </li>
                ))}
              </ul>
            )}

            {contextMenu && (
              <div ref={popupRef}>
                <TagActions
                  ignoredPopRef={ignoredPopRef}
                  x={contextMenu.x}
                  y={contextMenu.y}
                  tag={contextMenu.tag}
                  furniture={contextMenu.furniture}
                  onRename={(newName) => {
                    // TODO: rename tag logic
                    console.log('Name has been changed: ', newName);
                  }}
                  onChangeColor={(newColor) => {
                    // TODO: change color logic
                    console.log('Color has been changed: ', newColor);
                  }}
                  onClose={() => setContextMenu(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
