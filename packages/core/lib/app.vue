<script setup lang="ts">
import { useStore }  from '@/store';
import FileSystem from '../../file-system/lib/fileSystem.vue';
import {Hotbar, Customization, GreetComponent} from '@/components';
const store = useStore()
store.initApp()

const page = ref<Page>('FileSystem');

</script>

<template>
  <main class="haven" @contextmenu.prevent>
    <Hotbar @update:page="val => page = val"/>
    <FileSystem v-if='page === "FileSystem"'/>
    <Customization v-else-if='page === "Customization"'/>
    <GreetComponent v-else/>
  </main>
</template>

<style lang='scss'>
$body-text: #000 !default;
body {
  margin: 0;
}

html {
  color: $body-text;
}

.haven {
  user-select: none;
  height: 100vh;
  width: 100vw;
  display: flex;
  background-color: $primary;
  flex-direction: column;
}
</style>
