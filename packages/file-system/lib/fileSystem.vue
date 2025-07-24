<script setup lang="ts">
// * Imports
import { computed, ref, watch } from 'vue';
import {FilterPanel, Breadcrumb, FileListView, FileGridView, Sidebar} from './components';
import { useDirectoryContents, searchDeepTags, sortByDate, searchDeepType, searchDeepTerm } from './utils';
import { Bramble } from '@haven/bramble-parser';
import ExampleFS from '@haven/examples/example.havenfs';
import {usePathStore, useRecentFilesStore, useFileSystemStore} from './store';

// * State & Stores
const useFileSystem = useFileSystemStore();
const usePath = usePathStore();
const useRecentFiles = useRecentFilesStore();

const viewMode = ref<ITreeNodeView>('list');
const currentDirId = ref('root');
const isSorting = ref<boolean>(false);

const searchTerm = ref('');
const sortByTags = ref('');
const sortByType = ref<HavenFSEntryType>('none');

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
  let result: HavenFSItem[] = searchDeepTerm(havenFs, currentDirId.value, searchTerm.value) ?? currentDirectoryContents.value;

  // result = searchDeepTags(result, sortByTags.value) ?? result;
  result = searchDeepType(result, sortByType.value) ?? result;

  return result.filter(node => !node.isBackLink);
});

const effectiveContents = computed(() => {
  const hasFilters = searchTerm.value || sortByTags.value || sortByType.value !== 'none';

  return hasFilters ? filteredContents.value : currentDirectoryContents.value;
});

watch(effectiveContents, (val) => {
  useFileSystem.setCurrentContent(val);
}, { immediate: true });

</script>

<template>
  <div class="main-container">
    <Sidebar @navigate='handleClickNode'/>

    <div class="content-container">
      <h3>Main Content</h3>
      <Breadcrumb @navigate='navigateAt' @goBack='handleGoBack' @goHome='handleGoHome'/>

      <div class="controls-bar">
        <p>Content: {{ effectiveContents.length }}</p>
        <button>Add File/Folder</button>
        <button @click="isSorting = !isSorting">Sort</button>
        <input placeholder="Search..." v-model="searchTerm" type="text" />
        <button @click="toggleView">
          {{ viewMode === 'list' ? 'Grid' : 'List' }}
        </button>
      </div>

      <FilterPanel
        v-if="isSorting"
        :sortByType="sortByType"
        @update:selectType="val => sortByType = val"
      />

      <FileGridView v-if="viewMode === 'grid'" @onClickNode="handleClickNode" />
      <FileListView v-else @onClickNode='handleClickNode'/>
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

.content-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background-color: $danger;
  padding: 1rem;
  overflow-x: auto;
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
</style>
