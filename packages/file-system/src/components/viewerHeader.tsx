import React, { useState, useRef, useEffect } from "react";
import { IHavenDirectory, ISortType } from "../common/interfaces.ts";
import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { SearchBar } from "./fileSearcher.tsx";

import sortIcon from "../../../core/src/assets/icons/funnel.svg";

interface ViewerHeaderProps {
  tree: (IHavenDirectory | HavenFile)[];
  searchInput: string;
  setSearchInput: (value: string) => void;
  currentViewMode: boolean;
  setCurrentViewMode: (value: boolean) => void;
  sortType: ISortType;
  setSortType: (value: ISortType) => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({tree, searchInput, setSearchInput, currentViewMode, setCurrentViewMode, sortType, setSortType }) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div className="absolute top-10 right-20 z-20 bg-neutral-800 border border-neutral-600 rounded shadow-md text-sm text-white w-40">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-700 ${
                    sortType === option.value ? "bg-neutral-700 font-semibold" : ""
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

          <button
            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md text-sm"
            onClick={() => setCurrentViewMode(!currentViewMode)}
          >
            {currentViewMode ? "🟦 Grid" : "📃 Lista"}
          </button>
        </div>
      </div>
      <hr className="border-gray-600 mt-2" />
    </div>
  );
};
