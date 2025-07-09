export { }

declare global {
  export interface HavenFSNode {
    id: string;
    type: 'file' | 'directory';
    name: string;
    parent: string;
    size?: number;
    tags?: string[];
    metadata?: Record<string, string>;
    references?: HavenReference[];
    history?: HavenHistoryTree[];
  }

  export interface HavenReference {
    from: string;           // ID origen
    to: string;             // ID destination
    type: string;           // Example: 'used-by', 'linked-to'
    context?: string;
  }

  export interface HavenHistoryTree {
    id: string;             // ID of the affected node
    timestamp: string;      // ISO 8601
    user: string;           // Author of the change
    action: string;         // Action (e.g. created, edited)
    hash: string;           // Hash of the snapshot or commit
  }

}
