import React, { useRef } from 'react';
import { useClickOutside } from '@haven/core/utils';
import { HavenFile } from '@haven/core/shared';
import { TreeNode } from './tree-viewer/index';
import {useTreeState} from '@haven/file-system/utils';

interface TreeViewerProps {
  tree: (IHavenDirectory | HavenFile)[];
  handleViewFile: (file: HavenFile | IHavenDirectory | null) => void;
  setPreviewFile: (file: HavenFile | IHavenDirectory | null) => void;
}

export const TreeViewer: React.FC<TreeViewerProps> = (props) => {
  const { tree, setPreviewFile, handleViewFile } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    expanded,
    selectedNodeId,
    toggleExpandDirectory,
    setSelectedNodeId,
  } = useTreeState();

  useClickOutside({
    containerRef,
    onClickOutside: () => setSelectedNodeId(null),
  });

  return (
    <div ref={containerRef}>
      <ul>
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            expanded={expanded}
            selectedNodeId={selectedNodeId}
            toggleExpandDirectory={toggleExpandDirectory}
            setSelectedNodeId={setSelectedNodeId}
            handleViewFile={handleViewFile}
            setPreviewFile={setPreviewFile}
          />
        ))}
      </ul>
    </div>
  );
};
