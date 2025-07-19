<script setup lang="ts">

// * Imports
import { computed, ref } from 'vue';
import {TreeNode, SortsPanel, Breadcrumb, QuickAccessPanel} from './components';
import { useDirectoryContents, searchDeepTags, sortByDate, searchDeepType, searchDeepTerm, buildTree } from './utils';
import { Bramble } from '@haven/bramble-parser';
import ExampleFS from '@haven/examples/example.havenfs';
import { OTable, OTableColumn } from '@oruga-ui/oruga-next';
import {usePathStore, useRecentFilesStore} from './store';

// * State & Stores
const usePath = usePathStore();
const useRecentFiles = useRecentFilesStore();

const viewMode = ref<ITreeNodeView>('list');
const currentDirId = ref('root');
const isSorting = ref<boolean>(false);

const searchTerm = ref('');
const tagFilter = ref('');
const selectedType = ref<HavenFSEntryType>('none');
const sortOrder = ref('desc');

// * File System Init
const myBramble = new Bramble(ExampleFS);
myBramble.run();
const havenFs = myBramble.getJSON();

// * Navigation Handlers
const handleClickNode = (file: HavenFSItem) => {
  if (file.type === 'directory') {
    navigateTo(file.id, file.name);
  } else {
    console.log("Opened file: ", file);
    useRecentFiles.add(file);
  }
};

const navigateTo = (id: string, name: string) => {
  usePath.push({id: id, name: name})
  currentDirId.value = id;
};

const navigateAt = (id: string) => {
  const nextIndex = usePath.fullPath.findIndex(item => item.id === id)
  usePath.truncateAt(nextIndex);
  currentDirId.value = usePath.top().id;
};

const handleGoHome = () => {
  usePath.reset();
  currentDirId.value = usePath.top().id;
};

const handleGoBack = () => {
  usePath.pop();
  if (usePath.top()) {
    currentDirId.value = usePath.top().id;
  } else {
    handleGoHome()
  }
};

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list';
};

// * Computed
const currentDirectoryContents = useDirectoryContents(havenFs, currentDirId);

const filteredContents = computed(() => {
  let result: HavenFSItem[] = searchDeepTerm(currentDirId.value, searchTerm.value) ?? currentDirectoryContents.value;

  result = searchDeepTags(result, tagFilter.value) ?? result;
  result = searchDeepType(result, selectedType.value) ?? result;
  result = sortByDate(result, sortOrder.value) ?? result;

  return result.filter(node => !node.isBackLink);
});

const treeView = computed(() => buildTree(havenFs, currentDirId.value));
</script>

<template>
  <div class="main-container">
    <!-- Sidebar -->
    <div class="sidebar-container">
      <h3>File Explorer (Sidebar)</h3>
      <ul>
        <TreeNode
          v-for="node in treeView"
          :key="node.id"
          :node="node"
          mode="tree"
          @navigate="handleClickNode"
        />
      </ul>
      <QuickAccessPanel @navigate="handleClickNode"/>
    </div>

    <!-- Main Content -->
    <div class="content-container">
      <h3>Current Directory</h3>
      <Breadcrumb @navigate='navigateAt'/>

      <!-- Controls -->
      <div class="controls-bar">
        <p>Content: {{ currentDirectoryContents.length - (currentDirId === 'root' ? 0 : 1) }}</p>
        <button>Add File/Folder</button>
        <button @click="handleGoHome">Home</button>
        <button @click="handleGoBack">Back</button>
        <button @click="isSorting = !isSorting">Sort</button>
        <input placeholder="Search..." v-model="searchTerm" type="text" />
        <button @click="toggleView">
          {{ viewMode === 'list' ? 'Grid' : 'List' }}
        </button>
      </div>

      <!-- Filters Panel -->
      <SortsPanel
        v-if="isSorting"
        :tagFilter="tagFilter"
        :selectedType="selectedType"
        :sortOrder="sortOrder"
      />

      <!-- Grid View -->
      <ul v-if="viewMode === 'grid'" class="content-grid">
        <li v-for="node in filteredContents" :key="node.id">
          <TreeNode :node="node" mode="content" view="grid" @navigate="handleClickNode" />
        </li>
      </ul>

      <!-- List View -->
      <section v-else>
        <o-table :data="filteredContents">
          <o-table-column field="name" label="Name" sortable>
            <template #default="{ row }">
        <span
          @click="() => handleClickNode(row)"
          style="cursor: pointer; color: blue"
        >
          {{ row.type === 'directory' ? '/' + row.name : row.name }}
        </span>
            </template>
          </o-table-column>

          <o-table-column field="type" label="Type" sortable>
            <template #default="{ row }">
              {{ row.type }}
            </template>
          </o-table-column>

          <o-table-column field="tag" label="Tag" sortable>
            <template #default="{ row }">
              <div
                v-if="row.tags && row.tags.length"
                style="display: flex; gap: 0.5rem; flex-wrap: wrap;"
              >
          <span v-for="tag in row.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
              </div>
            </template>
          </o-table-column>
        </o-table>
      </section>

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
