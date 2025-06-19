export {};

declare global {

  type ISortType = 'none' | 'type' | 'name' | 'tag';

  interface IContextMenu {
    x: number;
    y: number;
    tag: string;
    furniture: string;
  }

  interface IHavenFilePrimitive {
    type: 'file' | 'directory';
  }

  interface IHavenFile extends IHavenFilePrimitive {
    id: string;
    name: string;
    url: string;
    loadTime: number;
    cached: boolean;
    extension?: string;
  }

  interface IHavenDirectory extends IHavenFilePrimitive {
    id: string;
    name: string;
    children: (IHavenFile | IHavenDirectory)[];
  }

  // TODO: Rename this file, state for what? FIX?
  interface IFileTreeState {
    tree: IHavenFile[];
  }

  interface IRenderTab {
    files: HavenFile[];
    activeFileId: string | null;
    onTabChange: (fileId: string) => void;
    onCloseTab: (file: HavenFile) => void;
  }
}
