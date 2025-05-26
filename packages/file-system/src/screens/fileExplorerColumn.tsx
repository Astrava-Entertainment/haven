import React, { useEffect, useRef, useState } from "react";
import { getFileIcon } from "../utils/getFileIcon";
import fileTree from "../../examples/structure.json";
import "@astrava/design-system/dist/tailwind.css";



import {
  addNewFolder,
  deleteSelected,
  loadTree,
  moveNode,
  navigateInto,
  renameNode,
  resetSort,
  selectNode,
  sortByName,
  sortByTag,
  startRenamingNode,
} from "../store/slices/fileExplorer";

import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { HavenFileNode } from "../utils/directory";
import { getContextActions } from "../utils/fileActions";
import { EHavenFileActions } from "../common";
import { normalizeTree } from "../utils/treeNormalizer";
import { getActionFromKeyEvent, getActionFromMouseEvent } from "../utils/keymaps";
import { KEYMAP } from "../common/keymap";


interface HavenFileContext {
  x: number;
  y: number;
  node: HavenFileNode | null;
}

const FileExplorer: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<HavenFileContext | null>(null);
  const dispatch = useFileSystemDispatch();
  const [clipboard, setClipboard] = useState<{ node: HavenFileNode, action: string } | null>(null);
  const [tempNames, setTempNames] = useState<Record<string, string>>({});
  const [confirmDeleteNode, setConfirmDeleteNode] = useState<HavenFileNode | null>(null);


  // TODO: This is for bubbling
  // const [isOnAction, setIsOnAction] = useState(false);

  const { selectedNode, fullTree, visibleNodes, renamingNodeId } = useFileSystemSelector(
    (state) => state.fileExplorer
  );

  useEffect(() => {
    const normalized = fileTree.map(normalizeTree);
    dispatch(loadTree(normalized));
  }, [dispatch]);

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
      const node = visibleNodes.find((n) => n.id === renamingNodeId);
      if (node) {
        setTempNames((prev) => ({ ...prev, [node.id]: node.name }));
      }
    }
  }, [renamingNodeId, visibleNodes]);

  const handleContextMenu = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    node: HavenFileNode
  ) => {
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
    const node = visibleNodes.find((n) => n.id === nodeId);
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


  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (renamingNodeId) {
      inputRef.current.select();
      const node = visibleNodes.find((n) => n.id === renamingNodeId);
      if (node) {
        setTempNames((prev) => ({ ...prev, [node.id]: node.name }));
      }
    }
  }, [renamingNodeId, visibleNodes]);


  useEffect(() => {
    if (!clipboard) return;

    const timeout = setTimeout(() => {
      setClipboard(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [clipboard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = getActionFromKeyEvent(e);
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



  return (
    <div>
      <div className="navbar gap-x-2 mb-2">
        <div className="columns flex flex-col">
          <div className="column flex flex-row gap-2 my-2">
            <button className="bg-green-900 rounded-lg p-2 hover:bg-green-600 cursor-pointer"
              onClick={() => dispatch(addNewFolder())}>
              New
            </button>
            {/* <button className="bg-red-900 rounded-lg p-2 hover:bg-red-600 cursor-pointer"
              onClick={() => dispatch(deleteSelected())}
              disabled={!selectedNode}
            >
              Delete
            </button> */}
          </div>
          <div className="column flex flex-row gap-2 my-2">
            <button
              className="bg-neutral-900 border rounded-lg p-2 hover:bg-white hover:text-black"
              onClick={() => dispatch(resetSort())}
            >
              Clear Sort
            </button>

            <button className="bg-neutral-900 border rounded-lg p-2 hover:bg-white hover:text-black"
              onClick={() => dispatch(sortByName())}
            >
              By Name
            </button>
            <button className="bg-neutral-900 border rounded-lg p-2 hover:bg-white hover:text-black"
              onClick={() => dispatch(sortByTag())}
            >
              By Tag
            </button>
          </div>
        </div>
      </div>

      <ul>
        {visibleNodes.length > 0 ? (
          visibleNodes.map((node) => {
            const tempName = tempNames[node.id] ?? node.name;
            const isRenaming = node.id === renamingNodeId

            return (
              <li
                key={node.id}
                draggable
                onDragStart={(e) => {
                  if (isRenaming) {
                    e.preventDefault();
                    return;
                  }
                  setClipboard({ node: node, action: "none" });
                }}

                onDragOver={(e) => {
                  if (node.type === "directory") e.preventDefault();
                }}
                onDrop={() => {
                  if (isRenaming || !clipboard || clipboard.node.id === node.id || node.type !== "directory") return;
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

                  const action = getActionFromMouseEvent(e);
                  const shouldOpen = action === KEYMAP.OPEN;
                  if (shouldOpen) {
                    dispatch(selectNode(node));
                    dispatch(navigateInto(node.name));
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
          })
        ) : (
          <li>No files found.</li>
        )}
      </ul>

      {contextMenu && contextMenu.node && (
        <ul
          className="absolute bg-neutral-800 text-white rounded shadow-md z-50 border min-w-[150px] max-h-[250px] overflow-y-auto scrollbar-thin"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >

          {getContextActions(contextMenu.node, clipboard, handleContextAction).map(
            (action) => (
              <li
                key={action.id}
                onClick={() => {
                  if (!action.disabled) {
                    action.handler(contextMenu.node!);
                    setContextMenu(null);
                  }
                }}
                className={`px-4 py-2 hover:bg-neutral-700 cursor-pointer ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`} >
                {action.label}
              </li>
            )
          )}
        </ul>
      )}

      {confirmDeleteNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg text-white shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete <strong>{confirmDeleteNode.name}</strong>?</p>
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

export default FileExplorer;
