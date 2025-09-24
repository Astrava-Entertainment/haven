<!-- lib/components/DirectorySelector.vue -->
<script setup lang="ts">
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { onMounted, ref } from "vue";

const dirStore = useDirectoryStore();
const defaultDirectory = ref<string | null>(null);

// Change the default directory and update the displayed path
async function changeDefaultDirectory() {
  await dirStore.setDefaultDirectory();
  defaultDirectory.value = await dirStore.getDefaultDirectory();
}

onMounted(async () => {
  defaultDirectory.value = await dirStore.getDefaultDirectory();
});
</script>

<template>
  <div class="p-4">
    <p v-if="defaultDirectory">
      Default path: <strong>{{ defaultDirectory }}</strong>
    </p>
    <p v-else>
      No default directory selected.
    </p>
    <button @click="changeDefaultDirectory" class="btn">Select default path</button>
  </div>
</template>

<style scoped lang="scss">
$primary: #e7e6bf;
$highlight: #e1e093;
$pressed: #eae7c0;
$text: #fffbf8;
$divider: #b4c390;
$muted: #bacdbf;

div {
  padding: 1rem;
  background-color: $muted;
  border-radius: 8px;
  border: 1px solid $divider;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #000;
}

p {
  margin: 0;
  strong {
    color: $primary;
  }
}

button.btn {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: $primary;
  color: #000;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: $highlight;
    transform: translateY(-1px);
  }

  &:active {
    background-color: $pressed;
    transform: translateY(0);
  }
}
</style>
