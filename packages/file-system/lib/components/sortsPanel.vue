<script setup lang="ts">
interface IProps {
  sortByType: HavenFSEntryType;
}

const { sortByType } = defineProps<IProps>()

const emit = defineEmits<{
  (e: 'update:selectType', value: HavenFSEntryType): void;
}>()

</script>

<template>
  <div class="filters">
    <select :value="sortByType" @change="e => emit('update:selectType', e.target?.value as HavenFSEntryType)">
      <option value="none">All types</option>
      <option value="file">Files</option>
      <option value="directory">Directories</option>
    </select>
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
