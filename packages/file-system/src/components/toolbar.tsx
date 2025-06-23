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
}

export const Toolbar: React.FC<ViewerHeaderProps> = (props) => {
  const {tree, currentPath, searchInput, setSearchInput, currentViewMode, setCurrentViewMode, sortType, setSortType, isTagView, setIsTagView} = props;

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row items-center justify-between">
        <ToolbarInfo count={tree?.length ?? 0} path={currentPath} />
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
