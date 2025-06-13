export interface IHavenFile {
  id: string;
  name: string;
  type: "file";
  url: string;
  loadTime: number;
  cached: boolean;
  extension?: string;
}

export interface IHavenDirectory {
  id: string;
  name: string;
  type: "directory";
  children: (IHavenFile | IHavenDirectory)[];
}

export enum ISortType {
  None = "None",
  Type = "TYPE",
  Name = "Name",
  Tag = "Tag",
}

export interface IContextMenu {
  x: number;
  y: number;
  tag: string;
  furniture: string;
}
