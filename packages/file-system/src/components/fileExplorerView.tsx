import React, { useEffect } from "react";
import { getFileIcon } from "../utils/getFileIcon";
// @ts-ignore
import fileTree from "../../examples/structure.json";

import { loadTree, navigateInto } from "../store/slices/fileExplorer";
import { addFile } from "../../../core/src/store/slices/render/filesSlice";

import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { useCoreDispatch } from "../../../core/src/store/hooks";
import { HavenFileNode } from "../utils/directory";
import { HavenFile } from "packages/core/src/common/file";

const FileExplorerView: React.FC = () => {
  const fileSystemDispatch = useFileSystemDispatch();
  const coreDispatch = useCoreDispatch();

  const { fullTree, visibleNodes } = useFileSystemSelector(
    (state) => state.fileExplorer
  );

  useEffect(() => {
    fileSystemDispatch(loadTree(fileTree));
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

    coreDispatch(addFile(havenFile));
  };

  return (
    <div>
      {fullTree.length > 0 && (
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
                  cursor: node.type === "directory" ? "pointer" : "default",
                  transition: "background-color 0.2s",
                  backgroundColor: "#101010",
                }}
              >
                <div style={{ fontSize: "2rem" }}>{getFileIcon(node.name)}</div>
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
      )}
    </div>
  );
};

export default FileExplorerView;
