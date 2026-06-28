<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElBreadcrumb, ElBreadcrumbItem, ElButton, ElTag, ElAvatar, ElDivider,
  ElDescriptions, ElDescriptionsItem, ElCard, ElEmpty
} from 'element-plus'
import type { LostFoundItem } from '@/types/lost'
import { useItemStore } from '@/stores/item'
import { formatTime } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const itemStore = useItemStore()

const itemId = computed(() => Number(route.params.id))
const item = computed(() => itemStore.lostItems.find(i => i.id === itemId.value))

function contactTA() {
  if (item.value) {
    router.push(`/chat/${item.value.publisherId}`)
  }
}
</script>

<template>
  <div class="lost-detail-view" v-if="item">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem :to="{ path: '/lost-found' }">失物招领</ElBreadcrumbItem>
      <ElBreadcrumbItem>{{ item.itemName }}</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="detail-main">
      <div class="detail-gallery">
        <ElCard class="gallery-card" :body-style="{ padding: 0 }">
          <img :src="item.images[0]" :alt="item.itemName" class="gallery-img" />
        </ElCard>
      </div>

      <div class="detail-info">
        <div class="detail-header">
          <ElTag :type="item.type === '拾到' ? 'success' : 'danger'" size="large">{{ item.type === '拾到' ? '拾到物品' : '丢失物品' }}</ElTag>
          <ElTag :type="item.status === 'active' ? 'warning' : 'success'" size="small">{{ item.status === 'active' ? '进行中' : '已解决' }}</ElTag>
        </div>
        <h1 class="detail-title">{{ item.itemName }}</h1>

        <ElDescriptions :column="2" border class="detail-descriptions">
          <ElDescriptionsItem label="地点">{{ item.location }}</ElDescriptionsItem>
          <ElDescriptionsItem label="发生时间">{{ formatTime(item.happenedAt) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="发布时间">{{ formatTime(item.createdAt) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="联系方式" :span="2">{{ item.contact }}</ElDescriptionsItem>
        </ElDescriptions>

        <div class="detail-desc">
          <h3>详细描述</h3>
          <p>{{ item.description }}</p>
        </div>

        <div class="detail-publisher">
          <ElAvatar :size="48" :src="item.publisherAvatar" />
          <div class="publisher-info">
            <span class="publisher-name">{{ item.publisherName }}</span>
            <span class="publisher-stat">发布者</span>
          </div>
        </div>

        <ElDivider />

        <div class="detail-actions">
          <ElButton type="primary" size="large" @click="contactTA" class="action-btn">联系TA</ElButton>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <ElEmpty description="信息不存在或已删除">
      <ElButton type="primary" @click="router.push('/lost-found')">返回失物招领</ElButton>
    </ElEmpty>
  </div>
</template>

<style scoped>
.lost-detail-view {
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
