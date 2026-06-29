<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElBreadcrumb, ElBreadcrumbItem, ElSelect, ElOption, ElInput, ElRow, ElCol,
  ElCard, ElTag, ElProgress, ElPagination, ElIcon
} from 'element-plus'
import { Search, Location } from '@element-plus/icons-vue'
import type { GroupBuyItem } from '@/types/group'
import { getGroupBuys } from '@/api/groupBuy'
import { useItemStore } from '@/stores/item'
import EmptyState from '@/components/EmptyState.vue'
import { formatTime, deadlineText } from '@/utils/format'
import { GROUP_TYPES, LOCATIONS } from '@/utils/constants'

const router = useRouter()
const itemStore = useItemStore()

const items = ref<GroupBuyItem[]>([])

onMounted(async () => {
  try {
    const res = await getGroupBuys()
    items.value = res.data
  } catch {
    items.value = itemStore.groupItems
  }
})
const typeFilter = ref('')
const locationFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(8)

const typeOptions = [...GROUP_TYPES]
const locationOptions = [...LOCATIONS, '线上']

const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    if (typeFilter.value && item.type !== typeFilter.value) return false
    if (locationFilter.value && !item.meetLocation.includes(locationFilter.value)) return false
    if (searchQuery.value && !item.title.includes(searchQuery.value) && !item.description.includes(searchQuery.value)) return false
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
  router.push(`/group-buy/${id}`)
}

function handlePageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="group-buy-view">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>拼单搭子</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="toolbar">
      <div class="filter-row">
        <ElSelect v-model="typeFilter" placeholder="拼单类型" clearable class="filter-select">
          <ElOption v-for="t in typeOptions" :key="t" :label="t" :value="t" />
        </ElSelect>
        <ElSelect v-model="locationFilter" placeholder="地点" clearable class="filter-select">
          <ElOption v-for="loc in locationOptions" :key="loc" :label="loc" :value="loc" />
        </ElSelect>
        <ElInput v-model="searchQuery" placeholder="搜索拼单..." clearable :prefix-icon="Search" class="search-input" />
      </div>
    </div>

    <ElRow :gutter="20">
      <ElCol v-for="item in pagedItems" :key="item.id" :span="12" class="card-col">
        <ElCard class="group-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail(item.id)">
          <div class="card-row">
            <div class="card-image">
              <img :src="item.images[0]" :alt="item.title" />
            </div>
            <div class="card-body">
              <div class="card-header">
                <ElTag :type="item.type === '餐饮' ? 'warning' : item.type === '出行' ? 'primary' : item.type === '购物' ? 'success' : 'info'" size="small">{{ item.type }}</ElTag>
                <span class="card-time">{{ formatTime(item.createdAt) }}</span>
              </div>
              <h4 class="card-title">{{ item.title }}</h4>
              <div class="progress-wrap">
                <span class="progress-label">拼单进度：</span>
                <ElProgress :percentage="Math.round(item.currentCount / item.targetCount * 100)" :stroke-width="8" :show-text="false" class="group-progress" />
                <span class="progress-count">{{ item.currentCount }}/{{ item.targetCount }}人</span>
              </div>
              <div class="card-footer">
                <span class="meta-item"><ElIcon :size="12"><Location /></ElIcon>{{ item.meetLocation }}</span>
                <ElTag :type="deadlineText(item.deadline) === '已截止' ? 'danger' : 'warning'" size="small">{{ deadlineText(item.deadline) }}</ElTag>
                <ElTag type="danger" size="small" v-if="item.targetCount - item.currentCount > 0">还差{{ item.targetCount - item.currentCount }}人</ElTag>
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
    <EmptyState v-else text="暂无拼单信息" />
  </div>
</template>

<style scoped>
.group-buy-view {
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
}

.filter-select {
  width: 140px;
}

.search-input {
  flex: 1;
}

.card-col {
  margin-bottom: 16px;
}

.group-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  transition: transform 0.2s;
}

.group-card:hover {
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.card-time {
  font-size: 12px;
  color: #94A3B8;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.progress-label {
  font-size: 12px;
  color: #64748B;
  white-space: nowrap;
}

.group-progress {
  flex: 1;
}

.progress-count {
  font-size: 12px;
  color: #3B82F6;
  font-weight: 600;
  white-space: nowrap;
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

.pagination-wrap {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.empty-wrap {
  padding: 60px 0;
}
</style>
