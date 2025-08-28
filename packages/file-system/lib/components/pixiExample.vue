
<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { PixiApp } from "../utils/pixiApp.js";
import {useFileSystemStore} from '../store';

interface IProps {
  file: HavenFSItem
}

const { file } = defineProps<IProps>()
const useFileSystem = useFileSystemStore();

const pixiRoot = ref(null);
let pixiApp;

onMounted(async () => {
  const bucket = useFileSystem.currentBucket;
  pixiApp = new PixiApp(pixiRoot.value);
  await pixiApp.init();
  await pixiApp.loadGrid(`files/${bucket}/${file.name}`);
  console.log("Mounted: ", file)
});

onBeforeUnmount(() => {
  pixiApp.destroy();
});
</script>

<template>
  <div ref="pixiRoot" class="pixi-wrapper"></div>
</template>

<style scoped>
.pixi-wrapper {
  width: 100%;
  height: 100%;
}
canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>

