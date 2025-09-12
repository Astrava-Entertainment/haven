<script setup lang="ts">

interface IProps {
  file: string
}

const { file } = defineProps<IProps>()

</script>

<template>
  <img :src="file" alt=''>
</template>

<style scoped lang="scss">

</style>
