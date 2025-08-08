import { defineStore } from 'pinia';
import {Bramble} from 'bramble-parser'
import ExampleFS1 from '@haven/examples/example1.havenfs';
import ExampleFS2 from '@haven/examples/example2.havenfs';

const fileSystemMap: Record<string, any> = {
  "example1": ExampleFS1,
  "example2": ExampleFS2
};

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    globalContent: [] as HavenFSItem[],
    fileGlobalContent: new Map<string, HavenFSItem>(),
    directoryGlobalContent: new Map<string, HavenFSItem>(),
    currentContent: [] as HavenFSItem[],
    currentHavenFs: [] as HavenFSItem[],
    currentBucket: '' as string,
  }),

  getters: {
    getCurrentHavenFs: (state) => state.currentHavenFs,
    getCurrentBucket: (state) => state.currentBucket,

    getFileByID(): (id: string) => HavenFSItem | undefined {
      return (id: string) => this.fileGlobalContent.get(id);
    },

    getDirectoryByID(): (id: string) => HavenFSItem | undefined {
      return (id: string) => this.directoryGlobalContent.get(id);
    }
  },

  actions: {
    initializeFileSystem() {
      this.currentBucket = 'example1';
      this.loadHavenFile('example1'); // default on startup
    },

    loadHavenFile(fsId: string) {
      const fsData = fileSystemMap[fsId];

      if (!fsData) {
        console.error(`No file system found for ID "${fsId}"`);
        return;
      }

      const myBramble = new Bramble(fsData);
      myBramble.run();
      // myBramble.debugFS()
      const havenFs = myBramble.getJSON();
      this.currentBucket = fsId;
      this.currentHavenFs = havenFs;
      this.setGlobalContent(havenFs);
    },

    clearFileSystem() {
      this.setGlobalContent([]);
      this.currentHavenFs = [];
      this.currentContent = [];
    },

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
});
