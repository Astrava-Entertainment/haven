import React from "react";
import { HavenFile } from "@haven/core/shared";
import { Searchbar } from "@haven/file-system";
import {ToolbarInfo, ToolbarSort, ToolbarControls} from './toolbar/index';

interface ViewerHeaderProps {
  tree: (IHavenDirectory | HavenFile)[];
  searchInput: string;
  setSearchInput: (value: string) => void;
  currentViewMode: boolean;
  setCurrentViewMode: (value: boolean) => void;
  sortType: ESortType;
  setSortType: (value: ESortType) => void;
  isTagView: boolean;
  setIsTagView: (value: boolean) => void;
  currentPath: string;
  directoryStack: (HavenFile | IHavenDirectory)[];
  setDirectoryStack: (value: (HavenFile | IHavenDirectory)[]) => void;
  setCurrentDirectory: (value: HavenFile | IHavenDirectory | null) => void;
}

export const Toolbar: React.FC<ViewerHeaderProps> = (props) => {
  const { tree, currentPath, searchInput, setSearchInput, currentViewMode,
    setCurrentViewMode, sortType, setSortType, isTagView, setIsTagView,
    directoryStack, setDirectoryStack, setCurrentDirectory } = props;

  function handleNavigatePath(index: number) {
    if (index === -1) {
      setDirectoryStack([]);
      setCurrentDirectory(null);
    } else {
      const newStack = directoryStack.slice(0, index);
      const newDirectory = directoryStack[index] || null;

      setDirectoryStack(newStack);
      setCurrentDirectory(newDirectory);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row items-center justify-between">
        <ToolbarInfo
          count={tree?.length ?? 0}
          path={currentPath}
          onNavigateToPath={(index) => {
            handleNavigatePath(index);
          }}
        />

        <div className="flex gap-2 items-center">
          <ToolbarSort sortType={sortType} setSortType={setSortType} />
          <Searchbar value={searchInput} onChange={setSearchInput} />
          <ToolbarControls
            isTagView={isTagView}
            setIsTagView={setIsTagView}
            currentViewMode={currentViewMode}
            setCurrentViewMode={setCurrentViewMode}
          />
        </div>
      </div>
      <hr className="border-gray-600 mt-2" />
    </div>
  );
};
