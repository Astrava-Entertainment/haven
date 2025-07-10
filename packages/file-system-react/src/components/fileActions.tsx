import React from "react";
import { HavenFile } from "@haven/core/shared";
import {
  House,
  ArrowUp,
  ArrowCounterClockwise,
  ArrowClockwise,
} from "@phosphor-icons/react";

interface FileActions {
  setSelectedFile: (file: HavenFile | null) => void;
  setCurrentDirectory: (file: HavenFile | IHavenDirectory | null) => void;
  setDirectoryStack: React.Dispatch<
    React.SetStateAction<(HavenFile | IHavenDirectory)[]>
  >;
  setPreviewFile: (file: HavenFile | null) => void;
}

type Props = FileActions;

export const FileActions: React.FC<Props> = ({
                                               setSelectedFile,
                                               setCurrentDirectory,
                                               setDirectoryStack,
                                               setPreviewFile,
                                             }) => {
  const handleHome = () => {
    console.log("Home: Going to root directory");
    setSelectedFile(null);
    setCurrentDirectory(null);
  };

  const handleParent = () => {
    console.log("Parent: Going to parent directory");
    setSelectedFile(null);
    setPreviewFile(null);
    setDirectoryStack((prev) => {
      const newStack = [...prev];
      const parent = newStack.pop() || null;
      setCurrentDirectory(parent);
      return newStack;
    });
  };

  const handleUndo = () => {
    console.log("Undo: Undoing last action");
  };

  const handleRedo = () => {
    console.log("Redo: Redoing undone action");
  };

  return (
    <div className="flex gap-2 p-2">
      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleHome}
      >
        <House size={20} />
      </button>

      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleParent}
      >
        <ArrowUp size={20} />
      </button>

      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleUndo}
      >
        <ArrowCounterClockwise size={20} />
      </button>

      <button
        className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
        onClick={handleRedo}
      >
        <ArrowClockwise size={20} />
      </button>
    </div>
  );
};
