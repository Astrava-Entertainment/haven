<script setup lang="ts">
import { computed, ref } from 'vue';
import { TreeNode, SortsPanel } from './components';
import {useDirectoryContents, searchDeepTags, sortByDate, searchDeepType, searchDeepTerm, buildTree} from "./utils";
// import {Bramble} from 'bramble-parser';
import { havenfsExample } from './constants';

const viewMode = ref<ITreeNodeView>('list');
const currentDirId = ref('root');
const isSorting = ref<boolean>(false);

const searchTerm = ref('');
const tagFilter = ref('');
const selectedType = ref<HavenFSEntryType>('none');
const sortOrder = ref('desc');

// const myBramble = new Bramble('../fixtures/example.havenfs')
// myBramble.run()
// const = havenFs = myBramble.getJSON();

const currentDirectoryContents = useDirectoryContents(havenfsExample, currentDirId);
const navigateTo = (id: string) => { currentDirId.value = id; };
const toggleView = () => { viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'; };
const handleGoHome = () => { currentDirId.value = 'root'; };
const handleGoBack = () => {
  if (currentDirId.value === 'root') return;
  const currentNode = havenfsExample.find(item => item.id === currentDirId.value);
  currentDirId.value = currentNode?.parent ?? 'root';
};

const filteredContents = computed(() => {
  let result: HavenFSItem[] = searchDeepTerm(currentDirId.value, searchTerm.value) ?? currentDirectoryContents.value;

  result = searchDeepTags(result, tagFilter.value) ?? result;
  result = searchDeepType(result, selectedType.value) ?? result;
  result = sortByDate(result, sortOrder.value) ?? result;

  return result.filter(node => !node.isBackLink);
});

const treeView = computed(() => buildTree(havenfsExample, currentDirId.value));

</script>

<template>
  <div class="main-container">
    <div class="sidebar-container">
      <h3>File Explorer (Sidebar)</h3>
      <ul>
        <TreeNode
            v-for="node in treeView"
            :key="node.id"
            :node="node"
            mode="tree"
            @navigate="navigateTo"
        />
      </ul>

    </div>

    <div class="content-container">
      <h3>Current Directory</h3>
      <div class="controls-bar">
        <p>Content: {{ currentDirectoryContents.length - (currentDirId === 'root' ? 0 : 1) }}</p>
        <button>Add File/Folder</button>
        <button @click="handleGoHome">Home</button>
        <button @click="handleGoBack">Back</button>
        <button @click="isSorting = !isSorting">Sort</button>
        <input placeholder='Search...' v-model='searchTerm' type='text' />
        <button @click="toggleView">
          {{ viewMode === 'list' ? 'Grid' : 'List' }}
        </button>
      </div>

      <SortsPanel
        v-if="isSorting"
        v-model:tagFilter="tagFilter"
        v-model:selectedType="selectedType"
        v-model:sortOrder="sortOrder"
      />

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

.controls-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    border: none;
    border-radius: 6px;
    background-color: $primary;
    color: black;
    cursor: pointer;

    &:hover {
      background-color: darken($primary, 5%);
    }
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;

  select,
  input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-width: 160px;
    background: white;
    transition: border 0.2s ease;

    &:focus {
      border-color: $primary;
      outline: none;
    }
  }
}

</style>
