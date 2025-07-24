<script setup lang="ts">

import { ref, onMounted } from 'vue';
import {OTable, OTableColumn} from '@oruga-ui/oruga-next'
import fileIcons from '@haven/examples/file-icons.toml'
import * as PhosphorIcons from '@phosphor-icons/vue'

interface Association {
  name: string;
  pattern: string;
  icon: string;
  color: string;
}

const associations = ref<Association[]>([]);

onMounted(async () => {
  associations.value = fileIcons.associations ?? [];
});

function getIconComponent(name: string) {
  console.log(name as keyof typeof PhosphorIcons)
  return PhosphorIcons[name as keyof typeof PhosphorIcons] ?? PhosphorIcons.PhFileDashed;
}

</script>

<template>
  <section class="customization" >
    <o-table :data="associations" hoverable :narrowed="true" :selectable='true'>
      <o-table-column field="icon" label="Icon" width="48">
        <template #default="{ row }">
          <component
            :is="getIconComponent(row.icon)"
            class="icon"
            weight="duotone"
            :color="row.color"
          />
        </template>
      </o-table-column>

      <o-table-column field="name" label="Name">
        <template #default="{ row }">
          <span :style="{ color: row.color }">{{ row.name }}</span>
        </template>
      </o-table-column>

      <o-table-column field="pattern" label="Pattern">
        <template #default="{ row }">
          <code>{{ row.pattern }}</code>
        </template>
      </o-table-column>

      <o-table-column field="color" label="Color">
        <template #default="{ row }" >
          <span :style="{background: row.color}">
            {{ row.color }}
          </span>
        </template>
      </o-table-column>
    </o-table>
  </section>
</template>

<style scoped lang='scss'>
.customization {
  height: 100%;
  background-color: $success;
  padding: 1rem;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
