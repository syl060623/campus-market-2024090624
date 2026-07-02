<template>
  <header class="app-header">
    <div class="brand">
      <span class="logo">校园轻集市</span>
      <span class="slogan">轻量、可信、面向校园生活</span>
    </div>

    <AppNav />

    <div class="user-actions">
      <button class="msg-btn" type="button" @click="router.push('/messages')">
        消息
        <span v-if="messageStore.totalUnreadCount > 0" class="msg-badge">{{ messageStore.totalUnreadCount }}</span>
      </button>
      <button class="publish-btn" type="button" @click="goPublish">发布</button>

      <template v-if="userStore.isLoggedIn">
        <RouterLink to="/user">{{ userStore.displayName }}</RouterLink>
        <button type="button" @click="handleLogout">退出</button>
      </template>

      <template v-else>
        <RouterLink to="/login">登录</RouterLink>
        <RouterLink to="/register">注册</RouterLink>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'
import { useMessageStore } from '../stores/message'

const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()

function goPublish() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  router.push('/publish')
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
}

.slogan {
  font-size: 13px;
  color: #6b7280;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.user-actions a {
  color: #2563eb;
  text-decoration: none;
}

.msg-btn {
  position: relative;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  background: #fff;
  color: #374151;
  font-size: 14px;
}

.msg-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  text-align: center;
}

.publish-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.publish-btn:hover {
  background: #1d4ed8;
}

.user-actions button {
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
}
</style>
