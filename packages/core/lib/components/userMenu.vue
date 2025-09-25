<script setup lang="ts">
import { ref } from 'vue';

interface UserOption {
  title: string;
  action?: () => void;
}

const props = defineProps<{
  show: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', option: string): void;
}>();

const userOptions: UserOption[] = [
  { title: 'Settings', action: () => console.log('Open settings') },
  { title: 'Logout', action: () => console.log('Logout') },
];

const handleOptionClick = (option: UserOption) => {
  emit('select', option.title);
  emit('close');
};
</script>

<template>
  <div v-if="show" class="overlay" @click.self="emit('close')">
    <div class="user-popup">
      <h3>Hello, User</h3>
      <ul>
        <li v-for="option in userOptions" :key="option.title" @click="handleOptionClick(option)">
          {{ option.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0,0,0,0.25);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 1000;
  padding: 1rem;
}

.user-popup {
  background-color: $muted;
  padding: 1rem;
  padding-top: 0;
  border-radius: 10px;
  min-width: 300px;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover { background-color: $highlight; }
    }
  }
}
</style>
