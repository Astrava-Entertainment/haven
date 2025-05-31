import React, { useEffect, useRef, useState } from "react";
import { getFileIcon } from "../utils/getFileIcon";
import "@astrava/design-system/dist/tailwind.css";

import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { HavenFileNode } from "../utils/directory";
import { getContextActions } from "../utils/fileActions";
import { EHavenFileActions } from "../common";
import { KEYMAP } from "../common/keymap";
import {
  addNewFolder,
  deleteSelected,
  moveNode,
  renameNode,
  selectNode,
  startRenamingNode,
} from "../store/slices/crud";
import { navigateInto } from "../store/slices/navigation";
import { HavenClipboard } from "../common/type";

const FileTreeView: React.FC<{ nodes: HavenFileNode[] }> = ({ nodes }) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: HavenFileNode;
  } | null>(null);

  const dispatch = useFileSystemDispatch();
  const { selectedNode, renamingNodeId } = useFileSystemSelector((state) => state.crud);

  const [clipboard, setClipboard] = useState<HavenClipboard | null>(null);
  const [tempNames, setTempNames] = useState<Record<string, string>>({});
  const [confirmDeleteNode, setConfirmDeleteNode] = useState<HavenFileNode | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    const handleScroll = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (renamingNodeId) {
      const node = nodes.find((n) => n.id === renamingNodeId);
      if (node) {
        setTempNames((prev) => ({ ...prev, [node.id]: node.name }));
      }
    }
  }, [renamingNodeId, nodes]);

  useEffect(() => {
    if (!clipboard) return;
    const timeout = setTimeout(() => setClipboard(null), 3000);
    return () => clearTimeout(timeout);
  }, [clipboard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = KEYMAP[e.key.toUpperCase()];
      if (!action || !selectedNode) return;

      e.preventDefault();

      switch (action) {
        case KEYMAP.OPEN:
          if (selectedNode.type === "directory") {
            dispatch(navigateInto(selectedNode.name));
          } else {
            console.log("Abrir archivo:", selectedNode.name);
          }
          break;
        case KEYMAP.DELETE:
          dispatch(deleteSelected());
          break;
        case KEYMAP.COPY:
          setClipboard({ node: selectedNode, action: "copy" });
          break;
        case KEYMAP.CUT:
          setClipboard({ node: selectedNode, action: "cut" });
          break;
        case KEYMAP.RENAME:
          dispatch(startRenamingNode(selectedNode.id));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode, dispatch]);

  const handleContextMenu = (event: React.MouseEvent, node: HavenFileNode) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY, node });
  };

  const handleContextAction = (action: EHavenFileActions, node: HavenFileNode) => {
    switch (action) {
      case EHavenFileActions.Rename:
        dispatch(selectNode(node));
        dispatch(startRenamingNode(node.id));
        break;
      case EHavenFileActions.Delete:
        setConfirmDeleteNode(node);
        break;
      case EHavenFileActions.Cut:
        setClipboard({ node, action: "cut" });
        break;
      case EHavenFileActions.Copy:
        setClipboard({ node, action: "copy" });
        break;
      case EHavenFileActions.Open:
        if (node.type === "directory") {
          dispatch(navigateInto(node.name));
        }
        break;
    }
  };

  const handleRenameFile = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    const newName = tempNames[nodeId];

    if (!node || newName === node.name) {
      dispatch(startRenamingNode(null));
      return;
    }

    dispatch(renameNode({ id: nodeId, newName }));
    setTempNames((prev) => {
      const updated = { ...prev };
      delete updated[nodeId];
      return updated;
    });
  };

  const renderNode = (node: HavenFileNode) => {
    const isRenaming = node.id === renamingNodeId;
    const tempName = tempNames[node.id] ?? node.name;

    return (
      <li
        key={node.id}
        draggable
        onDragStart={(e) => {
          if (isRenaming) {
            e.preventDefault();
            return;
          }
          setClipboard({ node, action: "none" });
        }}
        onDragOver={(e) => {
          if (node.type === "directory") e.preventDefault();
        }}
        onDrop={() => {
          if (
            isRenaming ||
            !clipboard ||
            clipboard.node.id === node.id ||
            node.type !== "directory"
          )
            return;
          dispatch(moveNode({ sourceId: clipboard.node.id, targetId: node.id }));
          setClipboard(null);
        }}
        onContextMenu={(e) => {
          if (isRenaming) return;
          dispatch(selectNode(node));
          handleContextMenu(e, node);
        }}
        onClick={(e) => {
          if (isRenaming) return;
          const shouldOpen = e.detail === 1; // single click
          if (shouldOpen) {
            dispatch(selectNode(node));
          }
        }}
        onDoubleClick={() => {
          if (isRenaming) return;
          if (node.type === "directory") {
            dispatch(navigateInto(node.name));
          } else {
            console.log("Abrir archivo:", node.name);
          }
        }}
        className={`flex flex-row items-center gap-2 cursor-pointer hover:bg-neutral-900 rounded-md px-2 py-1 ${selectedNode?.id === node.id ? "bg-[rgba(0,0,0,0.28)]" : "bg-transparent"
          }`}
      >
        {getFileIcon(node.name)}
        {isRenaming ? (
          <input
            ref={inputRef}
            value={tempName}
            autoFocus
            onChange={(e) =>
              setTempNames((prev) => ({ ...prev, [node.id]: e.target.value }))
            }
            onBlur={() => handleRenameFile(node.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="bg-transparent text-white border-b border-white focus:outline-none"
          />
        ) : (
          <div className="flex items-center justify-between w-full">
            <div>{node.name}</div>
            <div>
              {clipboard?.node.id === node.id && clipboard.action === "cut" && (
                <p className="text-yellow-400 text-xs italic">Cut</p>
              )}
              {clipboard?.node.id === node.id && clipboard.action === "copy" && (
                <p className="text-blue-400 text-xs italic">Copied</p>
              )}
            </div>
          </div>
        )}
      </li>
    );
  };

  const renderTree = (nodes: HavenFileNode[]) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        {renderNode(node)}
        {node.children && node.children.length > 0 && (
          <ul className="ml-4">{renderTree(node.children)}</ul>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <div className="navbar gap-x-2 mb-2">
        <div className="columns flex flex-col">
          <div className="column flex flex-row gap-2 my-2">
            <button
              className="bg-green-900 rounded-lg p-2 hover:bg-green-600 cursor-pointer"
              onClick={() => dispatch(addNewFolder())}
            >
              New
            </button>
          </div>
        </div>
      </div>

      <ul>{nodes.length > 0 ? renderTree(nodes) : <li>No files found.</li>}</ul>

      {contextMenu && contextMenu.node && (
        <ul
          className="absolute bg-neutral-800 text-white rounded shadow-md z-50 border min-w-[150px] max-h-[250px] overflow-y-auto scrollbar-thin"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {getContextActions(contextMenu.node, clipboard, handleContextAction).map((action) => (
            <li
              key={action.id}
              onClick={() => {
                if (!action.disabled) {
                  action.handler(contextMenu.node!);
                  setContextMenu(null);
                }
              }}
              className={`px-4 py-2 hover:bg-neutral-700 cursor-pointer ${action.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {action.label}
            </li>
          ))}
        </ul>
      )}

      {confirmDeleteNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg text-white shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete <strong>{confirmDeleteNode.name}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteNode(null)}
                className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(selectNode(confirmDeleteNode));
                  dispatch(deleteSelected());
                  setConfirmDeleteNode(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTreeView;
