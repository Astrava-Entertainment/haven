import { HavenHistoryTree } from "./file";

export class HavenFile {
  id:string;
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
    id: string,
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
    this.id = id;
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
