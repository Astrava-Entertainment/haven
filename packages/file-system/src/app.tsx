import React, { useEffect } from "react";
import "@astrava/design-system/dist/style.css";

// @ts-ignore
import fileTree from "../examples/structure.json";
import {
  loadTree,
  navigateBack,
  setSearchInput,
} from "./store/slices/fileExplorer";
import { useFileSystemDispatch, useFileSystemSelector } from "./store/hooks";
import FileExplorerView from "./screens/fileExplorerView";
import FileExplorer from "./screens/fileExplorerColumn";
import { HavenFileNode } from "./utils/directory";
import { normalizeTree } from "./utils/treeNormalizer";

const App: React.FC = () => {
  const dispatch = useFileSystemDispatch();
  const { currentPath, searchInput, fullTree } = useFileSystemSelector(
    (state) => state.fileExplorer
  );

  useEffect(() => {
    const normalized = fileTree.map(normalizeTree);
    dispatch(loadTree(normalized));
  }, [dispatch]);

  const handleNavigateBack = () => {
    dispatch(navigateBack());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchInput(e.target.value));
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 space-y-4 font-sans">
      <h2 className="text-3xl font-semibold">📁 File Explorer</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={handleNavigateBack}
          disabled={currentPath.length === 0}
          className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 transition"
        >
          ← Back
        </button>
        <input
          type="text"
          placeholder="Search files..."
          value={searchInput}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 rounded bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-row gap-4 h-screen p-4 bg-neutral-900 text-white">
        {fullTree.length > 0 && (
          <div className="w-72 h-full bg-neutral-800 rounded-lg p-4 shadow-inner overflow-y-auto">
            <FileExplorer />
          </div>
        )}
        {fullTree.length > 0 && (
          <div className="flex-1 h-full bg-neutral-800 rounded-lg p-4 shadow-inner overflow-y-auto">
            <FileExplorerView />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
