<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">帮助中心</a>
          <a href="#">用户协议</a>
          <a href="#">隐私政策</a>
          <a href="#">联系客服</a>
        </div>
        <div class="footer-copyright">
          &copy; 2024-2026 校园轻集市 Campus Light Market. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8FAFC;
}

.main-content {
  flex: 1;
  margin-top: 64px;
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding: 24px;
}

.app-footer {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-top: 48px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.footer-links a {
  color: #64748B;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #3B82F6;
}

.footer-copyright {
  color: #94A3B8;
  font-size: 12px;
}
</style>
