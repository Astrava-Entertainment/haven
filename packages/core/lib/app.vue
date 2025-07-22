<script setup lang="ts">
import {useStore}  from '@/store';
import FileSystem from '../../file-system/lib/fileSystem.vue';

// import {Bramble} from 'bramble-parser';
// import HavenFS from '@haven/examples/example.havenfs'
// const bramble = new Bramble(HavenFS)
// bramble.run();
// bramble.getJSON();


const store = useStore()
store.initApp()
</script>

<template>
  <main class="haven">
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
