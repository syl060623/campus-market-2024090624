<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElBreadcrumb, ElBreadcrumbItem, ElSelect, ElOption, ElInput, ElRow, ElCol,
  ElCard, ElTag, ElPagination, ElIcon
} from 'element-plus'
import { Search, Timer, Location } from '@element-plus/icons-vue'
import type { LostFoundItem } from '@/types/lost'
import { getLostFounds } from '@/api/lostFound'
import { useItemStore } from '@/stores/item'
import EmptyState from '@/components/EmptyState.vue'
import { formatTime } from '@/utils/format'
import { LOCATIONS } from '@/utils/constants'

const router = useRouter()
const itemStore = useItemStore()

const items = ref<LostFoundItem[]>([])

onMounted(async () => {
  try {
    const res = await getLostFounds()
    items.value = res.data
  } catch {
    items.value = itemStore.lostItems
  }
})
const typeFilter = ref('')
const locationFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(8)

const typeOptions = [
  { value: '', label: '全部类型' },
  { value: '丢失', label: '丢失' },
  { value: '拾到', label: '拾到' },
]
const locationOptions = [...LOCATIONS]

const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    if (typeFilter.value && item.type !== typeFilter.value) return false
    if (locationFilter.value && item.location !== locationFilter.value) return false
    if (searchQuery.value && !item.itemName.includes(searchQuery.value) && !item.description.includes(searchQuery.value)) return false
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
  router.push(`/lost-found/${id}`)
}

function handlePageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="lost-found-view">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>失物招领</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="toolbar">
      <div class="filter-row">
        <ElSelect v-model="typeFilter" class="filter-select">
          <ElOption v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </ElSelect>
        <ElSelect v-model="locationFilter" placeholder="校区" clearable class="filter-select">
          <ElOption v-for="loc in locationOptions" :key="loc" :label="loc" :value="loc" />
        </ElSelect>
        <ElInput v-model="searchQuery" placeholder="搜索物品名称..." clearable :prefix-icon="Search" class="search-input" />
      </div>
    </div>

    <ElRow :gutter="20">
      <ElCol v-for="item in pagedItems" :key="item.id" :span="12" class="card-col">
        <ElCard class="lost-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail(item.id)">
          <div class="card-row">
            <div class="card-image">
              <img :src="item.images[0]" :alt="item.itemName" />
            </div>
            <div class="card-body">
              <div class="card-header">
                <ElTag :type="item.type === '拾到' ? 'success' : 'danger'" size="small">{{ item.type === '拾到' ? '拾到' : '丢失' }}</ElTag>
                <span class="card-time">{{ formatTime(item.createdAt) }}</span>
              </div>
              <h4 class="card-title">{{ item.itemName }}</h4>
              <p class="card-desc">{{ item.description.slice(0, 60) }}{{ item.description.length > 60 ? '...' : '' }}</p>
              <div class="card-footer">
                <span class="meta-item"><ElIcon :size="12"><Location /></ElIcon>{{ item.location }}</span>
                <span class="meta-item"><ElIcon :size="12"><Timer /></ElIcon>{{ formatTime(item.happenedAt) }}发生</span>
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
    <EmptyState v-else text="暂无失物招领信息" />
  </div>
</template>

<style scoped>
.lost-found-view {
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

.lost-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  transition: transform 0.2s;
}

.lost-card:hover {
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
  margin-bottom: 6px;
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
}

.card-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.4;
  flex: 1;
}

.card-footer {
  display: flex;
  gap: 16px;
  margin-top: 8px;
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
