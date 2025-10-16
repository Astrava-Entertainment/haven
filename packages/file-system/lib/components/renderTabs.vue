<script setup lang="ts">
import { ref } from "vue";
import { Render } from "@haven/render";
import Explorer from "./explorer.vue";

interface Tab {
  id: string;
  name: string;
  type: "explorer" | "file";
  file?: HavenFSItem;
}

const tabs = ref<Tab[]>([
  { id: "explorer", name: "Explorer", type: "explorer" }
]);

const activeTab = ref("explorer");

const addTab = (file: HavenFSItem) => {
  if (!tabs.value.find(t => t.id === file.id)) {
    tabs.value.push({ id: file.id, name: file.name, type: "file", file });
  }
  activeTab.value = file.id;
};

const closeTab = (id: string) => {
  if (id === "explorer") return;
  tabs.value = tabs.value.filter(t => t.id !== id);
  if (activeTab.value === id) {
    activeTab.value = "explorer";
  }
};

defineExpose({ addTab });
</script>

<template>
  <div class="tabs-container">
    <div class="tabs-bar">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: tab.id === activeTab }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
        <button
          v-if="tab.type === 'file'"
          class="close"
          @click.stop="closeTab(tab.id)"
        >
          ×
        </button>
      </div>
    </div>

    <div class="renders">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="tab.id === activeTab"
        class="tab-content"
      >
        <Explorer v-if="tab.type === 'explorer'" @openFile="addTab" />
        <Render v-else :file="tab.file" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tabs-bar {
  display: flex;
  background: $muted;
  border-bottom: 1px solid $visited;

  .tab {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-right: 1px solid $divider;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.active {
      background: $highlight;
      font-weight: bold;
    }

    .close {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
    }
  }
}

.renders {
  flex: 1;
  position: relative;

  > * {
    position: absolute;
    inset: 0;
  }
}
</style>
