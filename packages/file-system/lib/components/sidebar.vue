<script setup lang="ts">
import { ref } from 'vue';
import {useFileSystemStore, useGroupedTagsStore, usePathStore, useRecentFilesStore} from '../store';
import Tree from './tree.vue';

const emit = defineEmits(['navigate', 'goHome']);
const useFileSystem = useFileSystemStore();
const useGroupedTags = useGroupedTagsStore();
const useRecentFiles = useRecentFilesStore();

useGroupedTags.initializeTags();

const openBucket = ref<string>('');
const openProject = ref<string>('project_a');

const swapBucket = (bucketId: string) => {
  if (openBucket.value === bucketId) {
    openBucket.value = '';
  } else {
    openBucket.value = bucketId;
  }
};

const swapProject = (projectId: string) => {
  if (openProject.value === projectId) {
    openProject.value = '';
    useFileSystem.clearFileSystem();
  } else {
    openProject.value = projectId;
    useFileSystem.loadHavenFile(projectId);
    emit('goHome');
  }
};

</script>

<template>
  <section class="sidebar-container">
    <div class="bucket-header" @click="swapBucket('my_bucket')">
      <span class="bucket-icon">{{ openBucket === 'my_bucket' ? '▼' : '▶' }}</span>
      {{ useFileSystem.currentBucket }}
    </div>

    <div class='project-list' v-if='openBucket === useFileSystem.currentBucket' v-for='project in useFileSystem.currentProjects'>
      <Tree
        :key='project'
        :title="project"
        :content="useFileSystem.currentContent"
        :isBucket='true'
        :isBucketOpen='openProject === project'
        @navigate="emit('navigate', $event)"
        @toggleBucket="swapProject(project)"
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
.bucket-header {
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
}

.project-list {
  margin-left: 1.2rem;
  margin-bottom: .25rem;
}

.sidebar-container {
  width: $sidebar-width;
  flex: 0 0 $sidebar-width;
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
