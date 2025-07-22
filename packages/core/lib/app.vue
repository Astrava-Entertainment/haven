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

$body-text: #000 !default;
body {
  margin: 0;
}

html {
  color: $body-text;
}

.haven {
  height: 100vh;
  width: 100vw;
  display: flex;
  background-color: $primary;
}
</style>
