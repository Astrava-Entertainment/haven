<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFileSystemStore } from "../store";
import { useFileInfoStore } from "@haven/core/store";


interface IProps {
  file: HavenFSItem;
}

const { file } = defineProps<IProps>();
const useFileInfo = useFileInfoStore();

const image = ref<string>("");

onMounted(async () => {
  const res = await useFileInfo.getFilePath(file.name);
  image.value = res || null;
  console.log("Loaded image: ", image.value);
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
  aspect-ratio: 5/4;
  object-position: center;
  object-fit: cover;
  display: block;
}
</style>
