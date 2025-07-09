import React from "react";
import { SquaresFour, List, Tag, FileText } from '@phosphor-icons/react';

interface Props {
  isTagView: boolean;
  setIsTagView: (value: boolean) => void;
  currentViewMode: boolean;
  setCurrentViewMode: (value: boolean) => void;
}

export const ToolbarControls: React.FC<Props> = (props) => {
  const { isTagView, setIsTagView, currentViewMode, setCurrentViewMode } = props;

  return (
    <>
      {!isTagView && (
        <button
          className="px-3 py-1 rounded-md text-sm text-white bg-neutral-700 hover:bg-neutral-600 flex items-center gap-2"
          onClick={() => setCurrentViewMode(!currentViewMode)}
        >
          {currentViewMode ? (
            <>
              <SquaresFour size={16} /> Grid
            </>
          ) : (
            <>
              <List size={16} /> List
            </>
          )}
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
        className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        {isTagView ? (
          <>
            <FileText size={16} /> File view
          </>
        ) : (
          <>
            <Tag size={16} /> Tags view
          </>
        )}
      </button>
    </>
  );
};
