import { useFileSystemStore } from '../store';

export const connectTagmapById = (tagId: string): HavenFSTag => {
  const tagmap = useFileSystemStore().globalTagmap;
  return tagmap.get(tagId).tag;
};

export const connectLibsById = (libId: string) => {
  const libraries = useFileSystemStore().globalLibraries;
  return libraries.get(libId);
};

