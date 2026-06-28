<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { ElAvatar, ElInput, ElButton, ElCard, ElTag, ElScrollbar, ElIcon } from 'element-plus'
import { ArrowLeft, Promotion, ChatDotSquare } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()

const userId = computed(() => Number(route.params.userId))
const newMessage = ref('')
const messagesContainer = ref<InstanceType<typeof ElScrollbar>>()

const conversation = computed(() => {
  if (!userId.value) return null
  return messageStore.getOrCreateConversation(userId.value)
})

const chatMessages = computed(() => {
  if (!conversation.value) return []
  messageStore.selectConversation(conversation.value.id)
  return messageStore.currentMessages
})

const quickReplies = ['好的', '收到', '没问题', '谢谢', '请问还在吗？', '我考虑一下']

onMounted(() => {
  if (!conversation.value) {
    router.replace('/messages')
    return
  }
  messageStore.selectConversation(conversation.value.id)
  scrollToBottom()
})

watch(chatMessages, () => {
  nextTick(scrollToBottom)
}, { deep: true })

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      const wrap = messagesContainer.value.wrapRef
      if (wrap) wrap.scrollTop = wrap.scrollHeight
    }
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !conversation.value) return
  messageStore.sendMessage(newMessage.value)
  newMessage.value = ''
}

function sendQuickReply(text: string) {
  if (!conversation.value) return
  messageStore.sendMessage(text)
}
</script>

<template>
  <div class="chat-view">
    <div class="chat-container">
      <div class="chat-header">
        <ElButton :icon="ArrowLeft" text @click="router.back()" />
        <ElAvatar :size="36" :src="conversation?.userAvatar" />
        <div class="header-info">
          <span class="header-name">{{ conversation?.userName || '未知用户' }}</span>
        </div>
      </div>

      <div v-if="conversation?.relatedItemTitle" class="related-item-bar">
        <ElCard shadow="never" class="related-card" :body-style="{ padding: '8px 12px' }">
          <div class="related-content">
            <img
              v-if="conversation.relatedItemImage"
              :src="conversation.relatedItemImage"
              class="related-image"
            />
            <div class="related-text">
              <span class="related-label">相关商品</span>
              <span class="related-title">{{ conversation.relatedItemTitle }}</span>
            </div>
            <ElTag size="small" type="primary">查看</ElTag>
          </div>
        </ElCard>
      </div>

      <ElScrollbar ref="messagesContainer" class="messages-area" :max-height="450">
        <div class="messages-list">
          <div
            v-for="msg in chatMessages"
            :key="msg.id"
            :class="['message-item', msg.senderId === 1 ? 'my-message' : 'their-message']"
          >
            <ElAvatar v-if="msg.senderId !== 1" :size="32" :src="msg.senderAvatar" class="msg-avatar" />
            <div class="msg-content-wrapper">
              <span class="msg-time">{{ msg.createdAt }}</span>
              <div :class="['msg-bubble', msg.type === 'image' ? 'msg-image' : '']">
                <template v-if="msg.type === 'image'">
                  <span>{{ msg.content }}</span>
                </template>
                <template v-else>
                  <span>{{ msg.content }}</span>
                </template>
              </div>
            </div>
            <ElAvatar v-if="msg.senderId === 1" :size="32" :src="msg.senderAvatar" class="msg-avatar" />
          </div>
        </div>
      </ElScrollbar>

      <div class="quick-reply-bar">
        <ElButton
          v-for="reply in quickReplies"
          :key="reply"
          size="small"
          text
          @click="sendQuickReply(reply)"
        >
          <ElIcon style="margin-right: 2px;"><ChatDotSquare /></ElIcon>
          {{ reply }}
        </ElButton>
      </div>

      <div class="input-area">
        <ElInput
          v-model="newMessage"
          type="textarea"
          :rows="2"
          placeholder="输入消息..."
          resize="none"
          @keyup.enter.ctrl="sendMessage"
        />
        <ElButton
          type="primary"
          :icon="Promotion"
          :disabled="!newMessage.trim()"
          @click="sendMessage"
          class="send-btn"
        >
          发送
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  max-width: 700px;
  margin: 0 auto;
  height: calc(100vh - 120px);
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.header-info {
  flex: 1;
}

.header-name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.related-item-bar {
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.related-card {
  border-radius: 8px;
  background: #F8FAFC;
}

.related-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.related-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.related-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.related-label {
  font-size: 11px;
  color: #94A3B8;
}

.related-title {
  font-size: 13px;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.messages-area {
  flex: 1;
  padding: 16px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 80%;
}

.my-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.their-message {
  align-self: flex-start;
}

.msg-avatar {
  flex-shrink: 0;
}

.msg-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.my-message .msg-content-wrapper {
  align-items: flex-end;
}

.msg-time {
  font-size: 11px;
  color: #94A3B8;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.my-message .msg-bubble {
  background: #3B82F6;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.their-message .msg-bubble {
  background: #F1F5F9;
  color: #1E293B;
  border-bottom-left-radius: 4px;
}

.msg-image {
  padding: 4px;
}

.quick-reply-bar {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  flex-wrap: wrap;
  border-top: 1px solid #f0f0f0;
  background: #FAFBFC;
}

.quick-reply-bar :deep(.el-button) {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 16px;
  background: #F0F7FF;
  color: #3B82F6;
  border: 1px solid #DBEAFE;
}

.quick-reply-bar :deep(.el-button:hover) {
  background: #DBEAFE;
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  align-items: flex-end;
}

.input-area :deep(.el-textarea__inner) {
  border-radius: 8px;
  border-color: #e2e8f0;
}

.input-area :deep(.el-textarea__inner:focus) {
  border-color: #3B82F6;
}

.send-btn {
  height: 56px;
  border-radius: 8px;
  flex-shrink: 0;
}
</style>
