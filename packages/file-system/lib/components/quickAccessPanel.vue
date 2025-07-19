<script setup lang="ts">

import {useRecentFilesStore} from '../store';

const useRecentFiles = useRecentFilesStore();
const emits = defineEmits(['navigate'])
</script>

<template>
<!-- Tags Fold -->

<!-- Recent Opened Files -->
  <h3>Recent Opened Files</h3>
  <div v-for='(file, index) in useRecentFiles.recentOpenedFiles' :key='index'>
    <div @click="() => emits('navigate', file)">
      {{file.name}}
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
