import React, { useMemo, useState } from "react";
import { IHavenDirectory, ISortType } from "../common/interfaces.ts";
import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { sortTreeByName, sortTreeByTag } from "../utils/sorter.ts";

interface ISorterState {
  sortType: ISortType;
  direction: "asc" | "desc";
}

interface DirectoryListView {
  tree: (IHavenDirectory | HavenFile)[];
  onDoubleClick: (node: IHavenDirectory | HavenFile) => void;
}

type Props = DirectoryListView;

export const TreeListView: React.FC<Props> = ({ tree, onDoubleClick }) => {
  const [sorter, setSorter] = useState<ISorterState | null>(null);

  const handleSort = (key: ISortType) => {
    setSorter((prev) => {
      if (prev?.sortType === key) {
        return {
          sortType: key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { sortType: key, direction: "asc" };
    });
  };

  const getSortIndicator = (key: ISortType) => {
    if (!sorter || sorter.sortType !== key) return null;
    return sorter.direction === "asc" ? "↑" : "↓";
  };

  const sortedTree = useMemo(() => {
    if (!sorter) return tree;

    let sorted: (IHavenDirectory | HavenFile)[];
    switch (sorter.sortType) {
      case ISortType.Name:
        sorted = sortTreeByName(tree);
        break;
      case ISortType.Tag:
        sorted = sortTreeByTag(tree);
        break;
      default:
        sorted = [...tree];
    }

    return sorter.direction === "desc" ? sorted.reverse() : sorted;
  }, [tree, sorter]);

  return (
    <div className="px-2">
      <table className="w-full table-fixed text-left">
        <thead>
        <tr className="text-sm text-gray-400">
          <th
            className="p-2 cursor-pointer hover:bg-neutral-700 w-[40%]"
            onClick={() => handleSort(ISortType.Name)}
          >
            Nombre <span>{getSortIndicator(ISortType.Name)}</span>
          </th>
          <th
            className="p-2 cursor-pointer hover:bg-neutral-700 w-[20%]"
            onClick={() => handleSort(ISortType.Type)}
          >
            Tipo <span>{getSortIndicator(ISortType.Type)}</span>
          </th>
          <th
            className="p-2 cursor-pointer hover:bg-neutral-700 w-[40%]"
            onClick={() => handleSort(ISortType.Tag)}
          >
            Etiquetas <span>{getSortIndicator(ISortType.Tag)}</span>
          </th>
        </tr>
        </thead>
        <tbody>
        {sortedTree.map((node) => (
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
              {node.tags?.length ? (
                node.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs italic bg-blue-700 px-2 py-0.5 rounded mr-1"
                  >
                      {tag}
                    </span>
                ))
              ) : (
                "None"
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};
