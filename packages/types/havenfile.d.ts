export {};

declare global {
  interface HavenHistoryTree {
    user: string;
    action: string;
    timestamp: number;
    hash: string;
  }

  class HavenFile {
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
    );
  }
}
