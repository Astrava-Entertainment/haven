import React, {useEffect, useState} from 'react';
import {BucketStructure, isDirectoryNode, MainTreeToolbar, MainTreeView} from '@haven/file-system';

interface ITreeViewWrapper {
  setCurrentSelection: React.Dispatch<React.SetStateAction<IHavenTreeNode>>
}
export const TreeViewWrapper: React.FC<ITreeViewWrapper> = (props) => {
  const { setCurrentSelection } = props;

  const [currentTree, setCurrentTree] = useState<IHavenTreeNode[]>(BucketStructure)
  const [historyPath, setHistoryPath] = useState<IHavenTreeNode[]>(BucketStructure)

  const handleOpenNode = (node: IHavenTreeNode[]) => {
    const currentNode = node;
    const isDirectory = isDirectoryNode(currentNode)
    if (isDirectory) {
      setHistoryPath((prev) => [...prev, currentNode]);
      setCurrentTree(currentNode);
    } else {
      setCurrentSelection(node)
    }
  }

  const handleGoHome = () => {
    setCurrentTree(BucketStructure);
    setHistoryPath([]);
    setCurrentSelection(null);
  }

  const handleGoBack = () => {
    if (historyPath.length <= 0) return;

    const prevHistory = [...historyPath];
    const prevTree = prevHistory.slice(0, -1);

    setHistoryPath(prevHistory);
    setCurrentTree(prevTree);
  };

  return (
    <div>
      <button onClick={handleGoHome}>Home</button>
      <button onClick={handleGoBack}>Back</button>

      <MainTreeToolbar historyPath={historyPath} />
      <MainTreeView
        tree={currentTree}
        handleOpenNode={handleOpenNode}
        styles="bg-red-500"
      />
    </div>
  )
}
