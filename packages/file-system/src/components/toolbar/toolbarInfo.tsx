import React, { useState } from "react";
import clsx from "clsx";

// @ts-ignore
import copyIcon from '../../../assets/copy.svg';
import { Copy } from '@phosphor-icons/react'

interface Props {
  count: number;
  path: string;
  onNavigateToPath?: (index: number) => void;
}

function handlePathSegments(index: number, fullSegments: string[], rootFolder: string, segment: string, onNavigateToPath: ((index: number) => void) | undefined | {
  (index: number): (void | undefined)
}) {
  const isLast = index === fullSegments.length - 1;
  const displayName = index === 0 ? rootFolder : segment;

  return (
    <React.Fragment key={index}>
      {index > 0 && <span className="text-gray-500">/</span>}
      <button
        type="button"
        disabled={isLast || !onNavigateToPath}
        className={clsx(
          "text-sm",
          isLast
            ? "text-white font-semibold cursor-default"
            : "text-blue-400 hover:underline transition"
        )}
        onClick={() => {
          if (index === 0) {
            onNavigateToPath?.(0);
          } else {
            onNavigateToPath?.(index - 1);
          }
        }}

      >
        {displayName}
      </button>
    </React.Fragment>
  );
}

export const ToolbarInfo: React.FC<Props> = ({ count, path, onNavigateToPath }) => {
  const segments = path.split(" / ").filter(Boolean);
  const fullSegments = ["root", ...segments];
  const rootFolder = fullSegments[0];


  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    const rawPath = segments.join("/");
    navigator.clipboard.writeText(rawPath).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="text-sm text-gray-300 flex items-center gap-2 flex-wrap">
      <p>
        {count} {count === 1 ? "element" : "elements"}
      </p>

      {fullSegments.length > 0 && (
        <div className="flex items-center gap-1 text-gray-400 flex-wrap">
          {fullSegments.map((segment, index) => {
            return handlePathSegments(index, fullSegments, rootFolder, segment, onNavigateToPath);
          })}

          <button
            onClick={handleCopyPath}
            className="ml-2 p-1 hover:bg-neutral-700 rounded transition"
            title="Copy path"
          >
            <Copy size={20} />
          </button>

          {copied && <span className="text-green-400 text-xs ml-1">Copied!</span>}
        </div>
      )}
    </div>
  );
};
