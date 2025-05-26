import React, { useEffect } from "react";
import { FileExplorerProvider } from "./store/provider";
import FileExplorerApp from "./components/fileExplorerApp";
// @ts-ignore
import fileTree from "../examples/structure.json";
import { useFileSystemDispatch } from "./store/hooks";
import { loadTree } from "./store/slices/fileExplorer";
import { normalizeTree } from "./utils/treeNormalizer";

const FileExplorerWithInit = () => {
  const dispatch = useFileSystemDispatch();

  useEffect(() => {
    const normalized = fileTree.map(normalizeTree);
    dispatch(loadTree(normalized));
  }, [dispatch]);

  return <FileExplorerApp />;
};

export default function FileSystem() {
  return (
    <FileExplorerProvider>
      <FileExplorerWithInit />
    </FileExplorerProvider>
  );
}
