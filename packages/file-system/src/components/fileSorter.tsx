import React from "react";

interface IFileSorter {
  sortType: ESortType;
  onChange: (arg: ESortType) => void;
}

type Props =  IFileSorter;

export const FileSorter: React.FC<Props> = (props) => {
  const { sortType, onChange } = props;
  return (
    <div className="flex items-center gap-2">
      <label>Order by:</label>
      <select
        value={sortType}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-800 text-white border border-neutral-600 p-1 rounded"
      >
        <option value="None">None</option>
        <option value="Name">Name (A-Z)</option>
        <option value="Tag">Tag (A-Z)</option>
      </select>
    </div>
  );
};
