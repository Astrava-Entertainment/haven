<script setup lang="ts">
import { OTabs, OTabItem } from '@oruga-ui/oruga-next'
import { useRecentFilesStore } from '../store'

const useRecentFiles = useRecentFilesStore()
const emits = defineEmits(['navigate'])

const handleNavigate = (file: HavenFSItem) => {
  emits('navigate', file)
}
</script>

<template>
  <o-tabs class="quick-access-tabs" type='boxed'>
    <o-tab-item :value="0" label="Tags">
      <div class="tab-content">
        <p class="placeholder">No tags available</p>
      </div>
    </o-tab-item>

    <o-tab-item :value="1" label="Recent Files">
      <div class="tab-content">
        <div
          v-if="!useRecentFiles.isEmpty()"
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
  .placeholder {
    color: $success;
    font-style: italic;
    font-size: 0.9rem;
  }

  .file-entry {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.4rem;
    background-color: $link;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background-color: $pressed;
    }
  }
}
</style>
