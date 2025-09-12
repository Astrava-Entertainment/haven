<script setup lang="ts">
import { computed } from "vue";
import { useFileInfoStore } from "@haven/core/store";
import { useFileSystemStore } from "@haven/file-system/store";
import ImageRenderer from "./imageRenderer.vue";

// !TODO: Ignore useFileSystemStore we must use the FileInfoStore
const useFileStore = useFileInfoStore();
const useFileSystem = useFileSystemStore();

const currentFile = computed(() => {
  const fileInfo = useFileStore.file as IImportantFileInfo;
  const file = useFileSystem.getFileByID(fileInfo.id);
  console.log("File: ", file);
});
</script>

<template>
  <div>
    <p v-if="currentFile">
      File selected: <strong>{{ currentFile.name }}</strong> ({{ currentFile.type }})
    </p>
    <p v-else>There is no file selected</p>

    <ImageRenderer
      v-if="currentFile.name && currentFile.type === 'image'"
      :file="currentFile"
    />

<!--    <FBXRenderer-->
<!--      v-else-if="currentFile && currentFile.type === 'fbx'"-->
<!--      :file="currentFile"-->
<!--    />-->

<!--    <AudioRenderer-->
<!--      v-else-if="currentFile && currentFile.type === 'audio'"-->
<!--      :file="currentFile"-->
<!--    />-->

<!--    <TextRenderer-->
<!--      v-else-if="currentFile && currentFile.type === 'text'"-->
<!--      :file="currentFile"-->
<!--    />-->

    <p v-else>
      File type not supported
    </p>
  </div>
</template>
