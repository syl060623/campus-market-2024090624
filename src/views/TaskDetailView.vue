<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElButton, ElTag, ElAvatar, ElCard, ElDescriptions, ElDescriptionsItem,
  ElBreadcrumb, ElBreadcrumbItem, ElDivider, ElEmpty
} from 'element-plus'
import type { ErrandTask } from '@/types/task'
import { useItemStore } from '@/stores/item'
import { formatTime, statusTagType } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const itemStore = useItemStore()

const itemId = computed(() => Number(route.params.id))
const item = computed(() => itemStore.errandTasks.find(i => i.id === itemId.value))

function contactTA() {
  if (item.value) {
    router.push(`/chat/${item.value.publisherId}`)
  }
}

function takeOrder() {
  const found = itemStore.errandTasks.find(i => i.id === itemId.value)
  if (found && found.status === '待接单') {
    found.status = '已接单'
  }
}
</script>

<template>
  <div class="task-detail-view" v-if="item">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem :to="{ path: '/errand' }">跑腿委托</ElBreadcrumbItem>
      <ElBreadcrumbItem>{{ item.title.slice(0, 16) }}...</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="detail-main">
      <div class="detail-image">
        <ElCard class="image-card" :body-style="{ padding: 0 }">
          <img :src="item.images?.[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop'" :alt="item.title" class="task-img" />
        </ElCard>
      </div>

      <div class="detail-info">
        <div class="detail-header">
          <ElTag :type="item.type === '取快递' ? 'primary' : item.type === '送东西' ? 'success' : item.type === '代购' ? 'warning' : 'info'" size="large">{{ item.type }}</ElTag>
          <ElTag :type="statusTagType(item.status)" size="small">{{ item.status }}</ElTag>
        </div>
        <h1 class="detail-title">{{ item.title }}</h1>

        <div class="reward-section">
          <span class="reward-label">任务报酬</span>
          <span class="reward-amount">¥{{ item.reward }}</span>
        </div>

        <ElDescriptions :column="2" border class="detail-descriptions">
          <ElDescriptionsItem label="配送路线">{{ item.deliveryLocation }}</ElDescriptionsItem>
          <ElDescriptionsItem label="期望送达">{{ formatTime(item.expectedTime) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="联系方式" :span="2">{{ item.contact }}</ElDescriptionsItem>
          <ElDescriptionsItem label="发布时间" :span="2">{{ formatTime(item.createdAt) }}</ElDescriptionsItem>
        </ElDescriptions>

        <div class="detail-desc">
          <h3>任务详情</h3>
          <p>{{ item.content }}</p>
        </div>

        <div class="detail-publisher">
          <ElAvatar :size="48" :src="item.publisherAvatar" />
          <div class="publisher-info">
            <span class="publisher-name">{{ item.publisherName }}</span>
            <span class="publisher-stat">发布者</span>
          </div>
          <div class="publisher-status" v-if="item.takerName">
            已由 <strong>{{ item.takerName }}</strong> 接单
          </div>
        </div>

        <ElDivider />

        <div class="detail-actions">
          <ElButton v-if="item.status === '待接单'" type="primary" size="large" @click="takeOrder" class="action-btn">接单</ElButton>
          <ElButton v-else type="primary" size="large" @click="contactTA" class="action-btn">联系TA</ElButton>
          <ElButton v-if="item.status !== '待接单'" disabled size="large" class="action-btn">已{{ item.status }}</ElButton>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <ElEmpty description="任务不存在或已删除">
      <ElButton type="primary" @click="router.push('/errand')">返回跑腿列表</ElButton>
    </ElEmpty>
  </div>
</template>

<style scoped>
.task-detail-view {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-main {
  display: flex;
  gap: 32px;
  margin-top: 20px;
}

.detail-image {
  flex: 1;
  min-width: 0;
}

.image-card {
  border-radius: 12px;
  overflow: hidden;
}

.task-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.detail-info {
  width: 420px;
  flex-shrink: 0;
}

.detail-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
  line-height: 1.4;
  margin-bottom: 16px;
}

.reward-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #FFF1F2;
  border-radius: 12px;
}

.reward-label {
  font-size: 14px;
  color: #64748B;
}

.reward-amount {
  font-size: 28px;
  font-weight: 800;
  color: #EF4444;
}

.detail-descriptions {
  margin-bottom: 20px;
}

.detail-desc {
  margin-bottom: 20px;
}

.detail-desc h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.detail-desc p {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
}

.detail-publisher {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #F8FAFC;
  border-radius: 12px;
}

.publisher-info {
  display: flex;
  flex-direction: column;
}

.publisher-name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.publisher-stat {
  font-size: 12px;
  color: #94A3B8;
}

.publisher-status {
  margin-left: auto;
  font-size: 12px;
  color: #64748B;
}

.publisher-status strong {
  color: #3B82F6;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
}

.not-found {
  padding: 80px 0;
}
</style>
