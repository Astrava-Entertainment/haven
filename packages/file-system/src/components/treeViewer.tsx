import React, { useState } from "react";
import { IHavenDirectory } from "../common/interfaces.ts";
import {EHavenFileActions} from "../common/enums.ts";

import {HavenFile} from '/@astrava/core/src/common/havenFile.ts'

interface TreeViewerProps {
  tree: (IHavenDirectory | HavenFile)[];
  selectedFile: HavenFile | null;
  setSelectedFile: (file: HavenFile | null) => void;
}

//  This is for bubbling
interface  IActionList {
  action: string,
  nodeId: string,
}

export const TreeViewer: React.FC<TreeViewerProps> = ({ tree, selectedFile, setSelectedFile }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  //  This is for bubbling
  const [currentAction, setCurrentAction] = useState<IActionList>(null);

  const toggleExpand = (nodeId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleDoubleClick = (node: IHavenDirectory | HavenFile) => {
    if (node.type === "directory") {
      toggleExpand(node.id);
    }
    if (node.type === "file") {
      setSelectedFile(node as HavenFile);
    }
  };

  const handleToggleActionList = (node: IHavenDirectory | HavenFile) => {
    setSelectedNodeId(node.id);
  };

  const handleAction = (action, node) => {
    console.log(`Action: ${action} on ${node.name}`)
  }

  const actions = Object.entries(EHavenFileActions);
  const renderActions = (node: IHavenDirectory | HavenFile) => {
    return (
      <div className="ml-2 text-sm space-x-2 text-blue-400">
        {actions.map(([key, value]) => (
          <button key={key} onClick={() => handleAction(value, node)}>
            {value}
          </button>
        ))}
      </div>
    );
  };

  const renderNode = (node: IHavenDirectory | HavenFile) => {
    const isOpen = node.type === "directory" && expanded[node.id];

    return (
      <li key={node.id} className="mb-1">
        <div
          className={`flex items-center cursor-pointer ${selectedNodeId === node.id ? "bg-blue-700/30 rounded" : ""}`}
          onAuxClick={() => handleToggleActionList(node)}
          onDoubleClick={() => handleDoubleClick(node)}
        >
          <span>{node.type === "directory" ? (isOpen ? "📂" : "📁") : "📄"} {node.name}</span>
        </div>

        {selectedNodeId === node.id && renderActions(node)}

        {isOpen && node.type === "directory" && (
          <ul className="ml-4">
            {node.children.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div>
      <ul>
        {tree.map((node) => renderNode(node))}
      </ul>
    </div>
  );
};
