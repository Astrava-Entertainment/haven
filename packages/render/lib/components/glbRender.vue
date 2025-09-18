<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { BabylonRenderer } from "../babylon.ts"

interface IProps {
  file: string
  path: string
}

const { file, path } = defineProps<IProps>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: BabylonRenderer | null = null

onMounted(async () => {
  if (!canvasRef.value) return
  renderer = new BabylonRenderer(canvasRef.value, path, file)
  await renderer.init()
})

onBeforeUnmount(() => {
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="babylon-canvas"></canvas>
</template>

<style scoped>
.babylon-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
