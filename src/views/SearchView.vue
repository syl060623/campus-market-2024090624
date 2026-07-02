<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElInput, ElButton, ElCard, ElTag, ElRow, ElCol, ElEmpty, ElBreadcrumb, ElBreadcrumbItem
} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useItemStore } from '@/stores/item'

const router = useRouter()
const route = useRoute()
const itemStore = useItemStore()
const keyword = ref('')

const allResults = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return { trade: [], lost: [], group: [], errand: [] }

  const trade = itemStore.tradeItems.filter(i =>
    i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  )
  const lost = itemStore.lostItems.filter(i =>
    i.itemName.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.location.toLowerCase().includes(q)
  )
  const group = itemStore.groupItems.filter(i =>
    i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.meetLocation.toLowerCase().includes(q)
  )
  const errand = itemStore.errandTasks.filter(i =>
    i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q) || i.deliveryLocation.toLowerCase().includes(q)
  )
  return { trade, lost, group, errand }
})

const totalCount = computed(() =>
  allResults.value.trade.length + allResults.value.lost.length + allResults.value.group.length + allResults.value.errand.length
)

function doSearch() {
  if (!keyword.value.trim()) return
  router.replace({ query: { q: keyword.value.trim() } })
}

function goToDetail(type: string, id: number) {
  const paths: Record<string, string> = { trade: '/trade/', lost: '/lost-found/', group: '/group-buy/', errand: '/errand/' }
  const path = paths[type]; if (path) router.push(path + id)
}

onMounted(() => {
  const q = route.query.q as string
  if (q) keyword.value = q
})

watch(() => route.query.q, (q) => {
  if (q) keyword.value = q as string
})
</script>

<template>
  <div class="search-view">
    <ElBreadcrumb separator="/" class="mb-4">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>搜索</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="search-bar">
      <ElInput
        v-model="keyword"
        placeholder="搜索二手、失物、拼单、跑腿..."
        size="large"
        clearable
        :prefix-icon="Search"
        @keyup.enter="doSearch"
      >
        <template #append>
          <ElButton type="primary" @click="doSearch">搜索</ElButton>
        </template>
      </ElInput>
    </div>

    <div v-if="keyword" class="result-stats">
      搜索"<strong>{{ keyword }}</strong>"，共找到 <strong>{{ totalCount }}</strong> 条结果
    </div>

    <template v-if="totalCount > 0">
      <section v-if="allResults.trade.length" class="result-section">
        <div class="section-header">
          <h3>二手交易 <span class="count">({{ allResults.trade.length }})</span></h3>
        </div>
        <ElRow :gutter="16">
          <ElCol v-for="item in allResults.trade" :key="'t'+item.id" :span="6">
            <ElCard class="result-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('trade', item.id)">
              <img :src="item.images[0]" :alt="item.title" class="card-img" />
              <div class="card-body">
                <h4 class="card-title">{{ item.title }}</h4>
                <div class="card-footer">
                  <span class="price">¥{{ item.price }}</span>
                  <ElTag size="small">{{ item.condition }}</ElTag>
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>
      </section>

      <section v-if="allResults.lost.length" class="result-section">
        <div class="section-header">
          <h3>失物招领 <span class="count">({{ allResults.lost.length }})</span></h3>
        </div>
        <ElRow :gutter="16">
          <ElCol v-for="item in allResults.lost" :key="'l'+item.id" :span="8">
            <ElCard class="result-card horizontal" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('lost', item.id)">
              <div class="card-row">
                <img :src="item.images[0]" :alt="item.itemName" class="card-img-sm" />
                <div class="card-body">
                  <ElTag :type="item.type === '拾到' ? 'success' : 'danger'" size="small">{{ item.type }}</ElTag>
                  <h4 class="card-title">{{ item.itemName }}</h4>
                  <span class="meta">{{ item.location }}</span>
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>
      </section>

      <section v-if="allResults.group.length" class="result-section">
        <div class="section-header">
          <h3>拼单搭子 <span class="count">({{ allResults.group.length }})</span></h3>
        </div>
        <ElRow :gutter="16">
          <ElCol v-for="item in allResults.group" :key="'g'+item.id" :span="8">
            <ElCard class="result-card horizontal" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('group', item.id)">
              <div class="card-row">
                <img :src="item.images[0]" :alt="item.title" class="card-img-sm" />
                <div class="card-body">
                  <h4 class="card-title">{{ item.title }}</h4>
                  <ElTag size="small" type="warning">还差{{ item.targetCount - item.currentCount }}人</ElTag>
                  <span class="meta">{{ item.meetLocation }}</span>
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>
      </section>

      <section v-if="allResults.errand.length" class="result-section">
        <div class="section-header">
          <h3>跑腿委托 <span class="count">({{ allResults.errand.length }})</span></h3>
        </div>
        <ElRow :gutter="16">
          <ElCol v-for="item in allResults.errand" :key="'e'+item.id" :span="8">
            <ElCard class="result-card horizontal" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('errand', item.id)">
              <div class="card-row">
                <img :src="item.images?.[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop'" :alt="item.title" class="card-img-sm" />
                <div class="card-body">
                  <h4 class="card-title">{{ item.title }}</h4>
                  <span class="price">¥{{ item.reward }}</span>
                  <span class="meta">{{ item.deliveryLocation }}</span>
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>
      </section>
    </template>

    <ElEmpty v-else-if="keyword && totalCount === 0" description="没有找到相关结果，试试其他关键词" />
  </div>
</template>

<style scoped>
.search-view {
  max-width: 1200px;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.search-bar {
  margin-bottom: 24px;
}

.result-stats {
  font-size: 14px;
  color: #64748B;
  margin-bottom: 24px;
}

.result-section {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
}

.count {
  font-size: 14px;
  color: #94A3B8;
  font-weight: 400;
}

.result-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 16px;
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
}

.result-card.horizontal {
  height: 120px;
}

.card-row {
  display: flex;
  height: 100%;
}

.card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.card-img-sm {
  width: 130px;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

.card-body {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: #EF4444;
}

.meta {
  font-size: 12px;
  color: #94A3B8;
  display: block;
  margin-top: 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
