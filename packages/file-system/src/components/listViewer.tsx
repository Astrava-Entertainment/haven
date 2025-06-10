import React, {useEffect, useRef, useState} from 'react';
import { HavenFile } from "../../../core/src/common/havenFile.ts";

interface ListViewerProps {
  tagsMap: Map<string, HavenFile[]>;
  setSelectedFile: (file: HavenFile| null) => void;
  setPreviewFile: (file: HavenFile | null) => void;

}

type Props = ListViewerProps;

export const ListViewer: React.FC<Props> = (props) => {
  const { tagsMap, setSelectedFile, setPreviewFile } = props
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  const tagNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagNodeRef.current && !tagNodeRef.current.contains(event.target as Node)) {
        // setExpandedTags(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        return (
          <div
            ref={tagNodeRef}
            key={tag}
            className="bg-neutral-700 rounded-lg p-2 cursor-pointer select-none hover:bg-neutral-600"
          >
            <h3
              onClick={() => toggleTag(tag)}
              className="text-white font-semibold mb-2"
              title="Doble click para expandir/colapsar"
            >
              <span>{tag}</span>
            </h3>

            {isExpanded && (
              <ul className="space-y-1 pl-4 border-l border-neutral-600">
                {files.map((file) => (
                  <li
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    onDoubleClick={() => setSelectedFile(file)}
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
