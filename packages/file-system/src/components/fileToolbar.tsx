import React from "react";
import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { navigateBack } from "../store/slices/navigation";
import { addNewFolder } from "../store/slices/crud";
import { resetSort, sortByName, sortByTag } from "../store/slices/search";

const FileToolbar: React.FC = () => {
  const dispatch = useFileSystemDispatch();
  const currentPath = useFileSystemSelector((state) => state.navigator.currentPath);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => dispatch(navigateBack())}
        disabled={currentPath.length === 0}
        className="px-3 py-1 bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-50"
      >
        ← Back
      </button>
      <button
        className="px-3 py-1 bg-green-800 rounded hover:bg-green-600"
        onClick={() => dispatch(addNewFolder())}
      >
        New Folder
      </button>
      <button onClick={() => dispatch(resetSort())} className="px-3 py-1 border rounded hover:bg-white hover:text-black">
        Clear Sort
      </button>
      <button onClick={() => {
        dispatch(sortByName())
      }} className="px-3 py-1 border rounded hover:bg-white hover:text-black">
        By Name
      </button>
      <button onClick={() => dispatch(sortByTag())} className="px-3 py-1 border rounded hover:bg-white hover:text-black">
        By Tag
      </button>
    </div>
  );
};

export default FileToolbar;
