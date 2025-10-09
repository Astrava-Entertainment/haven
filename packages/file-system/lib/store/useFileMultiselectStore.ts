import {defineStore} from 'pinia'

export const useFileMultiselectStore = defineStore('file-multiselect', {
  state: () => ({
    selectedIds: [] as string[],
    lastSelectedId: null as string | null,
  }),
  actions: {
    selectSingle(id: string) {
      this.selectedIds = [id];
      this.lastSelectedId = id;
    },

    toggleSelect(id: string) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter(i => i !== id);
      } else {
        this.selectedIds.push(id);
      }
      this.lastSelectedId = id;
    },

    selectRange(allItems : HavenFSItem[], id: string) {
      if (!this.lastSelectedId) {
        this.selectSingle(id)
        return;
      }
      const ids = allItems.map(i => i.id);
      const start = ids.indexOf(this.lastSelectedId);
      const end = ids.indexOf(id);
      const [lo, hi] = start < end ? [start, end] : [end, start];
      this.selectedIds = ids.slice(lo, hi + 1);
      this.lastSelectedId = id;
    },

    clearSelection() {
      this.selectedIds = [];
      this.lastSelectedId = null;
    }
  }
})
