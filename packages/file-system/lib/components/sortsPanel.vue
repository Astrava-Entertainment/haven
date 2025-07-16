<script setup lang="ts">

defineProps<{
  tagFilter: string;
  selectedType: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:tagFilter', value: string): void;
  (e: 'update:selectedType', value: string): void;
  (e: 'update:fromDate', value: Date): void;
  (e: 'update:toDate', value: Date): void;
}>();
</script>

<template>
  <div class="filters">
    <select :value="selectedType" @change="e => emit('update:selectedType', e.target?.value)">
      <option value="none">All types</option>
      <option value="file">Files</option>
      <option value="directory">Directories</option>
    </select>

    <input
      type="date"
      :value="fromDate"
      @input="e => emit('update:fromDate', e.target?.value)"
    />

    <input
      type="date"
      :value="toDate"
      @input="e => emit('update:toDate', e.target?.value)"
    />

    <input
      placeholder="Comma-separated tags"
      :value="tagFilter"
      @input="e => emit('update:tagFilter', e.target?.value)"
      type="text"
    />
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
