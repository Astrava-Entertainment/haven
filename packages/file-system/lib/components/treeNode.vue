<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface IProps {
  node: object; // Puedes usar un tipo más específico si lo tienes
  mode?: ITreeNodeMode;
  view?: ITreeNodeView;
}

const props = defineProps<IProps>();
const emits = defineEmits(['navigate']);

const isOpen = ref(false);

const handleClick = () => {
  const { node, mode } = props;
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
  }
};
</script>

<template>
  <li :class="[mode === 'content' ? view : '']">
    <div @click="handleClick" style="cursor: pointer;">
      <em v-if="node.isBackLink">..</em>
      <strong v-else-if="node.type === 'directory'">{{ node.name }}</strong>
      <span v-else>{{ node.name }}</span>
    </div>

    <!-- Children shown only in tree mode -->
    <ul :class="view" v-if="mode === 'tree' && node.type === 'directory' && isOpen && node.children?.length">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :mode="mode"
        :view="view"
        @navigate="$emit('navigate', $event)"
      />
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
