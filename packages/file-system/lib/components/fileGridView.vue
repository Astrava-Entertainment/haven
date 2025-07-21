<script setup lang="ts">
import { useFileSystemStore } from '../store';
import NodeName from './nodeName.vue';

const useFileSystem = useFileSystemStore();

const emit = defineEmits(['onClickNode']);
</script>

<template>
  <div class="grid-container">
    <div
      class="grid-item"
      v-for="item in useFileSystem.currentContent"
      :key="item.id"
      @click="emit('onClickNode', item)"
    >
      <NodeName :file='item' @click="emit('onClickNode', $event)"/>
      <div class="type">{{ item.type }}</div>
      <div v-if="item.tags?.length" class="tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.grid-item {
  background-color: white;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #f9f9f9;
    transform: translateY(-2px);
  }

  .name {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .type {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;

    .tag {
      background-color: #eee;
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
  }
}
</style>
