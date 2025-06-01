import React from "react";

interface FileSorterProps {
  sorted: boolean;
  onToggle: () => void;
}

export const FileSorter: React.FC<FileSorterProps> = ({ sorted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
    >
      {sorted ? "Quitar Orden" : "Ordenar por Nombre"}
    </button>

  );
};
