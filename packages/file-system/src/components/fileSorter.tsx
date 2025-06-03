import React from "react";
import {ISortType} from "~/common/interfaces.ts";

interface FileSorterProps {
  sortType: ISortType;
  onChange: () => void;
}

export const FileSorter: React.FC<FileSorterProps> = ({ sortType, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label>Ordenar por:</label>
      <select
        value={sortType}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-800 text-white border border-neutral-600 p-1 rounded"
      >
        <option value="None">Ninguno</option>
        <option value="Name">Nombre (A-Z)</option>
        <option value="Tag">Tag (A-Z)</option>
      </select>
    </div>
  );
};
