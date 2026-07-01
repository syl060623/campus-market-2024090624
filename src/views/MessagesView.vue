<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { ElInput, ElBadge, ElAvatar, ElCard, ElScrollbar, ElIcon } from 'element-plus'
import { Message, Search } from '@element-plus/icons-vue'

const router = useRouter()
const messageStore = useMessageStore()

const searchQuery = ref('')

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return messageStore.conversations
  const q = searchQuery.value.trim().toLowerCase()
  return messageStore.conversations.filter(c =>
    c.userName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
  )
})

function openChat(conv: { userId: number }) {
  router.push('/chat/' + conv.userId)
}
</script>

<template>
  <div class="messages-view">
    <div class="page-header">
      <h2>消息中心</h2>
      <p>查看系统通知、收藏提醒和互动消息。</p>
    </div>

    <div class="system-messages">
      <article class="message-card">
        <h3>欢迎使用校园轻集市</h3>
        <p>你可以在这里发布二手商品、失物招领、拼单搭子和跑腿委托。</p>
      </article>

      <article class="message-card">
        <h3>功能提示</h3>
        <p>收藏的信息可以在个人中心中查看。</p>
      </article>
    </div>

    <ElCard class="messages-card" :body-style="{ padding: 0 }">
      <div class="search-bar">
        <ElInput
          v-model="searchQuery"
          placeholder="搜索联系人或消息..."
          :prefix-icon="Search"
          clearable
          size="large"
        />
      </div>
      <ElScrollbar class="conversation-list" :max-height="600">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="conversation-item"
          @click="openChat(conv)"
        >
          <ElBadge :value="conv.unreadCount" :hidden="conv.unreadCount === 0" class="avatar-badge">
            <ElAvatar :size="48" :src="conv.userAvatar" />
          </ElBadge>
          <div class="conv-info">
            <div class="conv-top">
              <span class="conv-name">{{ conv.userName }}</span>
              <span class="conv-time">{{ conv.lastMessageTime }}</span>
            </div>
            <div class="conv-bottom">
              <span class="conv-last-msg">{{ conv.lastMessage }}</span>
              <ElIcon v-if="conv.unreadCount > 0" class="unread-dot"><Message /></ElIcon>
            </div>
          </div>
        </div>
        <div v-if="filteredConversations.length === 0" class="empty-state">
          <ElIcon :size="48" color="#c0c4cc"><Message /></ElIcon>
          <p>暂无消息</p>
        </div>
      </ElScrollbar>
    </ElCard>
  </div>
</template>

<style scoped>
.messages-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
}

.page-header p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.system-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.message-card {
  padding: 16px 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.message-card h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.message-card p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.messages-card {
  border-radius: 12px;
  overflow: hidden;
}

.search-bar {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.conversation-list {
  padding: 0;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.conversation-item:hover {
  background: #F0F7FF;
}

.conversation-item:last-child {
  border-bottom: none;
}

.avatar-badge :deep(.el-badge__content) {
  border: 2px solid #fff;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.conv-time {
  font-size: 12px;
  color: #94A3B8;
  flex-shrink: 0;
}

.conv-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-last-msg {
  font-size: 13px;
  color: #64748B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.unread-dot {
  color: #3B82F6;
  font-size: 10px;
  margin-left: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #c0c4cc;
}

.empty-state p {
  margin-top: 12px;
  font-size: 14px;
}
</style>
