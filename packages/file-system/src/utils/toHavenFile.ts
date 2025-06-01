import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { IHavenDirectory } from "../common/interfaces";
import { HavenHistoryTree } from "../../../core/src/common/file.ts";

function isFile(node: any): node is HavenFile {
  return node.type === "file";
}

export function hydrateTree(
  node: IHavenDirectory | any
): IHavenDirectory | HavenFile {
  if (isFile(node)) {
    return new HavenFile(
      node.id,
      node.havenRef,
      node.tags || [],
      node.historyTree as HavenHistoryTree[],
      node.name,
      node.ext,
      node.ref,
      node.size,
      node.type,
      node.url
    );
  }

  if (node.type === "directory" && Array.isArray(node.children)) {
    return {
      ...node,
      children: node.children.map(hydrateTree),
    };
  }

  return node;
}
