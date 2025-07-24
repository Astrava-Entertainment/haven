import { defineStore } from 'pinia';

interface IFileInfo {
  id: string;
  name: string;
}

export const usePathStore = defineStore('path', {
  state: () => ({
    currentPath: [
      { id: 'root', name: 'root' }
    ] as IFileInfo[],
  }),

  getters: {
    fullPath: (state): IFileInfo[] => state.currentPath,
  },

  actions: {
    push(segment: IFileInfo) {
      this.currentPath.push(segment);
    },

    top() {
      return this.currentPath[this.currentPath.length - 1];
    },

    pop() {
      this.currentPath.pop();
    },

    truncateAt(index: number) {
      this.currentPath = this.currentPath.slice(0, index + 1);
    },

    reset() {
      this.currentPath = [{id: 'root', name: 'root'}];
    },
  }
})
