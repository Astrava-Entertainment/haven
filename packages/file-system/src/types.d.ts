interface IHavenFile {
  id: string;
  name: string;
  type: "file";
  url: string;
  loadTime: number;
  cached: boolean;
  extension?: string;
}

interface IHavenDirectory {
  id: string;
  name: string;
  type: "directory";
  children: (IHavenFile | IHavenDirectory)[];
}

type ESortType = "None" | "Name" | "Tag";
type EHavenFileActions = "Rename" | "Paste" | "Copy" | "Cut" | "Delete";
