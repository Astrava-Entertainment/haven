<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import {PixiApp} from '../utils/pixiApp.ts';

const pixiContainer = ref(null);
const assetUrl = ref("https://pixijs.com/assets/bunny.png");

let pixiApp;

onMounted(async () => {
  pixiApp = new PixiApp(pixiContainer.value);
  await pixiApp.init();
  await pixiApp.loadGrid(assetUrl.value);
});

onBeforeUnmount(() => {
  pixiApp.destroy();
});

function loadAsset() {
  pixiApp.loadGrid(assetUrl.value);
}
</script>

<template>
  <div>
    <div ref="pixiContainer" class="pixi-wrapper"></div>

    <div class="controls">
      <input v-model="assetUrl" placeholder="URL del asset" />
      <button @click="loadAsset">Cargar Asset</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pixi-wrapper {
  width: 100%;
  height: 80vh;
  border: 1px solid #333;
}
.controls {
  margin-top: 10px;
}
</style>
