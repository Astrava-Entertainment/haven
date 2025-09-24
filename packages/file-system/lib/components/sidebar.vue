<script setup lang="ts">
import { ref } from 'vue';
import {useFileSystemStore, useGroupedTagsStore, usePathStore, useRecentFilesStore} from '../store';
import Tree from './tree.vue';

const emit = defineEmits(['navigate', 'goHome']);
const useFileSystem = useFileSystemStore();
const useGroupedTags = useGroupedTagsStore();
const useRecentFiles = useRecentFilesStore();

useGroupedTags.initializeTags();

const openBucket = ref<string>('project_a');
const swapBucket = (bucketId: string) => {
  if (openBucket.value === bucketId) {
    openBucket.value = '';
    useFileSystem.clearFileSystem();
  } else {
    openBucket.value = bucketId;
    useFileSystem.loadHavenFile(bucketId);
    emit('goHome');
  }
};

</script>

<template>
  <section class="sidebar-container">
    <div v-for='bucket in useFileSystem.currentProjects'>
      <Tree
        :key='bucket'
        :title="bucket"
        :content="useFileSystem.currentContent"
        :isBucket='true'
        :isBucketOpen='openBucket === bucket'
        @navigate="emit('navigate', $event)"
        @toggleBucket="swapBucket(bucket)"
      />
    </div>

    <Tree
      key="tags"
      title="Tags"
      :tags="useGroupedTags.tagGroups"
      @navigate="emit('navigate', $event)"
    />

    <Tree
      key="recent"
      title="Recent Files"
      :content="useRecentFiles.recentFiles"
      @navigate="emit('navigate', $event)"
    />
  </section>
</template>

<style scoped lang="scss">
.sidebar-container {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  background-color: $muted;
  padding: 1rem;
  border-right: 1px solid $visited;
  box-shadow: 2px 0 6px rgba(0,0,0,0.05);
  height: 100vh;
  overflow-y: auto;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.file-item {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255,255,255,0.05);

  &:hover {
    background-color: $primary;
    transform: translateX(2px);
  }

  .file-name {
    color: $text;
    font-weight: 500;
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.tree-subitem {
  padding-left: 1rem;
  border-left: 1px solid $divider;
  margin-top: 0.25rem;

  .file-item {
    background-color: rgba(255,255,255,0.1);

    &:hover {
      background-color: $highlight;
    }
  }
}

.sidebar-container::-webkit-scrollbar {
  width: 8px;
}

.sidebar-container::-webkit-scrollbar-thumb {
  background-color: $muted;
  border-radius: 4px;
}

.sidebar-container::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
