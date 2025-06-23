import React from "react";

interface Props {
  count: number;
  path: string;
}

export const ToolbarInfo: React.FC<Props> = ({ count, path }) => {
  return (
    <p className="text-sm text-gray-300">
      {count} {count === 1 ? "element" : "elements"}
      {path && <span className="ml-2 text-gray-400">/ {path}</span>}
    </p>
  );
};
