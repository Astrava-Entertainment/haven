import { HavenFileNode } from "./directory";

export function normalizeTree(node: any): HavenFileNode {
  return {
    name: node.name,
    type: node.type === "folder" ? "directory" : node.type,
    url: node.url,
    loadTime: node.loadTime,
    cached: node.cached,
    children: node.children?.map(normalizeTree),
  };
}
