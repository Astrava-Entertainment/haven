<script setup lang="ts">
defineProps<{
  havenTag: HavenTag
}>();

</script>

<template>
  <span class="tag-pill" :style="{ backgroundColor: havenTag.color }">
    {{ havenTag.name }}
  </span>
</template>

<style scoped lang="scss">
.tag-pill {
  background-color: #e0e0e0;
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
  user-select: none;
}
</style>
