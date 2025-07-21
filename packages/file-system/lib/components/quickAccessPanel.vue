<script setup lang="ts">
import { OTabs, OTabItem } from '@oruga-ui/oruga-next'
import { useRecentFilesStore, useGroupedTagsStore } from '../store'

const useRecentFiles = useRecentFilesStore()
const useGroupedTags = useGroupedTagsStore()
const emit = defineEmits(['navigate'])

useGroupedTags.initializeTags()

// This is not a HavenFSItem is a IFileInfo which have ID so the handler can open it
const handleNavigate = (file: HavenFSItem) => {
  emit('navigate', file)
}
</script>

<template>
  <o-tabs class="quick-access-tabs" type="boxed">
    <o-tab-item :value="0" label="Tags">
      <div class="tab-panel">
        <div
          v-if="!useGroupedTags.isEmpty"
          class="tag-group"
          v-for="(group, index) in useGroupedTags.tagGroups"
          :key="index"
        >
          <p class="tag-label">#{{ group.tag }}</p>
          <ul class="file-list">
            <li
              v-for="file in group.files"
              :key="file.id"
              @click="handleNavigate(file)"
              class="file-tag-entry"
            >
              {{ file.name }}
            </li>
          </ul>
        </div>
        <p v-else class="placeholder">No tags available</p>
      </div>
    </o-tab-item>

    <o-tab-item :value="1" label="Recent Files">
      <div class="tab-panel">
        <div
          v-if="!useRecentFiles.isEmpty"
          class="file-entry"
          v-for="(file, index) in useRecentFiles.recentOpenedFiles"
          :key="index"
          @click="handleNavigate(file)"
        >
          <span class="file-name">{{ file.name }}</span>
        </div>
        <p v-else class="placeholder">No files have been opened</p>
      </div>
    </o-tab-item>
  </o-tabs>
</template>

<style scoped lang="scss">
@import '@haven/design-system/colors.scss';
.quick-access-tabs {
  background-color: $link;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;

  .tab-panel {
    min-height: 550px;
    max-height: 550px;
    overflow-y: auto;
    padding: .5rem;
  }

  .placeholder {
    color: $visited;
    font-style: italic;
    font-size: 1rem;
  }

  .tag-group {
    margin-bottom: 1rem;
    padding: 0.5rem;
    background-color: $text;
    border-radius: 4px;

    .tag-label {
      font-weight: bold;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
    }

    .file-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .file-tag-entry {
        background-color: $link;
        padding: 0.4rem 0.6rem;
        margin-bottom: 0.3rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: $pressed;
        }
      }
    }
  }

  .file-entry {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.4rem;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background-color: $pressed;
    }

    .file-name {
      font-size: 0.95rem;
      font-weight: 500;
    }
  }
}
</style>
