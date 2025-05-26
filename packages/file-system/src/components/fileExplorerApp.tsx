import React from "react";
import { useFileSystemSelector } from "../store/hooks";
import FileToolbar from "./FileToolbar";
import FileSearch from "./FileSearch";
import FileTreeView from "./FileTreeView";

const FileExplorerApp: React.FC = () => {
  const { fullTree } = useFileSystemSelector((state) => state.fileExplorer);

  return (
    <div className="space-y-4">
      <FileSearch />
      <FileToolbar />
      {fullTree.length > 0 ? (
        <div className="rounded-lg p-4 shadow-inner overflow-y-auto bg-neutral-800">
          <FileTreeView />
        </div>
      ) : (
        <div className="text-gray-400">No files loaded</div>
      )}
    </div>
  );
};

export default FileExplorerApp;
