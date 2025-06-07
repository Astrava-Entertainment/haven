import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { IHavenDirectory } from "../common/interfaces";
import { HavenHistoryTree } from "../../../core/src/common/file.ts";
import {isProbablyFile} from "../utils/isFile.ts";

export function hydrateTree(node: IHavenDirectory | any): IHavenDirectory | HavenFile {
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
      children: node.children.map(hydrateTree),
    };
  }

  return node;
}
