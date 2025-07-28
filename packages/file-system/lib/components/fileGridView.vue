<script setup lang="ts">
import { useFileSystemStore } from '../store'
import NodeName from './nodeName.vue'
import TagPill from './tagPill.vue'
import { DateTime } from 'luxon'

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
          @click="emit('onClickNode', item)"
        >
          <NodeName :file="item" />
          <div class="type">{{ item.type }}</div>
          <div v-if="item.tags?.length" class="tags">
            <TagPill
              v-for="tagObject in item.tags"
              :key="tagObject.name"
              :havenTag="tagObject"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-header {
  font-weight: bold;
  background-color: #e9f1f7;
  color: #2a2f45;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  text-transform: capitalize;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.grid-item {
  background-color: white;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #f9f9f9;
    transform: translateY(-2px);
  }

  .type {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}
</style>
