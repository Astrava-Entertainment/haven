import { HavenFileNode } from "./directory";

export function findNodeById(
  tree: HavenFileNode[],
  nodeId: string
): HavenFileNode | null {
  for (const node of tree) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export function removeNodeById(
  nodes: HavenFileNode[],
  idToRemove: string
): HavenFileNode[] {
  return nodes
    .map((node) => {
      if (node.id === idToRemove) {
        return null;
      }

      if (node.type === "directory" && node.children) {
        return {
          ...node,
          children: removeNodeById(node.children, idToRemove),
        };
      }

      return node;
    })
    .filter(Boolean) as HavenFileNode[];
}
