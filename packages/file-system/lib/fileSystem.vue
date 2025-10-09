<script setup lang="ts">
// * Imports
import {computed, ref, watch} from 'vue';
import {Sidebar, RenderTabs, FileMetadata} from './components';
import {useDirectoryContents, searchDeepType, searchDeepTerm} from './utils';
import {usePathStore, useRecentFilesStore, useFileSystemStore} from './store';
import {useFileInfoStore} from '@haven/core/store';

// * State & Stores
const useFileSystem = useFileSystemStore();
const usePath = usePathStore();
const useRecentFiles = useRecentFilesStore();
const useFileInfo = useFileInfoStore();

const currentDirId = ref('root');

const searchTerm = ref('');
const sortByTags = ref('');
const sortByType = ref<HavenFSEntryType>('none');

const tabsRenderRef = ref<InstanceType<typeof RenderTabs> | null>(null);

useFileSystem.initializeFileSystem();

// * Navigation Handlers
const handleClickNode = async (file: HavenFSItem) => {
  if (file.type === 'directory') {
    navigateTo(file.id, file.name);
  } else {
    console.log("Opened file: ", file);
    useRecentFiles.add(file);
    useFileInfo.setFileToRender(file)
    tabsRenderRef.value?.addTab(file);
  }
};

const navigateTo = (id: string, name: string) => {
  usePath.push({id: id, name: name})
  currentDirId.value = id;
};


const handleGoHome = () => {
  usePath.reset();
  currentDirId.value = usePath.top().id;
};

// * Computed
const currentHavenFs = computed(() => useFileSystem.getCurrentHavenFs);
const currentDirectoryContents = useDirectoryContents(currentHavenFs, currentDirId);

const filteredContents = computed(() => {
  let result: HavenFSItem[] =
    searchDeepTerm(currentHavenFs.value, currentDirId.value, searchTerm.value) ??
    currentDirectoryContents.value;

  result = searchDeepType(result, sortByType.value) ?? result;

  return result.filter(node => !node.isBackLink);
});

const effectiveContents = computed(() => {
  const hasFilters = searchTerm.value || sortByTags.value || sortByType.value !== 'none';

  return hasFilters ? filteredContents.value : currentDirectoryContents.value;
});

watch(effectiveContents, (val) => {
  useFileSystem.setCurrentContent(val);
}, {immediate: true});

</script>

<template>
  <div class="main-container">
    <Sidebar @navigate='handleClickNode' @goHome='handleGoHome'/>
    <div class="content-container">
      <div class="render-views">
        <RenderTabs ref="tabsRenderRef"/>
      </div>
      <FileMetadata class="file-metadata"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

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
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  background-color: $muted;
  gap: 1rem;
  overflow-x: auto;
  border-left: 1px solid $divider;
}

.render-views {
  background-color: $primary;
}

.view-container {
  padding: 1rem;
}
</style>
