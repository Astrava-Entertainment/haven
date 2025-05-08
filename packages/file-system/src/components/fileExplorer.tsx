import React, { useEffect } from "react";
import { getFileIcon } from "../utils/getFileIcon";
// @ts-ignore
import fileTree from "../../examples/structure.json";

import { loadTree, navigateInto } from "../store/slices/fileExplorer";
import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";

const FileExplorer: React.FC = () => {
  const dispatch = useFileSystemDispatch();

  const { fullTree, visibleNodes } = useFileSystemSelector(
    (state) => state.fileExplorer
  );

  // 📦 Load tree on mount
  useEffect(() => {
    dispatch(loadTree(fileTree));
  }, [dispatch]);

  const handleNavigateSubdirectory = (dirName: string) => {
    dispatch(navigateInto(dirName));
  };

  return (
    <div>
      {fullTree.length > 0 && (
        <ul>
          {visibleNodes.length > 0 ? (
            visibleNodes.map((node, index) => (
              <li
                key={index}
                onClick={() =>
                  node.type === "directory"
                    ? handleNavigateSubdirectory(node.name)
                    : undefined
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: node.type === "directory" ? "pointer" : "default",
                  padding: "0.25rem",
                  borderRadius: "0.25rem",
                }}
              >
                {getFileIcon(node.name)}
                {node.name}
              </li>
            ))
          ) : (
            <li>No files found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default FileExplorer;
