<script setup lang="ts">
import GreetComponent from '@/components/greet-component.vue'
import {useStore}     from '@/store';

const store = useStore()
store.initApp()
</script>

<template>
  <main class="flex-1 flex flex-col gap-y-4 items-center justify-center min-h-screen bg-primary">
    <h1 class='text-4xl'>Welcome to <span class='text-visited font-bold'>Haven</span></h1>
    <img src="/haven_favico.svg" class="size-24" alt="Vue logo"/>
    <GreetComponent/>
  </main>
</template>
