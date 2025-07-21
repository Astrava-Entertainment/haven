<script setup lang="ts">
import { usePathStore } from '../store'
import {PhArrowUp, PhArrowLeft} from '@phosphor-icons/vue'

const usePath = usePathStore()

const emit = defineEmits(['navigate', 'goHome', 'goBack']);

</script>

<template>
  <section style="display: flex; flex-direction: row; gap: 0.25rem;">
    <PhArrowLeft @click="emit('goBack')" :size="24" weight="bold" class='phosphor-button'/>
    <PhArrowUp @click="emit('goHome')" :size="24" weight="bold" class='phosphor-button'/>
    <div
      v-for="(item, index) in usePath.fullPath"
      :key="item.id"
      @click="() => emit('navigate', item.id)"
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
