<script setup lang="ts">
import { computed } from 'vue'
import { useFileMultiselectStore, useFileSystemStore } from '../store'
import type { HavenFSItem } from '../types'
import {connectTagmapById, ParseDate} from '../utils'

const useFileMultiselect = useFileMultiselectStore()
const useFileSystem = useFileSystemStore()

const selectedFile = computed<HavenFSItem | null>(() =>
  useFileSystem.getFileByID(useFileMultiselect.lastSelectedId)
)

const defaultColor = '#b5b5b5'

console.log(selectedFile.tags)
</script>

<template>
  <div v-if="selectedFile" class="file-card">
    <div class="file-info">
      <h3 class="file-name">{{ selectedFile.name }}</h3>
      <span class="file-type">({{ selectedFile.type }})</span>
    </div>

    <div class="file-meta">
      <span>ID: {{ selectedFile.id }}</span>
      <span v-if="selectedFile.size">• {{ selectedFile.size }} bytes</span>
      <span v-if="selectedFile.metadata?.mimetype">• {{ selectedFile.metadata.mimetype }}</span>
      <span v-if="selectedFile.metadata?.modified">• Modified: {{ ParseDate(selectedFile.metadata.modified) }}</span>
    </div>

    <div class="file-tags" v-if="selectedFile.tags?.length">
      <span
        v-for="tag in selectedFile.tags"
        :key="tag"
        class="tag"
        :style="{ backgroundColor: connectTagmapById(tag)?.color || defaultColor }"
      >
        {{ connectTagmapById(tag).name }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-card {
  display: flex;
  justify-content: space-between;
  background: $text;
  padding: 2rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.file-type {
  font-size: 0.85rem;
  color: #555;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #555;
}

.file-tags {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.tag {
  color: #333;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
}
</style>
