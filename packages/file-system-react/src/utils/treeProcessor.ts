// import { HavenFile } from "../../../core/src/common/havenFile.ts";
import { HavenFile } from '@haven/core/shared';
// import { IHavenDirectory } from "../common/interfaces";
// import { HavenHistoryTree } from "../../../core/src/common/file.ts";

import { isProbablyFile } from '../utils/isFile.ts';

export interface ITagInfo {
  files: HavenFile[];
  furniture: Set<string>;
}

export function HydrateTree(
  node: IHavenDirectory | any
): IHavenDirectory | HavenFile {
  const type = node.type || (isProbablyFile(node.name) ? 'file' : 'directory');

  if (type === 'file') {
    return new HavenFile(
      node.id,
      node.havenRef,
      node.tags || [],
      node.tagFurniture || [],
      node.historyTree as IHavenHistoryTree[],
      node.name,
      node.ext,
      node.ref,
      node.size,
      'file',
      node.url
    );
  }

  if (type === 'directory' && Array.isArray(node.children)) {
    return {
      ...node,
      type: 'directory',
      children: node.children.map(HydrateTree),
    };
  }

  return node;
}

export function CollectTagsFromTree(
  tree: (IHavenDirectory | HavenFile)[]
): Map<string, ITagInfo> {
  const tagMap = new Map<string, ITagInfo>();

  const traverse = (node: IHavenDirectory | HavenFile) => {
    if (node.type === 'file') {
      const tags = node.tags ?? [];
      const furnitures = node.tagFurniture ?? [];

      tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, { files: [], furniture: new Set() });
        }
        const tagEntry = tagMap.get(tag)!;
        tagEntry.files.push(node);
        
        furnitures.forEach((f) => tagEntry.furniture.add(f));
      });
    }
    else if (node.type === 'directory' && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  tree.forEach(traverse);
  return tagMap;
}
