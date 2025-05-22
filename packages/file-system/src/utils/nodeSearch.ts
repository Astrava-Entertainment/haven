import { HavenFileNode } from "./directory";

export function findNodeById(tree: HavenFileNode[], nodeId: string): HavenFileNode | null {
  for (const node of tree) {
    if (node.name === nodeId) {
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
