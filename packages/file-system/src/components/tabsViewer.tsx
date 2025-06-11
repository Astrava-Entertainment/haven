import React, { useState } from "react";
import {TagsViewer} from "./tagsViewer.tsx";
import {RecentFilesViewer} from "./recentFilesViewer.tsx";

interface ITabsViewer {
  hydratedTagsMap: Map<string, HavenFile[]>;
  recentlyOpenedFiles: HavenFile[];
  handleViewFile: (file: HavenFile | null) => void;
  setPreviewFile: (file: HavenFile | null) => void;
}

type Props = ITabsViewer;

export const TabsViewer: React.FC<Props> = (props) => {
  const { hydratedTagsMap, recentlyOpenedFiles, handleViewFile, setPreviewFile } = props;

  const [activeTab, setActiveTab] = useState<"tags" | "recent">("tags");

  return (
    <div className="max-h-[250px] min-h-[250px] overflow-y-auto rounded-lg bg-neutral-800 p-3 shadow-inner border border-neutral-700">
      <div className="flex border-b border-neutral-600 mb-3 select-none">
        <h2
          onClick={() => setActiveTab("tags")}
          className={`cursor-pointer px-4 py-2 text-sm font-semibold tracking-wide ${
            activeTab === "tags"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Tags View
        </h2>
        <h2
          onClick={() => setActiveTab("recent")}
          className={`cursor-pointer px-4 py-2 text-sm font-semibold tracking-wide ${
            activeTab === "recent"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Recently Opened
        </h2>
      </div>

      {activeTab === "tags" && (
        <TagsViewer
          maxShowTags={1}
          tagsMap={hydratedTagsMap}
          handleViewFile={handleViewFile}
          setPreviewFile={setPreviewFile}
        />
      )}

      {activeTab === "recent" && (
        <RecentFilesViewer
          files={recentlyOpenedFiles}
          handleViewFile={handleViewFile}
          setPreviewFile={setPreviewFile}
        />
      )}
    </div>
  );
};
