<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {useContextFileMenuStore} from '../store';
import {getIconForFilename} from '../utils';

interface IProps {
  file: HavenFSItem
}
const { file } = defineProps<IProps>()
const emit = defineEmits(['click', 'context'])

const contextFileMenu = useContextFileMenuStore()

const handleRightClick = (e: MouseEvent) => {
  e.preventDefault()
  contextFileMenu.open(file.id, e.clientX, e.clientY)
  emit('context', file)
}

const handleAction = (action: string) => {
  emit(action, file)
  contextFileMenu.close()
}

const closeOnClick = () => contextFileMenu.close()

const iconData = computed(() => getIconForFilename(file.name));
console.log(iconData)
onMounted(() => {
  document.addEventListener('click', closeOnClick)
})
onUnmounted(() => {
  document.removeEventListener('click', closeOnClick)
})

</script>

<template>
  <span
    class="file-name"
    @click="emit('click', file)"
    @contextmenu="handleRightClick"
  >
    <strong v-if="file.type === 'directory'">/{{ file.name }}</strong>
    <template v-else>
        <component
          :is="iconData.icon"
          class="icon"
          :style="{ color: iconData.color }"
          weight="duotone"
        />
        <span>
          {{ file.name }}
        </span>
    </template>
  </span>

  <Teleport to="body">
    <div
      v-if="contextFileMenu.visible && contextFileMenu.activeFileId === file.id"
      class="context-menu"
      :style="{ top: contextFileMenu.y + 'px', left: contextFileMenu.x + 'px' }"
    >
      <ul>
        <li @click="handleAction('open')">Open</li>
        <li @click="handleAction('rename')">Rename</li>
        <li @click="handleAction('delete')">Delete</li>
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

.file-name {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: $link;

  &:hover {
    text-decoration: none;

    span {
      text-decoration: underline;
    }
  }

  strong {
    color: $link;
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
