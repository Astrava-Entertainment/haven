<script setup lang="ts">
import DirectorySelector from "@/components/defaultDirectory.vue";
import {usePathStore} from '@haven/file-system/store';

const usePath = usePathStore();

const emit = defineEmits<{
  (e: 'update:page', value: string): void;
}>()

const goToFileSystem = () => {
  usePath.reset();
  emit('update:page', 'FileSystem');
}
</script>

<template>
  <div class="hotbar-main">
    <div class="hotbar-buttons">
      <button @click="goToFileSystem">File System</button>
      <button @click='emit("update:page", "Customization")'>Customization</button>
      <button @click='emit("update:page", "Render")'>Render</button>
    </div>
    <div class="hotbar-directory">
      <DirectorySelector />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hotbar-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: $muted;
  border-bottom: 1px solid $visited;
}

.hotbar-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    background-color: $primary;
    color: #000;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    &:hover {
      background-color: $highlight;
      transform: translateY(-2px);
    }

    &:active {
      background-color: $pressed;
      transform: translateY(0);
    }
  }
}
</style>
