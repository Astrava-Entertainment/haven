<script setup lang="ts">
import { OTable, OTableColumn } from '@oruga-ui/oruga-next'
import { useFileSystemStore } from '../store'
import NodeName from './nodeName.vue';

const useFileSystem = useFileSystemStore()
const emit = defineEmits(['onClickNode'])

const parseDate = (date: string): string => {
  if (date === undefined) return "";
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${day}-${month}-${year}`;
}

const tableData = computed(() =>
  useFileSystem.currentContent.map(item => ({
    ...item,
    date: parseDate(item.metadata?.modified),
    tags: Array.isArray(item.tags) ? item.tags.join(',') : ''
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
        <div v-if="row.tags" class="tag-container">
          <span v-for="tag in row.tags.split(',')" :key="tag" class="tag-pill" >
            {{ tag }}
          </span>
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
