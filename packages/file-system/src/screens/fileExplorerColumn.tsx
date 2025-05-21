import React, { useEffect } from "react";
import { getFileIcon } from "../utils/getFileIcon";
// @ts-ignore
import fileTree from "../../examples/structure.json";

import {
  addNewFolder,
  loadTree,
  navigateInto,
  selectNode,
} from "../store/slices/fileExplorer";
import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { HavenFileNode } from "../utils/directory";

const FileExplorer: React.FC = () => {
  const dispatch = useFileSystemDispatch();

  const { fullTree, visibleNodes } = useFileSystemSelector(
    (state) => state.fileExplorer
  );

  useEffect(() => {
    dispatch(loadTree(fileTree));
  }, [dispatch]);

  const handleSelectNode = (node: HavenFileNode) => {
    dispatch(selectNode(node));
  };

  const handleNavigateSubdirectory = (dirName: string) => {
    dispatch(navigateInto(dirName));
  };

  return (
    <div>
      <div className="navbar gap-x-2">
        <button
          className="bg-green rounded-lg p-2"
          onClick={() => dispatch(addNewFolder())}
        >
          New
        </button>

        <button className="bg-red rounded-lg p-2">Delete</button>
      </div>
      {fullTree.length > 0 && (
        <ul>
          {visibleNodes.length > 0 ? (
            visibleNodes.map((node, index) => (
              <li
                key={index}
                onClick={() => {
                  handleSelectNode(node);
                  if (node.type === "directory") {
                    handleNavigateSubdirectory(node.name);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: node.type === "directory" ? "pointer" : "default",
                  padding: "0.25rem",
                  borderRadius: "0.25rem",
                  backgroundColor:
                    selectedNode?.name === node.name
                      ? "rgba(0,0,0,0.1)"
                      : "transparent",
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
