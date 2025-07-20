<script setup lang="ts">
import { QuickAccessPanel, TreeNode } from './index.ts'
import { useFileSystemStore } from '../store'

const emits = defineEmits(['navigate'])
const useFileSystem = useFileSystemStore()
</script>

<template>
  <section class="sidebar-container">
    <h3 class="sidebar-title">Sidebar</h3>
    <ul class="file-list">
      <li
        class="file-item"
        v-for="node in useFileSystem.currentContent"
        :key="node.id"
        @click="emits('navigate', node)"
      >
        <div class="file-name">
          <strong v-if="node.type === 'directory'">/{{node.name}}</strong>
          <span v-else>{{node.name}}</span>
        </div>
      </li>
    </ul>
    <QuickAccessPanel @navigate="emits('navigate', $event)" />
  </section>
</template>

<style scoped lang="scss">
@import '@haven/design-system/colors.scss';

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
