<script setup lang="ts">
import { useFileSystemStore } from '../store'
import NodeName from './nodeName.vue'
import Badges from './badges.vue'
import { DateTime } from 'luxon'
import PixiExample from './pixiExample.vue';

interface IProps {
  groupBy: HavenFSGroupBy
}

const { groupBy } = defineProps<IProps>()
const emit = defineEmits(['onClickNode'])

const useFileSystem = useFileSystemStore()

const parseDate = (isoDate: string): string => {
  if (!isoDate || isoDate.length === 0) return "---"
  const date = DateTime.fromISO(isoDate)
  return date.toFormat('yyyy-MM-dd')
}

const cardData = computed(() =>
  useFileSystem.currentContent.map(item => ({
    ...item,
    date: parseDate(item.metadata?.modified),
    tags: Array.isArray(item.tags) ? item.tags : []
  }))
)

const groupedData = computed(() => {
  if (groupBy === 'none') {
    return [{ group: 'All Items', items: cardData.value }]
  }

  const groups: Record<string, HavenFSItem[]> = {}
  for (const item of cardData.value) {
    const key =
      groupBy === 'type'
        ? item.type
        : groupBy === 'date'
          ? parseDate(item.metadata?.modified)
          : 'Other'

    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }

  return Object.entries(groups).map(([group, items]) => ({ group, items }))
})
</script>

<template>
  <div class="grouped-cards">
    <div v-for="groups in groupedData" :key="groups.group" class="group-section">
      <div class="group-header">{{ groups.group }}</div>
      <div class="grid-container">
        <div
          class="grid-item"
          v-for="item in groups.items"
          :key="item.id"
        >
          <NodeName :file="item" @click="emit('onClickNode', $event)" />
          <div class="type">{{ item.type }}</div>
          <div v-if="item.tags?.length" class="tags">
            <Badges
              v-for="tagObject in item.tags"
              :key="tagObject.name"
              :havenTag="tagObject"
            />
          </div>
        <pixi-example :file='item'/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-header {
  font-weight: 600;
  background-color: $primary;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  text-transform: capitalize;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.grid-item {
  background-color: $text;
  border: 1px solid $divider;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  height: 260px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);

  &:hover {
    background-color: $pressed;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .type {
    font-size: 0.85rem;
    font-weight: 500;
    color: $link;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.5rem;

    .tag-pill {
      background-color: $highlight;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #000;
    }
  }

  pixi-example {
    margin-top: auto;
  }
}
</style>
