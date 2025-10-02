<script setup lang="ts">
import { onMounted }  from 'vue'
import { useDirectoryStore, useAuthStore } from "@/store"
import FileSystem from '@haven/file-system/fileSystem.vue';
import {Hotbar, Customization, LoginPage} from '@/components';

const page = ref<Page>('FileSystem');

const directoryStore = useDirectoryStore();
const auth = useAuthStore();

onMounted(async () => {
  // await directoryStore.init();
});
</script>

<template>
  <LoginPage v-if='!auth.isLoggedIn'/>
  <main v-else class="haven" @contextmenu.prevent>
    <Hotbar @update:page="val => page = val"/>
    <FileSystem v-if='page === "FileSystem"'/>
    <Customization v-else-if='page === "Customization"'/>
    <Settings v-else-if='page === "Settings"'/>
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
