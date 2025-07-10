import React from 'react';
import { HavenFile } from '@haven/core/shared';
import { NodeActions } from './nodeActions';

import {
  Folder,
  FolderOpen,
  FileText,
  HardDrive,
} from '@phosphor-icons/react';

interface TreeNodeProps {
  node: IHavenDirectory | HavenFile;
  expanded: Record<string, boolean>;
  selectedNodeId: string | null;
  toggleExpandDirectory: (nodeId: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  handleViewFile: (file: HavenFile | IHavenDirectory | null) => void;
  setPreviewFile: (file: HavenFile | IHavenDirectory | null) => void;
}

function structureDesignAndStructure(node: IHavenDirectory | HavenFile | (IHavenDirectory & { parentId: unknown }) | (HavenFile & {
  parentId: unknown
}), isOpen) {
  const isBucketRoot = node.type === 'directory' && 'isBucketRoot' in node && node.isBucketRoot === true;

  return <>
    {node.type === 'directory' ? (
      <div className="flex items-center gap-2">
        {isBucketRoot ? (
          <HardDrive size={18} weight="bold" />
        ) : isOpen ? (
          <FolderOpen size={18} weight="bold" />
        ) : (
          <Folder size={18} weight="bold" />
        )}
        <span>{node.name}</span>
      </div>
    ) : (
      <div className="flex justify-between items-center w-full gap-2">
        <div className="flex items-center gap-2">
          <FileText size={18} weight="regular" className="text-white"/>
          <span>{node.name}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {node.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-neutral-800 p-1 rounded-md text-xs text-white"
            >
          {tag}
        </span>
          ))}
        </div>
      </div>
    )}
  </>;
}

export const TreeNode: React.FC<TreeNodeProps> = (props) => {
  const {
    node,
    expanded,
    selectedNodeId,
    toggleExpandDirectory,
    setSelectedNodeId,
    handleViewFile,
    setPreviewFile,
  } = props;

  const isOpen = node.type === 'directory' && expanded[node.id];
  const isSelected = selectedNodeId === node.id;

  const handleDoubleClick = () => {
    if (node.type === 'directory') {
      toggleExpandDirectory(node.id);
    } else {
      handleViewFile(node);
    }
  };

  const handleClick = () => {
    setPreviewFile(node);
  };

  const handleAuxClick = () => {
    setSelectedNodeId(node.id);
  };

  return (
    <li key={node.id} className="mb-1">
      <div
        className={`flex items-center cursor-pointer hover:bg-neutral-600 rounded-lg p-1 ${
          isSelected ? 'bg-blue-700/30' : ''
        }`}
        onAuxClick={handleAuxClick}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {structureDesignAndStructure(node, isOpen)}
      </div>

      {isSelected && <NodeActions node={node}/>}

      {isOpen && node.type === 'directory' && (
        <ul className="ml-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expanded={expanded}
              selectedNodeId={selectedNodeId}
              toggleExpandDirectory={toggleExpandDirectory}
              setSelectedNodeId={setSelectedNodeId}
              handleViewFile={handleViewFile}
              setPreviewFile={setPreviewFile}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
