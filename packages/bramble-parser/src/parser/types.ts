interface HavenFSNode {
  id: string;
  type: 'file' | 'directory';
  name: string;
  parent: string;
  size?: number;
  tags?: string[];
  metadata?: Record<string, string>;
  reference?: string[] // TODO: This must be a HavenReference type
  history?: string[] // TODO: This must be a HavenHistoryTree type
}
