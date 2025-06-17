export {};

declare global {
  interface IHavenFile {
    id: string;
    name: string;
    type: 'file';
    url: string;
    loadTime: number;
    cached: boolean;
    extension?: string;
  }

  interface IHavenDirectory {
    id: string;
    name: string;
    type: 'directory';
    children: (IHavenFile | IHavenDirectory)[];
  }

  // TODO: Rename this file, state for what?
  interface HavenState {
    tree: IHavenDirectory[];
  }
}
