<script setup lang="ts">
import DirectorySelector from "@/components/defaultDirectory.vue";

const emit = defineEmits<{
  (e: 'update:page', value: string): void;
}>()

</script>

<template>
  <div class='hotbar-main'>
    <div>
      <button @click='emit("update:page", "FileSystem")'>File System</button>
    </div>
    <div>
      <button @click='emit("update:page", "Customization")'>Customization</button>
    </div>
    <div>
      <button @click='emit("update:page", "Render")'>Render</button>
    </div>
    <DirectorySelector />
  </div>
</template>

<style scoped lang="scss">
.hotbar-main {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  justify-content: center;
}
</style>
