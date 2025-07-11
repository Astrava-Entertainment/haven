<script setup lang="ts">
  import { useStore } from './store'
  // import '@haven/design-system/tailwind.css'

  const store = useStore()
  store.initApp()
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-4xl">Welcome to Haven</h1>
    <img src="/haven_favico.svg" class="size-24" alt="Haven logo"/>
  </main>
</template>

<style scoped >
.example {
  width: 40px;
  height: 40px;
}
</style>
