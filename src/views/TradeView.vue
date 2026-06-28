<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElBreadcrumb, ElBreadcrumbItem, ElInput, ElSelect, ElOption, ElButton, ElRow, ElCol,
  ElCard, ElTag, ElPagination, ElAvatar, ElIcon, ElEmpty
} from 'element-plus'
import { Search, Star, StarFilled, Timer, Location } from '@element-plus/icons-vue'
import type { TradeItem } from '@/types/item'
import { useFavoriteStore } from '@/stores/favorite'
import { useItemStore } from '@/stores/item'
import { formatTime } from '@/utils/format'
import { ITEM_CATEGORIES, ITEM_CONDITIONS, LOCATIONS, TRADE_SORT_OPTIONS } from '@/utils/constants'

const router = useRouter()
const route = useRoute()
const favoriteStore = useFavoriteStore()
const itemStore = useItemStore()

const items = computed(() => itemStore.tradeItems)
const searchQuery = ref('')

onMounted(() => {
  const q = route.query.search as string
  if (q) searchQuery.value = q
})

watch(() => route.query.search, (q) => {
  if (q) searchQuery.value = q as string
})
const categoryFilter = ref('')
const conditionFilter = ref('')
const locationFilter = ref('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(8)

const categoryOptions = [...ITEM_CATEGORIES]
const conditionOptions = [...ITEM_CONDITIONS]
const locationOptions = [...LOCATIONS]
const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
]

const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    if (searchQuery.value && !item.title.includes(searchQuery.value) && !item.description.includes(searchQuery.value)) return false
    if (categoryFilter.value && item.category !== categoryFilter.value) return false
    if (conditionFilter.value && item.condition !== conditionFilter.value) return false
    if (locationFilter.value && item.location !== locationFilter.value) return false
    if (priceMin.value !== null && item.price < priceMin.value) return false
    if (priceMax.value !== null && item.price > priceMax.value) return false
    return true
  })
  if (sortBy.value === 'price-asc') result.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-desc') result.sort((a, b) => b.price - a.price)
  else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return result
})

const total = computed(() => filteredItems.value.length)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

function goToDetail(id: number) {
  router.push(`/trade/${id}`)
}

function handlePageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleFav(e: Event, id: number) {
  e.stopPropagation()
  favoriteStore.toggleFavorite(id)
}
</script>

<template>
  <div class="trade-view">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>二手交易</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="toolbar">
      <div class="search-row">
        <ElInput v-model="searchQuery" placeholder="搜索二手商品..." clearable :prefix-icon="Search" class="search-input" />
        <ElSelect v-model="categoryFilter" placeholder="分类" clearable class="filter-select">
          <ElOption v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
        </ElSelect>
        <ElSelect v-model="conditionFilter" placeholder="成色" clearable class="filter-select">
          <ElOption v-for="c in conditionOptions" :key="c" :label="c" :value="c" />
        </ElSelect>
        <ElSelect v-model="locationFilter" placeholder="校区" clearable class="filter-select">
          <ElOption v-for="loc in locationOptions" :key="loc" :label="loc" :value="loc" />
        </ElSelect>
      </div>
      <div class="filter-row">
        <div class="price-range">
          <ElInput v-model.number="priceMin" placeholder="最低价" type="number" class="price-input" />
          <span class="price-sep">—</span>
          <ElInput v-model.number="priceMax" placeholder="最高价" type="number" class="price-input" />
        </div>
        <div class="sort-group">
          <span class="sort-label">排序：</span>
          <ElButton v-for="opt in sortOptions" :key="opt.value" :type="sortBy === opt.value ? 'primary' : 'default'" size="small" @click="sortBy = opt.value">{{ opt.label }}</ElButton>
        </div>
      </div>
    </div>

    <ElRow :gutter="20">
      <ElCol v-for="item in pagedItems" :key="item.id" :span="6" class="card-col">
        <ElCard class="item-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail(item.id)">
          <div class="card-image">
            <img :src="item.images[0]" :alt="item.title" />
            <button class="fav-btn" :class="{ active: favoriteStore.isFavorited(item.id) }" @click="(e) => toggleFav(e, item.id)">
              <ElIcon :size="18"><StarFilled v-if="favoriteStore.isFavorited(item.id)" /><Star v-else /></ElIcon>
            </button>
          </div>
          <div class="card-body">
            <ElTag :type="item.condition === '全新' ? 'success' : item.condition === '九成新' ? 'primary' : 'warning'" size="small" class="condition-tag">{{ item.condition }}</ElTag>
            <h4 class="card-title">{{ item.title }}</h4>
            <div class="card-price">
              <span class="price">¥{{ item.price }}</span>
              <span class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</span>
            </div>
            <div class="card-meta">
              <span class="meta-item"><ElIcon :size="12"><Location /></ElIcon>{{ item.location }}</span>
              <span class="meta-item"><ElIcon :size="12"><Timer /></ElIcon>{{ formatTime(item.createdAt) }}</span>
            </div>
            <div class="card-publisher">
              <ElAvatar :size="24" :src="item.publisherAvatar" />
              <span class="publisher-name">{{ item.publisherName }}</span>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <div class="pagination-wrap" v-if="total > 0">
      <ElPagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
    <div class="empty-wrap" v-else>
      <ElEmpty description="没有找到符合条件的商品" />
    </div>
  </div>
</template>

<style scoped>
.trade-view {
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
}

.filter-select {
  width: 130px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-input {
  width: 100px;
}

.price-sep {
  color: #94A3B8;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-label {
  font-size: 13px;
  color: #64748B;
  margin-right: 4px;
}

.card-col {
  margin-bottom: 20px;
}

.item-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #94A3B8;
}

.fav-btn.active {
  color: #EF4444;
  background: rgba(239,68,68,0.1);
}

.fav-btn:hover {
  transform: scale(1.1);
}

.card-body {
  padding: 12px 14px 14px;
}

.condition-tag {
  margin-bottom: 6px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 39px;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #EF4444;
}

.original-price {
  font-size: 12px;
  color: #94A3B8;
  text-decoration: line-through;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #94A3B8;
}

.card-publisher {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid #F1F5F9;
}

.publisher-name {
  font-size: 12px;
  color: #64748B;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.empty-wrap {
  padding: 60px 0;
}
</style>
