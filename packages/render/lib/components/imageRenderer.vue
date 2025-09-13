<script setup lang="ts">

interface IProps {
  file: string
  path: string
}

const { file, path } = defineProps<IProps>()
console.log(file, path)
</script>

<template>
  <img :src="path" :alt='file'>
</template>

<style scoped lang="scss">

</style>
