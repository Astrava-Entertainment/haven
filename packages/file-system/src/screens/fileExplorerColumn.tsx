import React, { useEffect, useState } from "react";
import { getFileIcon } from "../utils/getFileIcon";
// @ts-ignore
import fileTree from "../../examples/structure.json";

import {
  addNewFolder,
  deleteSelected,
  loadTree,
  navigateInto,
  selectNode,
  // pasteNode,
} from "../store/slices/fileExplorer";
import { useFileSystemDispatch, useFileSystemSelector } from "../store/hooks";
import { HavenFileNode } from "../utils/directory";
import { getContextActions } from "../utils/fileActions";
import { EHavenFileActions } from "../common";
import { normalizeTree } from "../utils/treeNormalizer";

interface HavenFileContext {
  x: number;
  y: number;
  node: HavenFileNode | null;
}

const FileExplorer: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<HavenFileContext | null>(null);
  const dispatch = useFileSystemDispatch();

  const { selectedNode, fullTree, visibleNodes } = useFileSystemSelector(
    (state) => state.fileExplorer
  );

  const [clipboard, setClipboard] = useState<HavenFileNode | null>(null);

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

  const handleContextMenu = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    node: HavenFileNode
  ) => {
    event.preventDefault(); // evita el menú nativo
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      node,
    });
  };

  const handleSelectNode = (node: HavenFileNode) => {
    dispatch(selectNode(node));
  };

  const handleNavigateSubdirectory = (dirName: string) => {
    dispatch(navigateInto(dirName));
  };

  const handleContextAction = (action: EHavenFileActions, node: HavenFileNode) => {
    switch (action) {
      case EHavenFileActions.Cut:
        console.log('Cut');

        setClipboard(node);
        break;
      case EHavenFileActions.Copy:
        console.log('Copy');

        setClipboard({ ...node });
        break;
      case EHavenFileActions.Paste:
        if (clipboard && node.type === "directory") {
          // dispatch(pasteNode({ targetNode: node, nodeToPaste: clipboard }));
        }
        break;
      case EHavenFileActions.Tag:
        // Abrir modal de etiquetas (pendiente implementar)
        console.log('Tag');
        break;
      case EHavenFileActions.Open:
        if (node.type === "directory") {
          handleNavigateSubdirectory(node.name);
        } else {
          console.log("Abrir archivo:", node.name);
        }
        break;
      case EHavenFileActions.Undo:
        console.log("Undo");
        break;
      case EHavenFileActions.Rename:
        console.log("Rename");
        break;
    }
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

        <button
          className="bg-red rounded-lg p-2"
          onClick={() => dispatch(deleteSelected())}
          disabled={!selectedNode}
        >
          Delete
        </button>
      </div>

      {fullTree.length > 0 && (
        <ul>
          {visibleNodes.length > 0 ? (
            visibleNodes.map((node, index) => (
              <li
                key={index}
                onContextMenu={(e) => {
                  handleSelectNode(node)
                  handleContextMenu(e, node)
                }}
                onClick={() => handleSelectNode(node)}
                onDoubleClick={() => {
                  if (node.type === "directory") {
                    handleNavigateSubdirectory(node.name);
                  } else {
                    console.log("Abrir archivo:", node.name);
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
                    selectedNode?.name === node.name ? "rgba(0, 0, 0, 0.28)" : "transparent",
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

      {contextMenu && contextMenu.node && (
        <ul
          className="absolute bg-neutral-800 text-white rounded shadow-md z-50 border"
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
                className={`px-4 py-2 hover:bg-neutral-700 cursor-pointer ${action.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {action.label}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default FileExplorer;
