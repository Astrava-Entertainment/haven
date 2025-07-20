import { defineStore } from 'pinia';

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    currentContent: [] as HavenFSItem[]
  }),

  getters: {

  },

  actions: {
    setCurrentContent(newContent: HavenFSItem[]) {
      this.currentContent = newContent;
    }
  }
})
