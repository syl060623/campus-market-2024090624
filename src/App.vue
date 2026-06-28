<script setup lang="ts"></script>

<template>
  <nav>
    <router-link v-for="item in navItems" :key="item.path" :to="item.path">
      {{ item.label }}
    </router-link>
  </nav>

  <router-view />
</template>

<script setup lang="ts">
const navItems = [
  { path: '/home', label: '首页' },
  { path: '/list', label: '列表' },
  { path: '/publish', label: '发布' },
  { path: '/message', label: '消息' },
  { path: '/profile', label: '我的' },
]
</script>

<style scoped>
nav {
  display: flex;
  gap: 0;
  padding: 0;
  border-bottom: 2px solid #e4e7ed;
  background: #fff;
}

nav a {
  padding: 12px 24px;
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

nav a:hover {
  color: #409eff;
}

nav a.router-link-exact-active {
  color: #409eff;
  border-bottom-color: #409eff;
}
</style>
