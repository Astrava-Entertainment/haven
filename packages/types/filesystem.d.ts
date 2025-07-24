export {};

declare global {

  type ISortType = 'none' | 'type' | 'name' | 'tag';

  type ITreeNodeMode = 'tree' | 'content';
  type ITreeNodeView = 'list' | 'grid';

  interface IContextMenu {
    x: number;
    y: number;
    tag: string;
    furniture: string;
  }

  interface HavenFSEntryType {
    type: 'none' | 'file' | 'directory';
  }

  interface IFileTreeState {
    tree: IHavenFile[];
  }

  interface IRenderTab {
    files: HavenFile[];
    activeFileId: string | null;
    onTabChange: (fileId: string) => void;
    onCloseTab: (file: HavenFile) => void;
  }

  interface HavenFSItem {
    id: string;
    type: HavenFSEntryType;
    name: string;
    parent: string;
    size?: number;
    tags?: string[];
    metadata?: {
      created?: string;
      modified?: string;
      mimetype?: string;
    };
  }

}
