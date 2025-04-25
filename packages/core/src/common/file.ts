export interface HavenHistoryTree {
  user: string;
  action: string;
  timestamp: number;
  hash: string;
}

export interface HavenFile {
  name: string;
  ext: string;
  ref: string;
  size?: number;
  type?: string;
  url?: string;
  havenRef: number[];
  tags: string[];
  historyTree: HavenHistoryTree[];
}
