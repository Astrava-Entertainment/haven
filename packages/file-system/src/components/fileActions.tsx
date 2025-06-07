import React from "react";
import { HavenFile } from "../../../core/src/common/havenFile";
import { IHavenDirectory } from "~/common/interfaces";

interface FileActionsProps {
  currentViewMode: boolean;
  setCurrentViewMode: (view: boolean) => void;
  setSelectedFile: (file: HavenFile | null) => void;
  setCurrentDirectory: (file: HavenFile | IHavenDirectory | null) => void;
}

export const FileActions: React.FC<FileActionsProps> = ({ setSelectedFile, setCurrentDirectory, setCurrentViewMode, currentViewMode }) => {
  const handleHome = () => {
    console.log("Home: Going to root directory");
    setSelectedFile(null);
    setCurrentDirectory(null);
  };

  const handleParent = () => {
    console.log("Parent: Going to parent directory");
  };

  const handleUndo = () => {
    console.log("Undo: Undoing last action");
  };

  const handleRedo = () => {
    console.log("Redo: Redoing undone action");
  };

  const handleViewMode = () => {
    console.log("View: Change main view");
    setCurrentViewMode(!currentViewMode);
  };


  return (
    <div className="flex gap-2 p-2">
      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleHome}
      >
        🏠 Home
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleParent}
      >
        🔼 Parent
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleUndo}
      >
        ↩️ Undo
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleRedo}
      >
        ↪️ Redo
      </button>

      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleViewMode}
      >
        {currentViewMode ? "📅 Grid" : "📃 Lista"}
      </button>

    </div>
  );
};
