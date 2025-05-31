import React from "react";

type SearchBarProps = {
  onSearchChange: (value: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search files..."
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full px-4 py-2 rounded bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchBar;
