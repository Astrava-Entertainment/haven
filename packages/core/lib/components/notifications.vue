<script setup lang="ts">
import { ref } from 'vue';
import { PhCheck } from '@phosphor-icons/vue'

interface Notification {
  id: number;
  title: string;
  description?: string;
  read?: boolean;
}

const props = defineProps<{
  show: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const notifications = ref<Notification[]>([
  { id: 1, title: 'New comment on your post', description: 'John commented on your file', read: false },
  { id: 2, title: 'Project updated', description: 'Project A has been updated', read: true },
  { id: 3, title: 'New follower', description: 'Alice started following you', read: false },
]);


const handleNotificationClick = (notification: Notification) => {
  console.log('Open notification:', notification);
};

const markAsRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) notif.read = true;
};
</script>

<template>
  <div v-if="show" class="overlay" @click.self="emit('close')">
    <div class="notifications-popup">
      <h3>Notifications</h3>
      <ul>
        <li
          v-for="notif in notifications.filter(n => !n.read)"
          :key="notif.id"
        >
          <div class="notif-content" @click="handleNotificationClick(notif)">
            <div>
              <strong>{{ notif.title }}</strong>
              <p v-if="notif.description">{{ notif.description }}</p>
            </div>
            <PhCheck :weight='"bold"' class="check-btn" @click.stop="markAsRead(notif.id)"/>
          </div>
        </li>

        <li v-if="notifications.filter(n => !n.read).length === 0" class="empty">
          No new notifications
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

.notifications-popup {
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
      margin-bottom: 0.3rem;

      .notif-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.4rem 0.6rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: $pressed;
        }

        div {
          flex: 1;

          p {
            font-size: 0.85rem;
            color:gray;
            margin: 0.2rem 0 0 0;
          }
        }

        .check-btn {
          background-color: transparent;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: $visited;
          margin-left: 0.5rem;
          padding: 0;

          &:hover {
            color: $success;
          }
        }
      }

      &.unread {
        background-color: rgba(255, 215, 0, 0.15);
      }
    }

    .empty {
      padding: 0.5rem;
      color: $muted;
      text-align: center;
      font-size: 0.9rem;
    }
  }
}
</style>
