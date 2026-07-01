<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElBreadcrumb, ElBreadcrumbItem, ElButton, ElTag, ElAvatar, ElDivider,
  ElCarousel, ElCarouselItem, ElDescriptions, ElDescriptionsItem, ElCard, ElRow, ElCol, ElIcon
} from 'element-plus'
import { Star, StarFilled } from '@element-plus/icons-vue'
import type { TradeItem } from '@/types/item'
import { useFavoriteStore } from '@/stores/favorite'
import { useItemStore } from '@/stores/item'
import { formatTime } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const favoriteStore = useFavoriteStore()
const itemStore = useItemStore()

const itemId = computed(() => route.params.id as string)
const item = computed(() => itemStore.tradeItems.find(i => String(i.id) === itemId.value))

const relatedItems = computed(() => {
  if (!item.value) return []
  return itemStore.tradeItems
    .filter(i => i.id !== item.value!.id && i.category === item.value!.category)
    .slice(0, 4)
})

function contactTA() {
  if (item.value) {
    router.push(`/chat/${item.value.publisherId}`)
  }
}
</script>

<template>
  <div class="item-detail-view" v-if="item">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem :to="{ path: '/trade' }">二手交易</ElBreadcrumbItem>
      <ElBreadcrumbItem>{{ item.title.slice(0, 16) }}...</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="detail-main">
      <div class="detail-gallery">
        <ElCard class="gallery-card" :body-style="{ padding: 0 }">
          <ElCarousel height="400px" indicator-position="outside" v-if="item.images.length > 1">
            <ElCarouselItem v-for="(img, idx) in item.images" :key="idx">
              <img :src="img" :alt="item.title" class="gallery-img" />
            </ElCarouselItem>
          </ElCarousel>
          <div v-else class="single-image">
            <img :src="item.images[0]" :alt="item.title" class="gallery-img" />
          </div>
        </ElCard>
      </div>

      <div class="detail-info">
        <h1 class="detail-title">{{ item.title }}</h1>
        <div class="detail-price-box">
          <span class="detail-price">¥{{ item.price }}</span>
          <span class="detail-original" v-if="item.originalPrice">原价 ¥{{ item.originalPrice }}</span>
          <ElTag :type="item.status === 'active' ? 'success' : 'danger'" class="status-tag">{{ item.status === 'active' ? '在售' : '已售' }}</ElTag>
        </div>

        <ElDescriptions :column="2" border class="detail-descriptions">
          <ElDescriptionsItem label="分类">{{ item.category }}</ElDescriptionsItem>
          <ElDescriptionsItem label="成色">{{ item.condition }}</ElDescriptionsItem>
          <ElDescriptionsItem label="校区">{{ item.location }}</ElDescriptionsItem>
          <ElDescriptionsItem label="发布时间">{{ formatTime(item.createdAt) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="联系方式" :span="2">{{ item.contact }}</ElDescriptionsItem>
        </ElDescriptions>

        <div class="detail-desc">
          <h3>商品描述</h3>
          <p>{{ item.description }}</p>
        </div>

        <div class="detail-publisher">
          <ElAvatar :size="48" :src="item.publisherAvatar" />
          <div class="publisher-info">
            <span class="publisher-name">{{ item.publisherName }}</span>
            <span class="publisher-stat">已发布 {{ itemStore.tradeItems.filter(i => i.publisherId === item!.publisherId).length }} 件商品</span>
          </div>
        </div>

        <ElDivider />

        <div class="detail-actions">
          <ElButton type="primary" size="large" @click="contactTA" class="action-btn">联系TA</ElButton>
          <ElButton
            size="large"
            :type="favoriteStore.isFavorite('trade', item.id) ? 'danger' : 'default'"
            @click="favoriteStore.toggleFavorite({ id: item.id, type: 'trade', title: item.title, description: item.description, location: item.location })"
            class="action-btn"
          >
            <ElIcon><StarFilled v-if="favoriteStore.isFavorite('trade', item.id)" /><Star v-else /></ElIcon>
            {{ favoriteStore.isFavorite('trade', item.id) ? '已收藏' : '收藏' }}
          </ElButton>
        </div>
      </div>
    </div>

    <ElDivider v-if="relatedItems.length > 0">
      <span class="related-title">相关推荐</span>
    </ElDivider>

    <ElRow :gutter="20" v-if="relatedItems.length > 0">
      <ElCol v-for="rel in relatedItems" :key="rel.id" :span="6">
        <ElCard class="related-card" :body-style="{ padding: 0 }" shadow="hover" @click="router.push(`/trade/${rel.id}`)">
          <div class="related-img">
            <img :src="rel.images[0]" :alt="rel.title" />
          </div>
          <div class="related-body">
            <h4 class="related-title-text">{{ rel.title }}</h4>
            <span class="related-price">¥{{ rel.price }}</span>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
  <div v-else class="not-found">
    <ElEmpty description="商品不存在或已下架">
      <ElButton type="primary" @click="router.push('/trade')">返回二手列表</ElButton>
    </ElEmpty>
  </div>
</template>

<style scoped>
.item-detail-view {
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

.single-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.detail-info {
  width: 420px;
  flex-shrink: 0;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
  line-height: 1.4;
  margin-bottom: 16px;
}

.detail-price-box {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #FFF1F2;
  border-radius: 12px;
}

.detail-price {
  font-size: 32px;
  font-weight: 800;
  color: #EF4444;
}

.detail-original {
  font-size: 14px;
  color: #94A3B8;
  text-decoration: line-through;
}

.status-tag {
  margin-left: auto;
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

.related-title {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
}

.related-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.related-img {
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.related-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-body {
  padding: 10px 12px;
}

.related-title-text {
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-price {
  font-size: 16px;
  font-weight: 700;
  color: #EF4444;
}

.not-found {
  padding: 80px 0;
}
</style>
