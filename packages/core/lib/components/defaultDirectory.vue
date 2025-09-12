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
