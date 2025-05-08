export type HavenFileNode = {
  name: string;
  type: "file" | "directory";
  children?: HavenFileNode[];
  url?: string;
  loadTime?: number;
  cached?: boolean;
};

// Recursively flatten tree
export const flattenFileTree = (nodes: HavenFileNode[]): HavenFileNode[] => {
  const result: HavenFileNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      result.push(node);
    } else if (node.type === "directory" && node.children) {
      result.push(...flattenFileTree(node.children));
    }
  }
  return result;
};

// Find directory by path
export const findDirectoryAtPath = (
  tree: HavenFileNode[],
  path: string[]
): HavenFileNode | null => {
  let current: HavenFileNode[] = tree;
  let result: HavenFileNode | null = null;

  for (const segment of path) {
    result =
      current.find((n) => n.name === segment && n.type === "directory") || null;
    if (!result || !result.children) return null;
    current = result.children;
  }

  return { name: "", type: "directory", children: current };
};
