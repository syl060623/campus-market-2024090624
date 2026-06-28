<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  { label: '全部', path: '/' },
  { label: '二手交易', path: '/trade' },
  { label: '失物招领', path: '/lost-found' },
  { label: '拼单搭子', path: '/group-buy' },
  { label: '跑腿委托', path: '/errand' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="app-nav">
    <div class="nav-inner">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="goTo(item.path)"
      >
        {{ item.label }}
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  background: #fff;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.nav-inner {
  display: flex;
  gap: 4px;
}

.nav-item {
  padding: 10px 24px;
  font-size: 15px;
  color: #475569;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  user-select: none;
}

.nav-item:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.nav-item.active {
  background: #3B82F6;
  color: #fff;
  font-weight: 600;
}
</style>
