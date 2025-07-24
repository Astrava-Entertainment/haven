<script setup lang="ts">
  import {useFileSystemStore} from '../store';
  import NodeName from "./nodeName.vue";

  const emit = defineEmits(['onClickNode'])

  const useFileSystem = useFileSystemStore();
  function getRef(refId: string): HavenFSItem | undefined {
    return useFileSystem.getFileByID(refId) || useFileSystem.getDirectoryByID(refId);
  }

</script>

<template>
  <div v-for='(content,index) in useFileSystem.currentContent' :key="content.id+index" style="background-color: white; margin-top: 2rem">
    <details v-if="content.references !== undefined" style="padding: 1rem;">
      <summary> {{content.name}} </summary>
      <div v-for='(reference,index) in content.references' :key="reference.to+index" style="display: flex; flex-direction: column">
        <NodeName :file="getRef(reference.to)" @click="emit('onClickNode', $event)"/>
      </div>
    </details>
  </div>
</template>

<style scoped lang="scss">

</style>
