import { defineStore } from 'pinia';

interface IFileInfo {
  id: string;
  name: string;
}

export const useRecentFilesStore = defineStore('recentFiles', {
  state: () => ({
    recentOpenedFiles: [] as HavenFSItem[],
  }),

  getters: {
    recentFiles: (state): IFileInfo[] => {
      return state.recentOpenedFiles.map(node => ({
        id: node.id,
        name: node.name,
      }))
    },


    isEmpty: (state): boolean => state.recentOpenedFiles.length === 0,
  },

  actions: {
    add(file: HavenFSItem) {
      this.recentOpenedFiles = this.recentOpenedFiles.filter(f => f.id !== file.id);
      this.recentOpenedFiles.unshift(file);

      if (this.recentOpenedFiles.length > 5) {
        this.recentOpenedFiles.pop();
      }
    },

    clear() {
      this.recentOpenedFiles = [];
    }
  }
})

