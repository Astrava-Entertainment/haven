<script setup lang="ts">
import { ref, watch } from "vue";
import { useFileInfoStore } from "@haven/core/store";
import ImageRenderer from "./imageRenderer.vue";
import GlbRender from './glbRender.vue';

const useFileInfo = useFileInfoStore();
const currentFile = ref<IImportantFileInfo>(useFileInfo.file);

const filePath = ref<string | null>(null);

watch(() => currentFile, async (file) => {
    if (!file) {
      filePath.value = null;
      return;
    }

    try {
      const res = await useFileInfo.getFileFromProject();
      filePath.value = res || null;
      console.log("File path:", filePath.value);
      console.log("File:", file);
    } catch (err) {
      console.error("Error fetching file path:", err);
      filePath.value = null;
    }
  },
  { immediate: true }
);

</script>

<template>
  <div>
    <p v-if="currentFile">
      File selected: <strong>{{ currentFile.name }}</strong> ({{ currentFile.type }})
      <span v-if="filePath"> - Path: <strong>{{ filePath }}</strong></span>
    </p>
    <p v-else>There is no file selected</p>

    <ImageRenderer
      v-if="currentFile?.type === 'image' && filePath"
      :file="currentFile"
      :path="filePath"
    />

    <GlbRender
      v-if="currentFile?.type === 'model' && filePath && currentFile?.extension === 'glb'"
      :file="currentFile"
      :path="filePath"
    />

    <p v-else-if="currentFile">File type not supported</p>
  </div>
</template>
