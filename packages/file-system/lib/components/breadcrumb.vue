<script setup lang="ts">
import { usePathStore } from '@haven/file-system/store'
import { PhArrowUp, PhArrowLeft, PhPlus } from '@phosphor-icons/vue'

const usePath = usePathStore()

interface IProps {
  searchTerm: string;
  viewMode: string;
  effectiveContents: HavenFSItem[];
}

const props = defineProps<IProps>()

const emit = defineEmits([
  'navigate',
  'goHome',
  'goBack',
  'add',
  'toggleSort',
  'toggleView',
  'update:searchTerm'
])
</script>

<template>
  <section class="breadcrumb">
    <div class="path-controls">
      <div class="actions">
        <PhPlus @click="$emit('add')" :size="22" weight="bold" class="phosphor-button" />
        <PhArrowLeft @click="emit('goBack')" :size="22" weight="bold" class="phosphor-button"/>
        <PhArrowUp @click="emit('goHome')" :size="22" weight="bold" class="phosphor-button"/>
      </div>

      <div class="path">
        <div
          v-for="(item, index) in usePath.fullPath"
          :key="item.id"
          @click="() => emit('navigate', item.id)"
          class="path-item"
        >
          <span v-if="index !== 0" class="divider">/</span>{{ item.name }}
        </div>
      </div>

      <input
        class="search-input"
        placeholder="Search..."
        :value="props.searchTerm"
        @input="$emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
        type="text"
      />

      <div class="controls-bar">
        <p class="content-count">Content: {{ props.effectiveContents?.length ?? 0 }}</p>
        <button @click="$emit('toggleView')">
          {{ props.viewMode === 'list' ? 'Grid' : 'List' }}
        </button>
        <button @click="$emit('toggleSort')">Sort</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.breadcrumb {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  background-color: $text;
  border: 1px solid $divider;
  border-radius: 10px;
}

.path-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Phosphor Buttons Icons */
.actions {
  display: flex;
  gap: 0.5rem;

  .phosphor-button {
    background-color: $primary;
    padding: 0.4rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: $highlight;
    }
    &:active {
      background-color: $pressed;
    }
  }
}

/* Path */
.path {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25rem;
  color: $link;
  font-weight: 500;

  .path-item {
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: $visited;
    }
  }

  .divider {
    margin: 0 0.25rem;
    color: $divider;
  }
}

/* Search Input */
.search-input {
  flex: 1;
  min-width: 150px;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid $divider;
  background-color: #fff;
  transition: border 0.2s;

  &:focus {
    outline: none;
    border: 1px solid $highlight;
  }
}

/* Controls */
.controls-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .content-count {
    font-size: 0.85rem;
    color: $muted;
  }

  button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    background-color: $primary;
    color: black;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: $highlight;
    }
    &:active {
      background-color: $pressed;
    }
  }
}
</style>
