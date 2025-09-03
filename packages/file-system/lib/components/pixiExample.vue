<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFileSystemStore } from "../store";

interface IProps {
  file: HavenFSItem;
}

const { file } = defineProps<IProps>();
const useFileSystem = useFileSystemStore();

const image = ref<string>("");

onMounted(() => {
  const bucket = useFileSystem.currentBucket;
  if (file.type !== "directory") {
    image.value = `files/${bucket}/${file.name}`;
  }
});

</script>

<template>
  <figure v-if='image' class="pixi-wrapper">
    <img :src="image" :alt="file.name" />
  </figure>
</template>

<style scoped>
.pixi-wrapper {
  width: 100%;
  height: 100%;
  margin: 0;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
</style>
