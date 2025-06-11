import React, {useRef, useState} from 'react';
import { HavenFile } from "../../../core/src/common/havenFile.ts";
import {useClickOutside} from "../../../core/src/utils/useClickOutside.tsx";

interface TagsViewerProps {
  maxShowTags?: number;
  tagsMap: Map<string, HavenFile[]>;
  handleViewFile: (file: HavenFile| null) => void;
  setPreviewFile: (file: HavenFile | null) => void;
}

type Props = TagsViewerProps;

export const TagsViewer: React.FC<Props> = (props) => {
  const { maxShowTags, tagsMap, handleViewFile, setPreviewFile } = props
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const ignoredRef = useRef<HTMLUListElement>(null);

  // This is for unselect the current tag
  // useClickOutside(containerRef, () => setExpandedTags(new Set()), [ignoredRef]);

  const toggleTag = (tag: string) => {
    setExpandedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto px-2">
      {[...tagsMap?.entries()].map(([tag, files]) => {
        const isExpanded = expandedTags?.has(tag);
        const limitedFiles = files.slice(0, maxShowTags);
        return (
          <div
            ref={containerRef}
            key={tag}
            className="bg-neutral-800 rounded-lg p-2 cursor-pointer select-none hover:bg-neutral-700"
          >
            <div
              className="flex flex-row justify-between p-2"
              onClick={() => toggleTag(tag)}
            >
              <h3
                className="text-white font-semibold"
                title="Doble click para expandir/colapsar bg-neutral-400"
              >
                <span>{tag}</span>
              </h3>
                <span className="ml-auto">{isExpanded ? "▾" : "▸"}</span>
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
          </div>
        );
      })}
    </div>
  );
};
