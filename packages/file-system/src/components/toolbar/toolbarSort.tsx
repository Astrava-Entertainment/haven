import React, { useState, useRef } from "react";

import { Funnel } from '@phosphor-icons/react'

import { useClickOutside } from "@haven/core/utils";

// TODO: Type not working d.ts
export enum ESortType {
  None,
  Name,
  Tag
}

interface Props {
  sortType: ESortType;
  setSortType: (value: ESortType) => void;
}

export const ToolbarSort: React.FC<Props> = ({ sortType, setSortType }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ignoredRef = useRef<HTMLDivElement | null>(null);

  useClickOutside({
    containerRef,
    ignoredRefs: [ignoredRef],
    onClickOutside: () => setShowDropdown(false),
  });

  const sortOptions = [
    { label: "None", value: ESortType.None },
    { label: "Name (A-Z)", value: ESortType.Name },
    { label: "Tag (A-Z)", value: ESortType.Tag },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md"
        title="Sort"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <Funnel size={20}/>
      </button>

      {showDropdown && (
        <div
          ref={ignoredRef}
          className="absolute top-10 right-0 z-20 bg-neutral-800 border border-neutral-600 rounded shadow-md text-sm text-white w-40"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-2 hover:bg-neutral-700 ${
                sortType === option.value ? "bg-neutral-700 font-semibold" : ""
              }`}
              onClick={() => {
                setSortType(option.value);
                setShowDropdown(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
