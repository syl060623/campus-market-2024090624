<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElButton, ElTag, ElProgress, ElAvatar, ElCard, ElDescriptions, ElDescriptionsItem, ElBreadcrumb, ElBreadcrumbItem, ElDivider, ElEmpty, ElMessage } from 'element-plus'
import type { GroupBuyItem } from '@/types/group'
import { useItemStore } from '@/stores/item'
import { formatTime, deadlineText } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const itemStore = useItemStore()

const itemId = computed(() => Number(route.params.id))
const item = computed(() => itemStore.groupItems.find(i => i.id === itemId.value))

function joinGroup() {
  const found = itemStore.groupItems.find(i => i.id === itemId.value)
  if (!found) return
  if (found.currentCount >= found.targetCount) {
    ElMessage.warning('该拼单已满员')
    return
  }
  if (found.status !== 'active') {
    ElMessage.warning('该拼单已结束')
    return
  }
  found.currentCount++
  ElMessage.success('已成功加入拼单！')
}
</script>

<template>
  <div class="group-detail-view" v-if="item">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem :to="{ path: '/group-buy' }">拼单搭子</ElBreadcrumbItem>
      <ElBreadcrumbItem>{{ item.title.slice(0, 16) }}...</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="detail-main">
      <div class="detail-gallery">
        <ElCard class="gallery-card" :body-style="{ padding: 0 }">
          <img :src="item.images[0]" :alt="item.title" class="gallery-img" />
        </ElCard>
      </div>

      <div class="detail-info">
        <div class="detail-header">
          <ElTag :type="item.type === '餐饮' ? 'warning' : item.type === '出行' ? 'primary' : item.type === '购物' ? 'success' : 'info'" size="large">{{ item.type }}</ElTag>
          <ElTag :type="item.status === 'active' ? 'warning' : item.status === 'full' ? 'success' : 'danger'" size="small">{{ item.status === 'active' ? '招募中' : item.status === 'full' ? '已满员' : '已截止' }}</ElTag>
        </div>
        <h1 class="detail-title">{{ item.title }}</h1>

        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">拼单进度</span>
            <span class="progress-count">{{ item.currentCount }}/{{ item.targetCount }}人</span>
            <ElTag type="danger" size="small" v-if="item.targetCount - item.currentCount > 0">还差{{ item.targetCount - item.currentCount }}人</ElTag>
          </div>
          <ElProgress :percentage="Math.round(item.currentCount / item.targetCount * 100)" :stroke-width="12" status="success" />
        </div>

        <ElDescriptions :column="2" border class="detail-descriptions">
          <ElDescriptionsItem label="集合地点">{{ item.meetLocation }}</ElDescriptionsItem>
          <ElDescriptionsItem label="截止时间">{{ formatTime(item.deadline) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="发布时间">{{ formatTime(item.createdAt) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态标签">{{ deadlineText(item.deadline) }}</ElDescriptionsItem>
        </ElDescriptions>

        <div class="detail-desc">
          <h3>活动描述</h3>
          <p>{{ item.description }}</p>
        </div>

        <div class="detail-publisher">
          <ElAvatar :size="48" :src="item.publisherAvatar" />
          <div class="publisher-info">
            <span class="publisher-name">{{ item.publisherName }}</span>
            <span class="publisher-stat">发起人</span>
          </div>
        </div>

        <ElDivider />

        <div class="detail-actions">
          <ElButton type="primary" size="large" @click="joinGroup" :disabled="item.currentCount >= item.targetCount || item.status !== 'active'" class="action-btn">
            {{ item.currentCount >= item.targetCount ? '已满员' : '加入拼单' }}
          </ElButton>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <ElEmpty description="拼单信息不存在或已过期">
      <ElButton type="primary" @click="router.push('/group-buy')">返回拼单列表</ElButton>
    </ElEmpty>
  </div>
</template>

<style scoped>
.group-detail-view {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-main {
  display: flex;
  gap: 32px;
  margin-top: 20px;
}

.detail-gallery {
  flex: 1;
  min-width: 0;
}

.gallery-card {
  border-radius: 12px;
  overflow: hidden;
}

.gallery-img {
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

.progress-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #F0FDF4;
  border-radius: 12px;
}

.progress-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.progress-count {
  font-size: 14px;
  color: #3B82F6;
  font-weight: 600;
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
