import React, { useState } from "react";
import { IHavenDirectory } from "../common/interfaces.ts";
import { HavenFile } from "../../../core/src/common/havenFile.ts";

interface DirectoryListViewProps {
  tree: (IHavenDirectory | HavenFile)[];
  onDoubleClick: (node: IHavenDirectory | HavenFile) => void;
}

export const TreeListView: React.FC<DirectoryListViewProps> = ({ tree, onDoubleClick }) => {
  return (
    <div className="p-4">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-sm text-gray-400 border-b border-gray-600">
            <th className="p-2">Nombre</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Etiquetas</th>
          </tr>
        </thead>
        <tbody>
          {tree.map((node) => (
            <tr
              key={node.id}
              className="hover:bg-neutral-700 cursor-pointer"
              onDoubleClick={() => onDoubleClick(node)}
            >
              <td className="p-2 flex items-center gap-2">
                {node.type === "directory" ? "📁" : "📄"} {node.name}
              </td>
              <td className="p-2 capitalize">{node.type}</td>
              <td className="p-2">
                {node.type === "file" &&
                  node.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-700 px-2 py-0.5 rounded mr-1"
                    >
                      {tag}
                    </span>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
