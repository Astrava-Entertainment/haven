import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { IHavenDirectory } from "../common/interfaces";
import { HavenHistoryTree } from "../../../core/src/common/file.ts";
import {isProbablyFile} from "../utils/isFile.ts";

export function HydrateTree(node: IHavenDirectory | any): IHavenDirectory | HavenFile {
  const type = node.type || (isProbablyFile(node.name) ? "file" : "directory");

  if (type === "file") {
    return new HavenFile(
      node.id,
      node.havenRef,
      node.tags || [],
      node.historyTree as HavenHistoryTree[],
      node.name,
      node.ext,
      node.ref,
      node.size,
      "file",
      node.url
    );
  }

  if (type === "directory" && Array.isArray(node.children)) {
    return {
      ...node,
      type: "directory",
      children: node.children.map(HydrateTree),
    };
  }

  return node;
}

export function CollectTagsFromTree(tree: (IHavenDirectory | HavenFile)[]): Map<string, HavenFile[]> {
  const tagMap = new Map<string, HavenFile[]>();

  const traverse = (node: IHavenDirectory | HavenFile) => {
    if (node.type === "file") {
      node.tags?.forEach(tag => {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag)!.push(node);
      });
    } else if (node.type === "directory" && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  tree.forEach(traverse);
  return tagMap;
}
