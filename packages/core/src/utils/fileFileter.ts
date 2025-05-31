import { HavenFileNode } from "../../../file-system/src/utils/directory";

export function filterTreeByName(
  nodes: HavenFileNode[],
  search: string
): HavenFileNode[] {
  const searchLower = search.toLowerCase();

  return nodes
    .map((node) => {
      if (node.type === "directory" && node.children) {
        const filteredChildren = filterTreeByName(node.children, search);
        if (
          filteredChildren.length > 0 ||
          node.name.toLowerCase().includes(searchLower)
        ) {
          return { ...node, children: filteredChildren };
        }
      } else if (node.name.toLowerCase().includes(searchLower)) {
        return node;
      }
      return null;
    })
    .filter((node): node is HavenFileNode => node !== null);
}
