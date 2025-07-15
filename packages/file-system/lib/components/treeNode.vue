<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

// !TODO: Add mode and view 'type'
const props = defineProps({
  node: { type: Object, required: true },
  mode: { type: String, default: 'tree' }, // 'tree' / 'content'
  view: { type: String, default: 'list' } // 'list' / 'grid'
});

const emits = defineEmits(['navigate']);

const isOpen = ref(false);

const handleClick = () => {
  if (props.mode === 'content') {
    if (props.node.isBackLink) {
      emits('navigate', props.node.parent);
    } else if (props.node.type === 'directory') {
      emits('navigate', props.node.id);
    } else {
      // TODO: Open file
      console.log('Open file: ', props.node.name);
    }
  } else {
    if (props.node.type === 'directory') {
      isOpen.value = !isOpen.value;
    } else {
      // TODO: Open file
      console.log('Open file: ', props.node.name);
    }
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
