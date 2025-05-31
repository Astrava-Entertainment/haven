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
