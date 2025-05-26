import { FileExplorerState } from "../common/type";

export const MAX_UNDO_SIZE = 5;

export const InitialState: FileExplorerState = {
  fullTree: [],
  visibleNodes: [],
  currentPath: [],
  searchInput: "",
  actionStack: [],
  renamingNodeId: null,
  originalTree: [],
  sortOrder: null,
};
