import { defineStore } from 'pinia';

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    globalContent: [] as HavenFSItem[],
    fileGlobalContent: new Map<string, HavenFSItem>(),
    directoryGlobalContent: new Map<string, HavenFSItem>(),
    currentContent: [] as HavenFSItem[]
  }),

  getters: {
    getFileByID(): (id: string) => HavenFSItem | undefined {
      return (id: string) => this.fileGlobalContent.get(id);
    },

    getDirectoryByID(): (id: string) => HavenFSItem | undefined {
      return (id: string) => this.directoryGlobalContent.get(id);
    }
  },

  actions: {
    setCurrentContent(newContent: HavenFSItem[]) {
      this.currentContent = newContent;
    },

    setGlobalContent(global: HavenFSItem[]) {
      this.globalContent = global;

      this.fileGlobalContent = new Map(
        global.filter(f => f.type === 'file').map(f => [f.id, f])
      );

      this.directoryGlobalContent = new Map(
        global.filter(f => f.type === 'directory').map(f => [f.id, f])
      );
    },
  }
})
