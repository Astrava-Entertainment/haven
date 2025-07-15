<script setup lang="ts">
import { havenfsExample } from './constants/examples.ts';
import { computed, ref } from 'vue';
import { TreeNode } from './components';
import { buildTree } from './utils';
import {useDirectoryContents} from "./utils/useDirectoryContents.ts";

const viewMode = ref<ITreeNodeView>('list');
const currentDirId = ref('root');

const currentDirectoryContents = useDirectoryContents(havenfsExample, currentDirId);
const fileTree = computed(() => buildTree(havenfsExample));
const navigateTo = (id: string) => { currentDirId.value = id; };
const toggleView = () => { viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'; };
const handleGoHome = () => { currentDirId.value = 'root'; };
const handleGoBack = () => {
  if (currentDirId.value === 'root') return;
  const currentNode = havenfsExample.find(item => item.id === currentDirId.value);
  currentDirId.value = currentNode?.parent ?? 'root';
};

function searchDeep(parentId: string, query: string) {
  const lowerQuery = query.toLowerCase();

  const results: HavenFSItem[] = [];

  function traverse(id: string) {
    const children = havenfsExample.filter(item => item.parent === id);
    for (const item of children) {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }

      if (item.type === 'directory') {
        traverse(item.id);
      }
    }
  }

  traverse(parentId);
  return results;
}
const searchTerm = ref('');

const filteredContents = computed(() => {
  const term = searchTerm.value.trim();
  if (!term) return currentDirectoryContents.value;
  return searchDeep(currentDirId.value, term).filter(node => !node.isBackLink);
});


</script>

<template>
  <div class="main-container">
    <div class="sidebar-container">
      <h3>File Explorer (Sidebar)</h3>
      <ul>
        <li v-for="node in filteredContents" :key="node.id">
          <TreeNode :node="node" mode="tree" @navigate="navigateTo" />
        </li>
      </ul>
    </div>

    <div class="content-container">
      <h3>Current Directory</h3>
      <div>
        <p>Content: {{ currentDirectoryContents.length - (currentDirId === 'root' ? 0 : 1) }}</p>
        <button>Add File/Folder</button>
        <button @click="handleGoHome">Home</button>
        <button @click="handleGoBack">Back</button>
        <input placeholder="Search" v-model="searchTerm"/>
        <button>Sort</button>
        <button @click='toggleView'>{{viewMode === 'list' ? 'Grid' : 'List'}}</button>
      </div>
      <ul v-if="viewMode === 'grid'" class="content-grid">
        <li v-for="node in filteredContents" :key="node.id">
          <TreeNode :node="node" mode="content" view="grid" @navigate="navigateTo" />
        </li>
      </ul>

      <ul v-else class="content-list">
        <li v-for="node in filteredContents" :key="node.id">
          <TreeNode :node="node" mode="content" view="list" @navigate="navigateTo" />
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped lang="scss">
// ?TODO: Move to design-system/scss/main-filesystem.scss

@import '@haven/design-system/colors.scss';

html, body {
  margin: 0;
}

.main-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.sidebar-container {
  flex: 0 0 300px;
  flex-direction: column;
  background-color: $visited;
  padding: 1rem;
}

.content-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background-color: $danger;
  padding: 1rem;
  overflow-x: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

.content-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

</style>
