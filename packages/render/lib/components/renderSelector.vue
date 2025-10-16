<script setup lang="ts">
import { ref, watch } from "vue";
import { useFileInfoStore } from "@haven/core/store";
import ImageRenderer from "./imageRenderer.vue";
import ModelsRender from './modelsRender.vue';
import TextRender from './textRender.vue';

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
    <p v-if='!currentFile'>There is no file selected</p>
    <template v-if="currentFile && filePath">
      <TextRender
        v-if="currentFile.type === 'text'"
        :file="currentFile"
        :path="filePath"
      />
      <ImageRenderer
        v-else-if="currentFile.type === 'image'"
        :file="currentFile"
        :path="filePath"
      />
      <ModelsRender
        v-else-if="currentFile.type === 'model'"
        :file="currentFile"
        :path="filePath"
      />
      <p v-else>File type not supported</p>
    </template>
  </div>
</template>

