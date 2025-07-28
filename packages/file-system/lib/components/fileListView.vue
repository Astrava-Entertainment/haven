<script setup lang="ts">
import { OTable, OTableColumn } from '@oruga-ui/oruga-next'
import { useFileSystemStore } from '../store'
import NodeName from './nodeName.vue';
import {DateTime}               from 'luxon';
import TagPill from './tagPill.vue';

const useFileSystem = useFileSystemStore()
const emit = defineEmits(['onClickNode'])

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

</script>

<template>
  <o-table class="styled-table" :data="tableData" hoverable>
    <o-table-column field="name" label="Name" sortable>
      <template #default="{ row }">
        <NodeName :file='row' @click="emit('onClickNode', $event)"/>
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
          <TagPill
            v-for="tagObject in row.tags"
            :key="tagObject.name"
            :havenTag="tagObject"
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
</template>

<style scoped lang="scss">
.styled-table {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;

  td, th {
    padding: 0.75rem 1rem;
  }

  th {
    background-color: #f6f6f6;
    font-weight: 600;
    font-size: 0.95rem;
    color: #333;
  }

  tr {
    transition: background 0.2s ease;

    &:hover {
      background-color: #f9f9f9;
    }
  }
}

.file-type {
  font-size: 0.85rem;
  color: #666;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  background-color: #eaeaea;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: #333;
}
</style>
