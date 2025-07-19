<script setup lang="ts">
import { ref } from 'vue';
import {default as TagPill} from './tagPill.vue'

interface IProps {
  node: object;
  mode?: ITreeNodeMode;
  view?: ITreeNodeView;
}

const props = defineProps<IProps>();
const emits = defineEmits(['navigate']);

const isOpen = ref(false);

const handleClick = () => {
  const { node, mode } = props;
  console.log(node)
  const isDir = node.type === 'directory';

  if (mode === 'content') {
    if (node.isBackLink) return emits('navigate', node.parent);
    if (isDir) return emits('navigate', node.id);
  }

  if (isDir) {
    isOpen.value = !isOpen.value;
  } else {
    // TODO: Open file
    console.log('Open file:', node.name);
    useRecentFile.add(node)
  }
};
</script>

<template>
  <li :class="[mode === 'content' ? view : '']">
    <div @click="handleClick" style="cursor: pointer;">
      <em v-if="node.isBackLink">..</em>
      <strong v-else-if="node.type === 'directory'">{{ node.name }}</strong>
      <div
        v-else
        style="display: flex; justify-content: space-between; align-items: center;"
      >
        <p style="margin: 0;">{{ node.name }}</p>

        <div
          v-if="Array.isArray(node.tags) && node.tags.length"
          style="display: flex; gap: 0.5rem;"
        >
          <TagPill v-for="tag in node.tags" :key="tag" :label="tag" />
        </div>
      </div>
    </div>

    <!-- Children shown only in tree mode -->
    <ul :class="view" v-if="mode === 'tree' && node.type === 'directory' && isOpen">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :mode="mode"
        :view="view"
        @navigate="$emit('navigate', $event)"
      />
      <li v-if="!node.children?.length">📂 No hay hijos</li>
    </ul>
  </li>
</template>

<style lang='scss'>
li.grid {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  background-color: white;
}
li.list {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}
</style>
