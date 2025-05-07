import React, { useState, useEffect } from "react";
import { getFileIcon } from "../utils/getFileIcon";
// @ts-ignore
import fileTree from "../../examples/structure.json";

type FileNode = {
  name: string;
  type: "file" | "directory";
  children?: FileNode[];
  url?: string;
  loadTime?: number;
  cached?: boolean;
};

const FileExplorer: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [fullTree, setFullTree] = useState<FileNode[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<FileNode[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // 🔁 Flatten the entire tree for searching
  const flattenFileTree = (nodes: FileNode[]): FileNode[] => {
    const result: FileNode[] = [];
    for (const node of nodes) {
      if (node.type === "file") {
        result.push(node);
      } else if (node.type === "directory" && node.children) {
        result.push(...flattenFileTree(node.children));
      }
    }
    return result;
  };

  // 📁 Navigate into a directory
  const handleNavigateSubdirectory = (dirName: string) => {
    const newPath = [...currentPath, dirName];
    const dir = findDirectoryAtPath(fullTree, newPath);
    if (dir?.children) {
      setVisibleNodes(dir.children);
      setCurrentPath(newPath);
    }
  };

  // ⬅️ Navigate back
  const handleNavigateBack = () => {
    if (currentPath.length === 0) return;
    const newPath = currentPath.slice(0, -1);
    const dir = findDirectoryAtPath(fullTree, newPath);
    if (dir) {
      setVisibleNodes(dir.children || []);
      setCurrentPath(newPath);
    }
  };

  // 🔎 Directory lookup
  const findDirectoryAtPath = (
    tree: FileNode[],
    path: string[]
  ): FileNode | null => {
    let current: FileNode[] = tree;
    let result: FileNode | null = null;

    for (const segment of path) {
      result =
        current.find((n) => n.name === segment && n.type === "directory") ||
        null;
      if (!result || !result.children) return null;
      current = result.children;
    }

    return { name: "", type: "directory", children: current };
  };

  // 🔠 Search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);
  };

  // 📦 Load tree from JSON on mount
  useEffect(() => {
    setFullTree(fileTree as FileNode[]);
    setVisibleNodes(fileTree as FileNode[]);
  }, []);

  // 🎯 Filtered nodes depending on search
  const displayedNodes =
    searchInput.trim().length > 0
      ? flattenFileTree(fullTree).filter((node) =>
          node.name.toLowerCase().includes(searchInput.toLowerCase())
        )
      : visibleNodes;

  return (
    <div>
      <h2>File Explorer</h2>
      <button onClick={handleNavigateBack} disabled={currentPath.length === 0}>
        Back
      </button>

      {fullTree.length > 0 && (
        <>
          <h3>Directory:</h3>
          <input
            type="text"
            placeholder="Search files..."
            value={searchInput}
            onChange={handleSearch}
          />
          <ul>
            {displayedNodes.length > 0 ? (
              displayedNodes.map((node, index) => (
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
        </>
      )}
    </div>
  );
};

export default FileExplorer;
