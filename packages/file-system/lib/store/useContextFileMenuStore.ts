import { defineStore } from 'pinia'

export const useContextFileMenuStore = defineStore('context-file-menu', {
  state: () => ({
    activeFileId: null as string | null,
    x: 0,
    y: 0,
    visible: false,
  }),

  actions: {
    open(id: string, x: number, y: number) {
      this.activeFileId = id
      this.x = x
      this.y = y
      this.visible = true
    },
    close() {
      this.visible = false
      this.activeFileId = null
    },
  }
})
