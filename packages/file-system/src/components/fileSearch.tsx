import React from "react";
import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { setSearchInput } from "../store/slices/search";

const FileSearch: React.FC = () => {
  const dispatch = useFileSystemDispatch();
  const searchInput = useFileSystemSelector((state) => state.searcher.searchInput);

  return (
    <input
      type="text"
      placeholder="Search files..."
      value={searchInput}
      onChange={(e) => dispatch(setSearchInput(e.target.value))}
      className="w-full px-4 py-2 rounded bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default FileSearch;
