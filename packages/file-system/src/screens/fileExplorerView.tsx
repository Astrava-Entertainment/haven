import "@astrava/design-system/dist/style.css";
import React, { useEffect } from "react";
import { getFileIcon } from "../utils/getFileIcon";
// @ts-ignore
import fileTree from "../../examples/structure.json";

import { loadTree, navigateInto } from "../store/slices/fileExplorer";
import {
  setFile,
  popFile,
} from "../../../core/src/store/slices/render/filesSlice";

import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import {
  useCoreDispatch,
  useCoreSelector,
} from "../../../core/src/store/hooks";
import { HavenFileNode } from "../utils/directory";
import { HavenFile } from "packages/core/src/common/file";

import RenderApp from "../../../render/src/index";
import { normalizeTree } from "../utils/treeNormalizer";

const FileExplorerView: React.FC = () => {
  const fileSystemDispatch = useFileSystemDispatch();
  const coreDispatch = useCoreDispatch();
  const openFiles = useCoreSelector((state) => state.core.render);
  const currentFile = openFiles[0];

  const { fullTree, visibleNodes } = useFileSystemSelector(
    (state) => state.fileExplorer
  );


  useEffect(() => {
    const normalized = fileTree.map(normalizeTree);
    fileSystemDispatch(loadTree(normalized));
  }, [fileSystemDispatch]);

  const handleNavigateSubdirectory = (dirName: string) => {
    fileSystemDispatch(navigateInto(dirName));
  };

  const handleReadFile = (havenNode: HavenFileNode) => {
    const fileExt = havenNode.name.split(".").pop()?.toLowerCase();

    const havenFile: HavenFile = {
      name: havenNode.name,
      ext: fileExt || ".unk",
      ref: "",
      size: 0,
      type: havenNode.type,
      url: havenNode.url,
      havenRef: [],
      tags: [],
      historyTree: [],
    };

    coreDispatch(setFile(havenFile));
  };

  const handleCloseFile = () => {
    if (currentFile) {
      coreDispatch(popFile(currentFile));
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {currentFile ? (
        <div className="mt-4 p-4 border border-neutral-700 rounded bg-neutral-900">
          <div className="mb-4">
            <button
              onClick={handleCloseFile}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
          <RenderApp file={currentFile} />
        </div>
      ) : (
        fullTree.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "1rem",
            }}
          >
            {visibleNodes.length > 0 ? (
              visibleNodes.map((node, index) => (
                <div
                  key={index}
                  onClick={() =>
                    node.type === "directory"
                      ? handleNavigateSubdirectory(node.name)
                      : handleReadFile(node)
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.75rem",
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    backgroundColor: "#101010",
                  }}
                >
                  <div style={{ fontSize: "2rem" }}>
                    {getFileIcon(node.name)}
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "0.5rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {node.name}
                  </div>
                </div>
              ))
            ) : (
              <div>No files found.</div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FileExplorerView;
