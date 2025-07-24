<script setup lang="ts">
  import {useFileSystemStore} from '../store';

  const useFileSystem = useFileSystemStore();
  console.log(useFileSystem.currentContent[0].references);
</script>

<template>
  <div v-for='content in useFileSystem.currentContent' :key="content.id">
    <div v-if="content.references !== undefined">
      From:
      {{content.id}}
      <br>
      <span v-for='(reference) in content.references' :key="reference.to">
        To:
        {{reference.to}}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
