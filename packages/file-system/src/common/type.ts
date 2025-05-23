import { EHavenFileActions } from ".";
import { HavenFileNode } from "../utils/directory";

export type EHavenFileContextActions = {
  id: EHavenFileActions;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  handler: (node: HavenFileNode) => void;
};

export type ActionStackItem =
  | {
      type: "cut" | "copy";
      payload: {
        node: HavenFileNode; // nodo cortado o copiado
        originalParentId: string; // id o path padre original (para poder pegar o revertir)
      };
    }
  | {
      type: "paste";
      payload: {
        node: HavenFileNode; // nodo que fue pegado
        oldParentId: string; // id o path padre antes de pegar (para revertir pegado)
        newParentId: string; // id o path padre donde se pegó
      };
    }
  | {
      type: "rename";
      payload: {
        nodeId: string; // id del nodo renombrado
        oldName: string; // nombre anterior
        newName: string; // nombre nuevo
      };
    }
  | {
      type: "delete";
      payload: {
        node: HavenFileNode; // nodo eliminado (para poder restaurar)
        parentId: string; // padre original para restaurar el nodo
      };
    };

export interface FileExplorerState {
  fullTree: HavenFileNode[];
  visibleNodes: HavenFileNode[];
  selectedNode?: HavenFileNode | null;
  currentPath: string[];
  searchInput: string;
  actionStack: ActionStackItem[];
  renamingNodeId?: string | null;

  originalTree: HavenFileNode[];
  sortOrder: "name" | "tag" | null;
}

// export interface ActionStackItem {
//   type: "cut" | "copy" | "paste" | "rename" | "delete";
//   payload: any;
// }
