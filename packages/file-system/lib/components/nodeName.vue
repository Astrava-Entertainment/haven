<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import {useContextFileMenuStore, useFileMultiselectStore, useFileSystemStore} from '../store'
import { getIcon, getIconForFilename, onAction } from '../utils'
import { fileActions } from '../constants'
import { getDownloadFiles } from '@haven/core/api/downloads'

interface IProps {
  file: HavenFSItem
}

const { file } = defineProps<IProps>()
const emit = defineEmits(['click', 'context'])

const contextFileMenu = useContextFileMenuStore()
const fileMultiselect = useFileMultiselectStore();
const fileSystem = useFileSystemStore();

const downloadedIds = ref<string[]>([])

const isSelected = computed(() => fileMultiselect.selectedIds.includes(file.id))

const handleClick = (e: MouseEvent) => {
  if (e.shiftKey) {
    fileMultiselect.selectRange(fileSystem.currentContent ?? [], file.id)
  } else if (e.ctrlKey || e.metaKey) {
    fileMultiselect.toggleSelect(file.id)
  } else {
    fileMultiselect.selectSingle(file.id)
  }
  console.log(fileMultiselect.selectedIds)
}

const handleRightClick = (e: MouseEvent) => {
  e.preventDefault()
  contextFileMenu.open(file.id, e.clientX, e.clientY)
  emit('context', file)
}

const handleAction = (action: string) => {
  onAction(action, file)
  contextFileMenu.close()
}

const loadDownloadedFiles = async () => {
  const downloads = await getDownloadFiles()
  downloadedIds.value = downloads.data.map((d: any) => d.id)
}
loadDownloadedFiles()

const closeOnClick = () => contextFileMenu.close()

const iconData = computed(() => getIconForFilename(file.name))
const downloadIcon = computed(() => getIcon("PhFloppyDisk"))
const isDownloaded = computed(() => downloadedIds.value.includes(file.id))

onMounted(() => {
  document.addEventListener('click', closeOnClick)
})
onUnmounted(() => {
  document.removeEventListener('click', closeOnClick)
})
</script>

<template>
  <div
    class="file-name"
    @click="handleClick"
    @dblclick='emit("click", file)'
    @contextmenu="handleRightClick"
    style='justify-content: space-between'
    :class="{ selected: isSelected }"
  >
    <strong v-if="file.type === 'directory'">/{{ file.name }} </strong>
    <template v-else>
      <div class='file-label'>
        <component
          :is="iconData.icon"
          class="icon"
          :style="{ color: iconData.color }"
        />
        {{ file.name }}
      </div>
    </template>
      <component
        v-if='isDownloaded'
        :is='downloadIcon'
        class='icon'
        :style="{ color: '#0f0f0f' }"
      />
  </div>

  <Teleport to="body">
    <div
      v-if="contextFileMenu.visible && contextFileMenu.activeFileId === file.id"
      class="context-menu"
      :style="{ top: contextFileMenu.y + 'px', left: contextFileMenu.x + 'px' }"
    >
      <ul v-for='action in fileActions'>
        <li @click="handleAction(action)">{{action}}</li>
      </ul>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.icon {
  width: 18px;
  height: 18px;
  margin-right: 0.4rem;
  flex-shrink: 0;
}

.file-name.selected {
  background-color: $pressed;
  border-radius: .25rem;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.file-name {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: gray;

  &:hover {
    text-decoration: none;

    span {
      text-decoration: underline;
    }
  }

  strong {
    color: gray;
    font-weight: 600;
  }
}

.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 120px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: #333;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $pressed;
      }
    }
  }
}
</style>
