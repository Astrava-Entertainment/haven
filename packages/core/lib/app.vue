<script setup lang="ts">
import {useStore}  from '@/store';
import FileSystem from '../../file-system/lib/fileSystem.vue';
const store = useStore()
store.initApp()
</script>

<template>
  <main class="haven" @contextmenu.prevent>
    <FileSystem />
  </main>
</template>

<style lang='scss'>
// ?TODO: this should be global
@import '@haven/design-system/colors.scss';
@import '@haven/design-system/global.css';

body {
  margin: 0;
}

.haven {
  height: 100vh;
  display: flex;
  background-color: $primary;
  color: black;
}
</style>
