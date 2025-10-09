<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Breadcrumb, FilterPanel, FileListView, FileGridView, FileStackView } from "../components";
import { useDirectoryContents, searchDeepType, searchDeepTerm } from "../utils";
import { usePathStore, useRecentFilesStore, useFileSystemStore } from "../store";
import { useFileInfoStore } from "@haven/core/store";

// stores
const useFileSystem = useFileSystemStore();
const usePath = usePathStore();
const useRecentFiles = useRecentFilesStore();
const useFileInfo = useFileInfoStore();

// state
const viewMode = ref<ITreeNodeView>("list");
const currentDirId = ref("root");
const isSorting = ref(false);
const searchTerm = ref("");
const sortByTags = ref("");
const sortByType = ref<HavenFSEntryType>("none");
const groupBy = ref<HavenFSGroupBy>("none");

useFileSystem.initializeFileSystem();

// navigation
const handleClickNode = async (file: HavenFSItem) => {
  if (file.type === "directory") {
    navigateTo(file.id, file.name);
  } else {
    useRecentFiles.add(file);
    useFileInfo.setFileToRender(file);
    emit("openFile", file);
  }
};

const navigateTo = (id: string, name: string) => {
  usePath.push({ id, name });
  currentDirId.value = id;
};

const navigateAt = (id: string) => {
  const nextIndex = usePath.fullPath.findIndex(item => item.id === id);
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
    handleGoHome();
  }
};

const toggleView = () => {
  viewMode.value = viewMode.value === "list" ? "grid" : "list";
};

// computed
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
  const hasFilters = searchTerm.value || sortByTags.value || sortByType.value !== "none";
  return hasFilters ? filteredContents.value : currentDirectoryContents.value;
});

watch(effectiveContents, val => {
  useFileSystem.setCurrentContent(val);
}, { immediate: true });

const emit = defineEmits<{
  (e: "openFile", file: HavenFSItem): void
}>();
</script>

<template>
  <div class="view-container">
    <Breadcrumb
      v-model:searchTerm="searchTerm"
      :viewMode="viewMode"
      :effectiveContents="effectiveContents"
      @navigate="navigateAt"
      @goBack="handleGoBack"
      @goHome="handleGoHome"
      @toggleView="toggleView"
      @toggleSort="isSorting = !isSorting"
      @add="() => console.log('Add File/Folder')"
    />

    <FilterPanel
      v-if="isSorting"
      :sortByType="sortByType"
      @update:sortByType="val => sortByType = val"
      :groupBy="groupBy"
      @update:groupBy="val => groupBy = val"
    />

    <FileGridView v-if="viewMode === 'grid'" @onClickNode="handleClickNode" :groupBy="groupBy" />
    <FileListView v-else @onClickNode="handleClickNode" :groupBy="groupBy" />

    <FileStackView v-if="viewMode === 'grid'" @onClickNode="handleClickNode" :view="'grid'" />
    <FileStackView v-else @onClickNode="handleClickNode" :view="'list'" />
  </div>
</template>

<style scoped lang="scss">
.view-container {
  padding: 1rem;
}
</style>
