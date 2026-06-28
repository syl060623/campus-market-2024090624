<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElBreadcrumb, ElBreadcrumbItem, ElSelect, ElOption, ElInput, ElRow, ElCol,
  ElCard, ElTag, ElPagination, ElButton, ElEmpty, ElIcon
} from 'element-plus'
import { Search, Timer, Location } from '@element-plus/icons-vue'
import type { ErrandTask } from '@/types/task'
import { useItemStore } from '@/stores/item'
import { formatTime, statusTagType } from '@/utils/format'
import { TASK_TYPES, LOCATIONS } from '@/utils/constants'

const router = useRouter()
const itemStore = useItemStore()

const items = computed(() => itemStore.errandTasks)
const typeFilter = ref('')
const locationFilter = ref('')
const searchQuery = ref('')
const rewardMin = ref<number | null>(null)
const rewardMax = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(8)

const typeOptions = [...TASK_TYPES]
const locationOptions = [...LOCATIONS]

const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    if (typeFilter.value && item.type !== typeFilter.value) return false
    if (locationFilter.value && !item.deliveryLocation.includes(locationFilter.value)) return false
    if (searchQuery.value && !item.title.includes(searchQuery.value) && !item.content.includes(searchQuery.value)) return false
    if (rewardMin.value !== null && item.reward < rewardMin.value) return false
    if (rewardMax.value !== null && item.reward > rewardMax.value) return false
    return true
  })
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return result
})

const total = computed(() => filteredItems.value.length)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

function goToDetail(id: number) {
  router.push(`/errand/${id}`)
}

function handlePageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function takeOrder(e: Event, id: number) {
  e.stopPropagation()
  const item = items.value.find(i => i.id === id)
  if (item && item.status === '待接单') {
    item.status = '已接单'
  }
}
</script>

<template>
  <div class="errand-view">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>跑腿委托</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="toolbar">
      <div class="filter-row">
        <ElSelect v-model="typeFilter" placeholder="任务类型" clearable class="filter-select">
          <ElOption v-for="t in typeOptions" :key="t" :label="t" :value="t" />
        </ElSelect>
        <ElSelect v-model="locationFilter" placeholder="校区" clearable class="filter-select">
          <ElOption v-for="loc in locationOptions" :key="loc" :label="loc" :value="loc" />
        </ElSelect>
        <ElInput v-model="searchQuery" placeholder="搜索跑腿任务..." clearable :prefix-icon="Search" class="search-input" />
      </div>
      <div class="reward-range">
        <span class="reward-label">报酬范围：</span>
        <ElInput v-model.number="rewardMin" placeholder="最低" type="number" class="reward-input" />
        <span class="price-sep">—</span>
        <ElInput v-model.number="rewardMax" placeholder="最高" type="number" class="reward-input" />
      </div>
    </div>

    <ElRow :gutter="20">
      <ElCol v-for="item in pagedItems" :key="item.id" :span="12" class="card-col">
        <ElCard class="task-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail(item.id)">
          <div class="card-row">
            <div class="card-image">
              <img :src="item.images?.[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'" :alt="item.title" />
            </div>
            <div class="card-body">
              <div class="card-header">
                <ElTag :type="item.type === '取快递' ? 'primary' : item.type === '送东西' ? 'success' : item.type === '代购' ? 'warning' : 'info'" size="small">{{ item.type }}</ElTag>
                <ElTag :type="statusTagType(item.status)" size="small">{{ item.status }}</ElTag>
                <span class="card-time">{{ formatTime(item.createdAt) }}</span>
              </div>
              <h4 class="card-title">{{ item.title }}</h4>
              <p class="card-desc">{{ item.content.slice(0, 50) }}{{ item.content.length > 50 ? '...' : '' }}</p>
              <div class="card-footer">
                <span class="meta-item"><ElIcon :size="12"><Location /></ElIcon>{{ item.deliveryLocation }}</span>
                <span class="meta-item"><ElIcon :size="12"><Timer /></ElIcon>{{ formatTime(item.expectedTime) }}前</span>
                <span class="reward">¥{{ item.reward }}</span>
                <ElButton type="primary" size="small" @click="(e) => takeOrder(e, item.id)" v-if="item.status === '待接单'" class="take-btn">接单</ElButton>
              </div>
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
      <ElEmpty description="暂无跑腿任务" />
    </div>
  </div>
</template>

<style scoped>
.errand-view {
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

.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-select {
  width: 140px;
}

.search-input {
  flex: 1;
}

.reward-range {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-label {
  font-size: 13px;
  color: #64748B;
  white-space: nowrap;
}

.reward-input {
  width: 100px;
}

.price-sep {
  color: #94A3B8;
}

.card-col {
  margin-bottom: 16px;
}

.task-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
}

.card-row {
  display: flex;
  height: 100%;
}

.card-image {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 4px;
}

.card-time {
  font-size: 12px;
  color: #94A3B8;
  margin-left: auto;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.4;
  flex: 1;
}

.card-footer {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #94A3B8;
}

.reward {
  font-size: 16px;
  font-weight: 700;
  color: #EF4444;
  margin-left: auto;
}

.take-btn {
  flex-shrink: 0;
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
