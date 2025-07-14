<script setup lang="ts">
import GreetComponent from '@/components/greet-component.vue'
import {useStore}     from '@/store';

const store = useStore()
store.initApp()
</script>

<template>
  <main class="">
    <GreetComponent/>
  </main>
</template>

<style lang='scss'>
$primary: red;

.haven {
  background-color: $primary;
}
</style>
