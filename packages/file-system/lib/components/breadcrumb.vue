<script setup lang="ts">
import { usePathStore } from '../store'
import {PhArrowUp, PhArrowLeft} from '@phosphor-icons/vue'

const usePath = usePathStore()

const emits = defineEmits(['navigate', 'goHome', 'goBack']);

</script>

<template>
  <section style="display: flex; flex-direction: row; gap: 0.25rem;">
    <PhArrowLeft @click="emits('goBack')" :size="24" weight="bold" class='phosphor-button'/>
    <PhArrowUp @click="emits('goHome')" :size="24" weight="bold" class='phosphor-button'/>
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
.phosphor-button {
  cursor: pointer;
}
</style>
