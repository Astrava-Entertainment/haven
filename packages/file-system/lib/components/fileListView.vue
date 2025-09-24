<script setup lang="ts">
import { OTable, OTableColumn } from '@oruga-ui/oruga-next'
import { useFileSystemStore } from '../store'
import NodeName from './nodeName.vue';
import {DateTime} from 'luxon';
import Badges from './badges.vue';
import {connectLibsById, connectTagmapById} from '../utils';

interface IProps {
  groupBy: HavenFSGroupBy
}

const useFileSystem = useFileSystemStore()
const emit = defineEmits(['onClickNode'])
const { groupBy } = defineProps<IProps>()
/**
* Parses an ISO date string and formats it to 'yyyy-MM-dd'.
* @params isoDate dateString in iso format
* @return formatted date string in 'yyyy-MM-dd' format
* @example parseDate('2023-10-01T12:00:00Z') // returns '2023-10-01'
* See more at https://moment.github.io/luxon/#/formatting
*/
const parseDate = (isoDate: string): string => {
  //* Early exit if we have passed an empty string
  if (!isoDate || isoDate.length === 0) return "---";

  const date = DateTime.fromISO(isoDate);
  return date.toFormat('yyyy-MM-dd');
}

const tableData = computed(() =>
  useFileSystem.currentContent.map(item => ({
    ...item,
    date: parseDate(item.metadata?.modified),
    tags: Array.isArray(item.tags) ? item.tags : []
  }))
);

const groupedData = computed(() => {
  if (groupBy === 'none') {
    return [{ group: 'All Items', items: tableData.value }];
  }

  const groups: Record<string, HavenFSItem[]> = {};
  for (const item of tableData.value) {
    const key =
      groupBy === 'type'
        ? item.type
        : groupBy === 'date'
          ? parseDate(item.metadata?.modified)
          : 'Other';

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  return Object.entries(groups).map(([group, items]) => ({ group, items }));
});
</script>

<template>
  <div class="grouped-table">
    <div v-for="groups in groupedData" :key="groups.group">
      <div class="group-header">{{ groups.group }}</div>

      <o-table :data="groups.items" hoverable class="styled-table">
        <o-table-column field="name" label="Name" sortable>
          <template #default="{ row }" >
            <NodeName :file="row" @click="emit('onClickNode', $event)" />
          </template>
        </o-table-column>

        <o-table-column field="type" label="Type" sortable>
          <template #default="{ row }">
            <span class="file-type">{{ row.type }}</span>
          </template>
        </o-table-column>

        <o-table-column field="tags" label="Tags" sortable>
          <template #default="{ row }">
            <div v-if="row.tags && row.tags.length" class="tag-container">
              <Badges
                v-for="tagId in row.tags"
                :key="tagId"
                :tag="connectTagmapById(tagId)"
              />
            </div>
          </template>
        </o-table-column>

        <o-table-column field="libs" label="Libraries" sortable>
          <template #default="{ row }">
            <div v-if="row.libs && row.libs.length" class="lib-container">
              <Badges
                v-for="libId in row.libs"
                :key="libId"
                :lib="connectLibsById(libId)"
              />
            </div>
          </template>
        </o-table-column>

        <o-table-column field="date" label="Date" sortable>
          <template #default="{ row }">
            <span class="file-date">{{ parseDate(row.metadata?.modified) }}</span>
          </template>
        </o-table-column>
      </o-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-header {
  font-weight: 600;
  background-color: $primary;
  padding: 0.6rem 0.75rem;
  border-radius: 6px 6px 0 0;
  margin-top: 1rem;
  color: #000;
  font-size: 1rem;
}

.styled-table {
  width: 100%;
  background-color: $text;
  border: 1px solid $divider;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;

  td,
  th {
    padding: 0.75rem 1rem;
    text-align: left;
  }

  th {
    background-color: $muted;
    font-weight: 600;
    font-size: 0.9rem;
    color: #000;
    border-bottom: 2px solid $divider;
  }

  tr {
    transition: background 0.2s ease;

    &:hover {
      background-color: $pressed;
    }
  }
}

.file-type {
  font-size: 0.85rem;
  color: $link;
  font-weight: 500;
}

.file-date {
  font-size: 0.85rem;
  color: $muted;
}

.tag-container,
.lib-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag-pill {
  background-color: $highlight;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: #000;
  font-weight: 500;
}
</style>
