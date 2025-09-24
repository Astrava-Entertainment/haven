<script setup lang="ts">
import { useAuthStore } from "@/store"

const auth = useAuthStore();

function handleLogin() {
  auth.login()
}
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="header">
        <p class="welcome">Welcome to</p>
        <img src="/haven_favico.svg" alt="haven logo" class="logo" />
        <p class="title">Haven</p>
      </div>

      <div class="content" v-if="!auth.isLoggedIn">
        <p class="subtitle">Please login to continue</p>
        <button class="btn" @click="handleLogin">Continue</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, $primary, $muted, $highlight);
}

.card {
  background: $text;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 380px;
  border: 1px solid $divider;

  .header {
    .welcome {
      color: $muted;
      font-size: 1rem;
    }

    .logo {
      height: 64px;
      width: 64px;
    }

    .title {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
      font-weight: 700;
      color: $link;
    }
  }

  .content {
    .subtitle {
      color: $muted;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    .btn {
      width: 100%;
      background: $highlight;
      color: #333;
      font-weight: 600;
      padding: 0.6rem 1rem;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: $pressed;
      }

      &:active {
        background: $warning;
      }
    }
  }
}
</style>
