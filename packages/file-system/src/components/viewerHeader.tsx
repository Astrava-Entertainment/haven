import React, { useState, useRef, useEffect } from "react";
import { IHavenDirectory, ISortType } from "../common/interfaces.ts";
import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { SearchBar } from "./fileSearcher.tsx";

import sortIcon from "../../../core/src/assets/icons/funnel.svg";
import { useClickOutside } from "../../../core/src/utils/useClickOutside.tsx";

interface ViewerHeaderProps {
  tree: (IHavenDirectory | HavenFile)[];
  searchInput: string;
  setSearchInput: (value: string) => void;
  currentViewMode: boolean;
  setCurrentViewMode: (value: boolean) => void;
  sortType: ISortType;
  setSortType: (value: ISortType) => void;
  isTagView: boolean;
  setIsTagView: (value: boolean) => void;
  currentPath: string;
}

type Props = ViewerHeaderProps;


export const ViewerHeader: React.FC<Props> = (props) => {
  const { tree, currentPath, searchInput, setSearchInput, currentViewMode, setCurrentViewMode, sortType, setSortType, isTagView, setIsTagView } = props;
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ignoredRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setShowSortDropdown(false), [ignoredRef]);

  const sortOptions: { label: string; value: ISortType }[] = [
    { label: "Ninguno", value: ISortType.None },
    { label: "Nombre (A-Z)", value: ISortType.Name },
    { label: "Tag (A-Z)", value: ISortType.Tag },
  ];

  return (
    <div className="flex gap-2 flex-col p-4">
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-gray-300">
          {tree?.length ?? 0} {tree?.length === 1 ? "elemento" : "elementos"}
          {currentPath && <span className="ml-2 text-gray-400">/ {currentPath}</span>}
        </p>

        <div className="flex gap-2 items-center relative">
          <button
            className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md"
            title="Ordenar"
            onClick={() => setShowSortDropdown((prev) => !prev)}
          >
            <img src={sortIcon} className="text-white w-4 h-4" alt="Sort Icon" />
          </button>

          {showSortDropdown && (
            <div
              ref={ignoredRef}
              className="absolute top-10 right-20 z-20 bg-neutral-800 border border-neutral-600 rounded shadow-md text-sm text-white w-40">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-700 ${sortType === option.value ? "bg-neutral-700 font-semibold" : ""
                    }`}
                  onClick={() => {
                    setSortType(option.value);
                    setShowSortDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <SearchBar value={searchInput} onChange={setSearchInput} />

          {!isTagView && (
            <button
              className={`px-3 py-1 rounded-md text-sm text-white ${isTagView ? "bg-neutral-500 cursor-not-allowed" : "bg-neutral-700 hover:bg-neutral-600"}`}
              onClick={() => {
                if (!isTagView) setCurrentViewMode(!currentViewMode);
              }}
              disabled={isTagView}
            >
              {currentViewMode ? "🟦 Grid" : "📃 Lista"}
            </button>
          )}

          <button
            onClick={() => {
              setIsTagView((prev) => {
                const newVal = !prev;
                if (newVal) {
                  setCurrentViewMode(false);
                }
                return newVal;
              });
            }}
            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isTagView ? 'File view' : 'Tags view'}
          </button>

        </div>
      </div>
      <hr className="border-gray-600 mt-2" />
    </div>
  );
};
