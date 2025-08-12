<script setup lang="ts">
defineProps<{
  tag?: HavenFSTag
  lib?: HavenFSLibrary
}>();

const defaultColor = '#b5b5b5';
</script>

<template>
  <span v-if="tag || lib" class="tag-pill" :style="{ backgroundColor: tag?.color || defaultColor }" >
    {{ tag?.name || lib?.name }}
  </span>
</template>

<style scoped lang="scss">
.tag-pill {
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
  user-select: none;
}
</style>
