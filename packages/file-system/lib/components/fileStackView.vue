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
div[v-for] {
  background-color: $text;
  border: 1px solid $divider;
  border-radius: 8px;
  margin-top: 1.5rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

details {
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid $divider;
  border-radius: 6px;
  transition: background 0.2s ease;

  summary {
    font-weight: 600;
    font-size: 1rem;
    color: #000;
    outline: none;
    cursor: pointer;
  }

  div[v-for] {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;

    NodeName {
      padding: 0.3rem 0.5rem;
      border-radius: 6px;
      transition: background 0.2s ease;
      cursor: pointer;

      &:hover {
        background-color: $highlight;
      }
    }
  }
}
</style>
