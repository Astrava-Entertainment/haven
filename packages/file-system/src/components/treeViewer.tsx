import { HavenFile } from '@haven/core/shared';
import React, { useRef, useState } from 'react';
import {useClickOutside} from "@haven/core/utils/useClickOutside.tsx";

// TODO: types not working
interface ITreeViewer {
  tree: (IHavenDirectory | HavenFile)[];
  handleViewFile: (file: HavenFile | IHavenDirectory | null) => void;
  setPreviewFile: (file: HavenFile | IHavenDirectory | null) => void;
}

type Props = ITreeViewer;

// // TODO: This must be in enum.d.ts
// enum EHavenFileActions {
//   Rename,
//   Paste,
//   Copy,
//   Cut,
//   Delete
// }


export const TreeViewer: React.FC<Props> = (props) => {
  const { tree, setPreviewFile, handleViewFile } = props;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside({
    containerRef: containerRef,
    onClickOutside: () => setSelectedNodeId(null),
    ignoredRefs: [],
  });

  const toggleExpandDirectory = (nodeId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleToggleActionList = (node: IHavenDirectory | HavenFile) => {
    setSelectedNodeId(node.id);
  };

  const handleAction = (action: string, node: HavenFile) => {
    console.log(`Action: ${action} on ${node.name}`);
  };

  const handleDoubleClick = (node: IHavenDirectory | HavenFile) => {
    if (node.type === 'directory') {
      toggleExpandDirectory(node.id);
    }
    if (node.type === 'file') {
      handleViewFile(node as HavenFile);
    }
  };

  const handleShowFileInfo = (node: IHavenDirectory | HavenFile) => {
    if (node.type === 'file') {
      setPreviewFile(node);
    }
  };

  const actions = Object.entries(EHavenFileActions);
  const renderActions = (node: IHavenDirectory | HavenFile) => {
    return (
      <div className="ml-2 text-sm space-x-2 text-blue-400">
        {actions.map(([key, value]) => (
          <button key={key} onClick={() => handleAction(value as string, node as HavenFile)}>
            {value}
          </button>
        ))}
      </div>
    );
  };

  const renderNode = (node: IHavenDirectory | HavenFile) => {
    const isOpen = node.type === 'directory' && expanded[node.id];
    return (
      <li key={node.id} className="mb-1">
        <div
          ref={containerRef}
          className={`flex items-center cursor-pointer hover:bg-neutral-600 rounded-lg p-1 ${selectedNodeId === node.id ? 'bg-blue-700/30 rounded' : ''}`}
          onAuxClick={() => handleToggleActionList(node)}
          onDoubleClick={() => handleDoubleClick(node)}
          onClick={() => handleShowFileInfo(node)}
        >
          {node.type === 'directory'
            ? (
                <span>
                  {isOpen ? '📂' : '📁'} {node.name}
                </span>
              )
            : (
                <div
                  className="flex justify-between items-center w-full"
                >
                  <p>📄 {node.name}</p>
                  <div className="flex gap-2 flex-wrap">
                    {node.tags.map((tag: string, index: number) => (
                      <p
                        key={index}
                        className="bg-neutral-800 p-1 rounded-md text-sm text-white"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>
              )}
        </div>

        {selectedNodeId === node.id && renderActions(node)}

        {isOpen && node.type === 'directory' && (
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
