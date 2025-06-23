import React from "react";

interface Props {
  isTagView: boolean;
  setIsTagView: (value: boolean) => void;
  currentViewMode: boolean;
  setCurrentViewMode: (value: boolean) => void;
}

export const ToolbarControls: React.FC<Props> = (props) => {
  const {isTagView, setIsTagView, currentViewMode, setCurrentViewMode} = props;
  return (<>
      {!isTagView && (<button
          className="px-3 py-1 rounded-md text-sm text-white bg-neutral-700 hover:bg-neutral-600"
          onClick={() => setCurrentViewMode(!currentViewMode)}
        >
          {currentViewMode ? "🟦 Grid" : "📃 List"}
        </button>)}
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
        {isTagView ? "File view" : "Tags view"}
      </button>
    </>);
};
