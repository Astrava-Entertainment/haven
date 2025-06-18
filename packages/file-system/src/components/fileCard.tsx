import React from "react";
import { HavenFile } from "@haven/core/shared";

interface FileCardProps {
  node: IHavenDirectory | HavenFile;
  onDoubleClick: (node: IHavenDirectory | HavenFile) => void;
  onClick: (node: IHavenDirectory | HavenFile) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ node, onDoubleClick, onClick }) => {
  return (
    <div
      onDoubleClick={() => onDoubleClick(node)}
      onClick={() => onClick(node)}
      className="border border-gray-600 bg-neutral-800 rounded-xl p-4 hover:bg-neutral-700 cursor-pointer flex flex-col items-center justify-center"
    >
      <div className="text-3xl mb-2">
        {node.type === "directory" ? "📁" : "📄"}
      </div>
      <div className="font-medium truncate">{node.name}</div>
      {node.type === "file" && node.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {node.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-700 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
