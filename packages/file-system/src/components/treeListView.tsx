import React, { useState } from "react";
import {IHavenDirectory, ISortType} from "../common/interfaces.ts";
import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { ViewerHeader } from './viewerHeader.tsx'

interface DirectoryListViewProps {
  tree: (IHavenDirectory | HavenFile)[];
  onDoubleClick: (node: IHavenDirectory | HavenFile) => void;
  setSortType: (value: ISortType) => void;
}

export const TreeListView: React.FC<DirectoryListViewProps> = ({ tree, onDoubleClick, setSortType }) => {
  return (
    <div className="px-2">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-sm text-gray-400">
            <th
              className="p-2 cursor-pointer hover:bg-neutral-700"
              onClick={() => {setSortType(ISortType.Name)}}
            >
              Nombre
            </th>
            <th
              className="p-2 cursor-pointer hover:bg-neutral-700"
              onClick={() => {setSortType(ISortType.Type)}}
            >
              Tipo
            </th>
            <th
              className="p-2 cursor-pointer hover:bg-neutral-700"
              onClick={() => {setSortType(ISortType.Tag)}}
            >
              Etiquetas
            </th>
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
                { node.tags?
                  node.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs italic bg-blue-700 px-2 py-0.5 rounded mr-1"
                    >
                      {tag}
                    </span>
                  )) : "None"
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
