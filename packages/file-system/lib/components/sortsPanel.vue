<script setup lang="ts">
interface IProps {
  tagFilter: string;
  selectedType: HavenFSEntryType;
  sortOrder: string;
}

defineProps<IProps>()

const emit = defineEmits<{
  (e: 'update:tagFilter', value: string): void;
  (e: 'update:selectedType', value: HavenFSEntryType): void;
  (e: 'update:sortOrder', value: 'asc' | 'desc'): void;
}>()
</script>


<template>
  <div class="filters">
    <select :value="selectedType" @change="e => emit('update:selectedType', e.target?.value)">
      <option value="none">All types</option>
      <option value="file">Files</option>
      <option value="directory">Directories</option>
    </select>

    <select :value="sortOrder" @change="e => emit('update:sortOrder', e.target?.value)">
      <option value="desc">Newest first</option>
      <option value="asc">Oldest first</option>
    </select>
  </div>
<!-- LOGO SORT -->
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
