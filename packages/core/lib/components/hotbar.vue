<script setup lang="ts">
import DirectorySelector from "@/components/defaultDirectory.vue";
import {usePathStore} from '@haven/file-system/store';

import { PhUser, PhBell, PhBellRinging } from '@phosphor-icons/vue'
// PhBellRinging active when you have notifications

const usePath = usePathStore();
const isUserPopupOpen = ref(false);
const isNotificationsOpen = ref(false);

const emit = defineEmits<{
  (e: 'update:page', value: string): void;
}>()

const goToFileSystem = () => {
  usePath.reset();
  emit('update:page', 'FileSystem');
}

const toggleUserMenu = () => {
  isUserPopupOpen.value = !isUserPopupOpen.value;
}

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
}

const handleUserOption = (option: string) => {
  if (option === 'Settings') {
    emit('update:page', 'Settings');
  } else if (option === 'Profile') {
    emit('update:page', 'Profile');
  } else if (option === 'Logout') {
    console.log('Logout user');
  }
};

</script>

<template>
  <div class="hotbar-main">
    <div class="hotbar-buttons">
      <button @click="goToFileSystem">File System</button>
      <button @click='emit("update:page", "Customization")'>Customization</button>
      <button @click='emit("update:page", "Render")'>Render</button>
    </div>
    <div class='hotbar-icons'>
      <PhBell size="26" @click='toggleNotifications' />
      <PhUser size="26" @click='toggleUserMenu' />
    </div>
    <UserMenu :show="isUserPopupOpen" @close="isUserPopupOpen = false" @select="handleUserOption"/>
    <Notifications :show="isNotificationsOpen" @close="isNotificationsOpen = false" />
  </div>
</template>

<style scoped lang="scss">
.hotbar-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: $muted;
  border-bottom: 1px solid $visited;
  gap: 1rem;
}

.hotbar-buttons {
  display: flex;
  gap: 0.75rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    background-color: $primary;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover { background-color: $highlight; transform: translateY(-2px); }
    &:active { background-color: $pressed; transform: translateY(0); }
  }
}

.hotbar-icons {
  display: flex;
  gap: 1rem;

  svg {
    padding: .1rem;
    border-radius: 50%;
    transition: background-color 0.2s, transform 0.2s;

    &:hover {
      cursor: pointer;
      background-color: #e0e0e0;
      transform: scale(1.1);
    }
  }
}

</style>
