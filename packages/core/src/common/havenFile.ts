import { HavenHistoryTree } from "./file";

export class HavenFile {
  name: string;
  ext: string;
  ref: string;
  size?: number;
  type?: string;
  url?: string;
  havenRef: number[];
  tags: string[];
  historyTree: HavenHistoryTree[];

  constructor(
    havenRef: number[],
    tags: string[],
    historyTree: HavenHistoryTree[],
    name: string,
    ext: string,
    ref: string,
    size?: number,
    type?: string,
    url?: string
  ) {
    this.name = name;
    this.ext = ext;
    this.ref = ref;
    this.size = size;
    this.type = type;
    this.url = url;
    this.havenRef = havenRef;
    this.tags = tags;
    this.historyTree = historyTree;
  }
}
