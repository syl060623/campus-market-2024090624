<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElBadge, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus'
import { Plus, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'

const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()

function goTo(path: string) {
  router.push(path)
}

function goToPublish() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  router.push('/publish')
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo" @click="goTo('/')">
        <span class="logo-icon">🎓</span>
        <span class="logo-text">校园轻集市</span>
      </div>

      <nav class="header-nav">
        <a class="nav-item" @click="goTo('/')">首页</a>
        <a class="nav-item" @click="goTo('/trade')">二手</a>
        <a class="nav-item" @click="goTo('/lost-found')">失物</a>
        <a class="nav-item" @click="goTo('/group-buy')">拼单</a>
        <a class="nav-item" @click="goTo('/errand')">跑腿</a>
      </nav>

      <div class="header-actions">
        <ElButton type="primary" :icon="Plus" @click="goToPublish">发布</ElButton>

        <ElBadge :value="messageStore.totalUnreadCount" :hidden="messageStore.totalUnreadCount === 0" class="action-badge">
          <ElButton :icon="Message" circle @click="goTo('/messages')" />
        </ElBadge>

        <span class="user-name">{{ userStore.displayName }}</span>

        <ElBadge :is-dot="false">
          <ElDropdown trigger="click" @command="goTo">
            <ElAvatar :size="36" :src="userStore.currentUser.avatar" class="user-avatar" />
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="/profile">个人中心</ElDropdownItem>
                <ElDropdownItem command="/profile/posts">我的发布</ElDropdownItem>
                <ElDropdownItem command="/profile/favorites">我的收藏</ElDropdownItem>
                <ElDropdownItem command="/profile/settings">账号设置</ElDropdownItem>
                <ElDropdownItem divided command="/login" v-if="!userStore.isLoggedIn">登录</ElDropdownItem>
                <ElDropdownItem divided command="" v-else>退出登录</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </ElBadge>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  white-space: nowrap;
}

.header-search {
  flex: 1;
  max-width: 480px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px 0 0 8px;
}

.search-input :deep(.el-input-group__append) {
  border-radius: 0 8px 8px 0;
  padding: 0;
}

.header-nav {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.nav-item {
  padding: 8px 16px;
  font-size: 15px;
  color: #475569;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  background: #F1F5F9;
  color: #3B82F6;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.action-badge :deep(.el-badge__content) {
  border: none;
}

.user-name {
  font-size: 14px;
  color: #374151;
  user-select: none;
}

.user-avatar {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.user-avatar:hover {
  border-color: #3B82F6;
}
</style>
