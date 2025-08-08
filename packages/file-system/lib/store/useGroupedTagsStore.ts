import { defineStore } from 'pinia'
import { groupedTags } from '../constants'

// TODO: Move to /constants
const limit = 5;

export const useGroupedTagsStore = defineStore('grouped-tags', {
  state: () => ({
    tagGroups: [] as ITagGroup[],
  }),

  getters: {
    allTags: (state): string[] => state.tagGroups.map(group => group.tag),

    getFilesByTag: (state) => {
      return (tag: string): IFileInfoInTags[] =>
        state.tagGroups.find(group => group.tag === tag)?.files ?? []
    },

    isEmpty: (state): boolean => state.tagGroups.length === 0,
  },

  actions: {
    initializeTags() {
      this.tagGroups = groupedTags.slice(0, limit)
    },
    add(file: IFileInfoInTags) {
      file.tags.forEach(tag => {
        let group = this.tagGroups.find(g => g.tag === tag)

        if (!group) {
          group = { tag, files: [] }
          this.tagGroups.unshift(group)
        } else {
          // Remove if exists already
          group.files = group.files.filter(f => f.id !== file.id)
        }

        group.files.unshift(file)

        // Limit files per tag (optional)
        if (group.files.length > limit) {
          group.files.pop()
        }
      })

      // Limit the total number of tag groups (optional)
      if (this.tagGroups.length > limit) {
        this.tagGroups = this.tagGroups.slice(0, limit)
      }
    },

    clear() {
      this.tagGroups = []
    },
  }
})
