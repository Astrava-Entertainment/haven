import React, { useEffect, useState } from "react";
import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { navigateBack } from "../store/slices/navigation";
import { addNewFolder } from "../store/slices/crud";
import { HavenFileNode } from "~/utils/directory";
import { ESort } from "../common";

const FileToolbar: React.FC = ({ onChange }) => {
  const dispatch = useFileSystemDispatch();
  const { currentPath, visibleNodes } = useFileSystemSelector((state) => state.crud);
  const [sortedNodes, setSortedNodes] = useState<HavenFileNode[]>([]);

  useEffect(() => {
    handleSorts(ESort.None)
  }, [])

  useEffect(() => {
    setSortedNodes(visibleNodes);
  }, [])

  const handleSorts = (sort: ESort) => {
    switch (sort) {
      case ESort.NameAsc: {
        const sorted = [...visibleNodes].sort((a, b) => a.name.localeCompare(b.name));
        setSortedNodes(sorted);
        break;
      }
      case ESort.TagAsc: {
        const sorted = [...visibleNodes].sort((a, b) => {
          const tagA = a.tag ?? "";
          const tagB = b.tag ?? "";
          return tagA.localeCompare(tagB);
        });
        setSortedNodes(sorted);
        break;
      }
      case ESort.None: {
        setSortedNodes(visibleNodes);
        break;
      }
    }
  };


  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => dispatch(navigateBack())}
        disabled={currentPath.length === 0}
        className="px-3 py-1 bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-50">
        ← Back
      </button>
      <button
        onClick={() => dispatch(addNewFolder())}
        className="px-3 py-1 bg-green-800 rounded hover:bg-green-600">
        New Folder
      </button>
      <button
        onClick={() => handleSorts(ESort.NameAsc)}
        className="px-3 py-1 border rounded hover:bg-white hover:text-black">
        Clear Sort
      </button>
      <button
        onClick={() => { handleSorts(ESort.NameAsc) }}
        className="px-3 py-1 border rounded hover:bg-white hover:text-black">
        By Name
      </button>
      <button
        onClick={() => handleSorts(ESort.NameAsc)}
        className="px-3 py-1 border rounded hover:bg-white hover:text-black">
        By Tag
      </button>
    </div>
  );
};

export default FileToolbar;
