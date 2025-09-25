<script setup lang="ts">
import { ref } from 'vue';

const sections = ['User', 'Settings', 'Theme', 'Haven', 'Manage Account'];
const activeSection = ref('User');

// Datos de usuario
const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  description: 'This is a short bio about the user.',
});
</script>

<template>
  <div class="user-page">
    <aside class="sidebar">
      <ul>
        <li
          v-for="section in sections"
          :key="section"
          :class="{ active: activeSection === section }"
          @click="activeSection = section"
        >
          {{ section }}
        </li>
      </ul>
    </aside>

    <main class="content">
      <div class="user-info" v-if="activeSection === 'User'">
        <div class="avatar">:)</div>
        <div class="fields">
          <div class="field">
            <label>Name:</label>
            <input v-model="user.name" type="text" />
          </div>
          <div class="field">
            <label>Email:</label>
            <input v-model="user.email" type="email" />
          </div>
          <div class="field">
            <label>Description:</label>
            <textarea v-model="user.description"></textarea>
          </div>
        </div>
      </div>

      <div v-else class="placeholder">
        <h3>{{ activeSection }}</h3>
        <p>Content from section: {{ activeSection }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.user-page {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
  background-color: $muted;

  .sidebar {
    flex: 0 0 $sidebar-width;
    width: $sidebar-width;
    background-color: $muted;
    padding: 1rem;
    border-right: 1px solid $visited;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 0.5rem;
        font-weight: 500;
        transition: all 0.2s ease;

        &.active, &:hover {
          background-color: $highlight;
        }
      }
    }
  }

  .content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;

    .user-info {
      display: flex;
      gap: 2rem;

      .avatar {
        width: 100px;
        height: 100px;
        background-color: $divider;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
      }

      .fields {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .field {
          display: flex;
          flex-direction: column;
          label {
            font-weight: 600;
            margin-bottom: 0.3rem;
          }

          input, textarea {
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid $divider;
            background-color: lighten($muted, 5%);
          }

          textarea {
            min-height: 80px;
            resize: vertical;
          }
        }
      }
    }

    .placeholder {
      text-align: center;
      color: #000;
    }
  }
}
</style>
