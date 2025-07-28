<script setup lang="ts">
import { ref, watch } from 'vue'
import { OField, OSelect } from '@oruga-ui/oruga-next'

interface IProps {
  sortByType: HavenFSEntryType;
  groupBy: HavenFSGroupBy;
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  (e: 'update:sortByType', value: HavenFSEntryType): void;
  (e: 'update:groupBy', value: HavenFSGroupBy): void;
}>()

const selectedType = ref(props.sortByType)
const selectedGroupBy = ref(props.groupBy)

watch(selectedType, (newVal) => emit('update:sortByType', newVal))
watch(selectedGroupBy, (newVal) => emit('update:groupBy', newVal))
</script>

<template>
  <div class="filters">
    <o-field label="Filter by type">
      <o-select v-model="selectedType" placeholder="Select a type" rounded>
        <option value="none">All types</option>
        <option value="file">Files</option>
        <option value="directory">Directories</option>
      </o-select>
    </o-field>

    <o-field label="Group by">
      <o-select v-model="selectedGroupBy" placeholder="Group by" rounded>
        <option value="none">None</option>
        <option value="date">Date</option>
        <option value="type">Type</option>
      </o-select>
    </o-field>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}
.filters select,
.filters input {
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 180px;
  background: white;
}
</style>
