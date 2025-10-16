<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

interface Props {
  file: { id: string; name: string; type: string };
  path: string;
}

const { file, path } = defineProps<Props>();
const emit = defineEmits(["save"]);

// Estado local
const content = ref<string>("");
const isLoading = ref<boolean>(true);
const isModified = ref<boolean>(false);

const loadFile = async () => {
  try {
    isLoading.value = true;
    const res = await fetch(path);
    const text = await res.text();
    content.value = text;
  } catch (err) {
    console.error("Error loading file:", err);
    content.value = "⚠️ Error loading file content.";
  } finally {
    isLoading.value = false;
  }
};

watch(content, () => {
  isModified.value = true;
});

const saveChanges = () => {
  console.log("Saving changes for", file.name);
  emit("save", content.value);
  isModified.value = false;
};

onMounted(loadFile);
</script>

<template>
  <div class="text-editor">
    <header>
      <h2>{{ file.name }}</h2>
      <button
        v-if="isModified"
        class="save-btn"
        @click="saveChanges"
      >
        Save
      </button>
    </header>

    <div v-if="isLoading" class="loading">Loading content...</div>

    <textarea
      v-else
      v-model="content"
      spellcheck="false"
      class="editor-area"
    ></textarea>
  </div>
</template>

<style scoped lang="scss">
.text-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  background-color: #fafafa;
  border-radius: 0.5rem;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;

    h2 {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .save-btn {
      background-color: #0078d4;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #005fa3;
      }
    }
  }

  .editor-area {
    width: 100%;
    height: 70vh;
    resize: none;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.75rem;
    font-family: "Fira Code", monospace;
    font-size: 0.9rem;
    color: #222;
    background-color: white;

    &:focus {
      outline: 2px solid #0078d4;
      border-color: transparent;
    }
  }

  .loading {
    text-align: center;
    color: #666;
    padding: 2rem;
  }
}
</style>
