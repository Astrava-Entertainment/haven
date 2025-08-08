<script setup lang="ts">
import { ref } from 'vue';
import NodeName from './nodeName.vue';

interface IProps {
  title: string;
  content?: HavenFSItem[];
  tags?: ITagGroup[];
  isBucket?: boolean;
  isBucketOpen?: boolean;
}

const { title, content, tags, isBucket = false, isBucketOpen = false } = defineProps<IProps>();
const emit = defineEmits(['navigate', 'toggleBucket']);

const isOpen = ref(false);

const isEmpty = computed(() => {
  if (tags) {
    return tags.length === 0 || tags.every(group => group.files.length === 0);
  }
  return !content || content.length === 0;
});

const handleToggle = (): void => {
  if (isBucket) {
    emit('toggleBucket');
  }
  else {
    isOpen.value = !isOpen.value;
  }
}

const showContent = computed(() => {
  console.log("isBucketOpen: ", isBucketOpen)
  console.log("isOpen: ", isOpen)
  console.log("isBucket ? isBucketOpen : isOpen: ", isBucket ? isBucketOpen : isOpen)
  return isBucket ? isBucketOpen : isOpen;
});
</script>

<template>
  <section class="tree-section">
    <div class="tree-header" @click="handleToggle">
      <span class="arrow" :class="{ rotated: showContent }">▶</span>
      {{ title }}
    </div>

    <ul v-show="showContent" class="tree-list">
      <li v-if="isEmpty" class="empty">No items to display</li>

      <template v-if="!tags && !isEmpty">
        <li v-for="node in content" :key="node.id" @click="emit('navigate', node)">
          <NodeName :file="node" />
        </li>
      </template>

      <template v-else-if="!isEmpty">
        <li v-for="{ tag, files } in tags" :key="tag">
          <div class="tag-group">{{ tag }}</div>
          <ul class="nested">
            <li v-for="file in files" :key="file.id" @click="emit('navigate', file)">
              <NodeName :file="file" />
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.tree-section {
  margin-bottom: 1rem;
}

.tree-header {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}
.arrow.rotated {
  transform: rotate(90deg);
}

.tree-list {
  list-style: none;
  padding-left: 1rem;

  li {
    cursor: pointer;
    padding: 0.3rem 0.4rem;
    border-radius: 4px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.nested {
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.3rem;
}

.tag-group {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.4rem;
}
</style>
