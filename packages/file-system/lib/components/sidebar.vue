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
    <h3 class="sidebar-title">Sidebar</h3>
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
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  background-color: $visited;
  padding: 1rem;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
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
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: rgba(186, 205, 191, 0.25);
  }

  .file-name {
    color: $highlight;
    font-weight: 500;
    font-size: 0.95rem;
  }
}
</style>
