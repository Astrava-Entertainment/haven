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

  interface HavenFSGroupBy {
    type: 'none' | 'date' | 'type';
  }

  interface IImportantFileInfo {
    id: string;
    name: string;
  }

  interface IFileInfoInTags {
    id: string;
    name: string;
    tags: string[];
  }

  interface ITagGroup {
    tag: string;
    files: IFileInfoInTags[];
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

  export interface HavenFSItem {
    id: string;
    type: HavenFSEntryType;
    name: string;
    parent: string;
    size?: number;
    tags?: string[];
    libraries?: string[];
    metadata?: {
      created?: string;
      modified?: string;
      mimetype?: string;
    };
  }

  export interface HavenFSTag {
    id: string;
    name: string;
    color: string;
  }

  // export interface HavenFSTagmap {
  //   id: string;
  //   tag: string;
  //   fileRef: string[];
  // }

  export interface HavenFSLibrary {
    id: string;
    name: string;
  }

}
