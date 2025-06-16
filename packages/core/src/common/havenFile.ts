import { HavenHistoryTree } from "./file";
import { isProbablyFile } from "../../../file-system/src/utils/isFile.ts";

export class HavenFile {
  id: string;
  name: string;
  ext: string;
  ref: string;
  size?: number;
  type?: string;
  url?: string;
  havenRef: number[];
  tags: string[];
  tagFurniture: string[];
  historyTree: HavenHistoryTree[];

  constructor(
    id: string,
    havenRef: number[],
    tags: string[],
    tagFurniture: string[],
    historyTree: HavenHistoryTree[],
    name: string,
    ext: string,
    ref: string,
    size?: number,
    type?: string,
    url?: string
  ) {
    const newType = isProbablyFile(name) ? "file" : "directory";

    this.id = id;
    this.name = name;
    this.ext = ext;
    this.ref = ref;
    this.size = size;
    this.type = newType;
    this.url = url;
    this.havenRef = havenRef;
    this.tags = tags;
    this.tagFurniture = tagFurniture;
    this.historyTree = historyTree;
  }
}
