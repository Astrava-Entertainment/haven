import React from "react";
import { IHavenDirectory } from "../common/interfaces.ts";
import { HavenFile } from "../../../core/src/common/havenFile.ts";

interface DirectoryGridViewProps {
  tree: (IHavenDirectory | HavenFile)[];
  onDoubleClick: (node: IHavenDirectory | HavenFile) => void;
}

export const TreeGridView: React.FC<DirectoryGridViewProps> = ({ tree, onDoubleClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {tree.map((node) => (
        <div
          key={node.id}
          onDoubleClick={() => onDoubleClick(node)}
          className="border border-gray-600 bg-neutral-800 rounded-xl p-4 hover:bg-neutral-700 cursor-pointer"
        >
          <div className="text-3xl mb-2">
            {node.type === "directory" ? "📁" : "📄"}
          </div>
          <div className="font-medium truncate">{node.name}</div>
          {node.type === "file" && (
            <div className="mt-2 flex flex-wrap gap-1">
              {node.tags?.map((tag, index) => (
                <span key={index} className="text-xs bg-blue-700 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
