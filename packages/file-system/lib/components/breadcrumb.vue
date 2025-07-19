<script setup lang="ts">
import { usePathStore } from '../store'

const usePath = usePathStore()

const emits = defineEmits(['navigate']);

</script>

<template>
  <section style="display: flex; flex-direction: row; gap: 0.25rem;">
    <div
      v-for="(item, index) in usePath.fullPath"
      :key="item.id"
      @click="() => emits('navigate', item.id)"
      style="cursor: pointer; color: blue;"
    >
      <span v-if="index !== 0">/</span>{{ item.name }}
    </div>
  </section>
</template>

<style scoped lang="scss">
</style>
