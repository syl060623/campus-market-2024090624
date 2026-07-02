<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'
import SearchBar from '../components/SearchBar.vue'
import { useFavoriteStore } from '../stores/favorite'
import { getTrades, type TradeItem } from '../api/trade'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const trades = ref<TradeItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredTrades = computed(() => {
  const value = keyword.value.trim()

  if (!value) {
    return trades.value
  }

  return trades.value.filter((item) => {
    return (
      item.title.includes(value) ||
      item.category.includes(value) ||
      item.location.includes(value) ||
      item.description.includes(value)
    )
  })
})

async function loadTrades() {
  loading.value = true
  error.value = false

  try {
    const res = await getTrades()
    trades.value = res.data
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

function goDetail(id: number) {
  router.push(`/trade/${id}`)
}

function toggleFav(item: TradeItem, e: Event) {
  e.stopPropagation()
  favoriteStore.toggleFavorite({
    id: item.id,
    type: 'trade',
    title: item.title,
    description: item.description,
    location: item.location,
  })
}

onMounted(() => {
  loadTrades()
})
</script>

<template>
  <section class="page">
    <h1>二手交易</h1>

    <SearchBar
      v-model="keyword"
      placeholder="搜索商品标题、分类、地点或描述"
    />

    <LoadingState
      v-if="loading"
      text="正在加载二手交易信息..."
    />

    <ErrorState
      v-else-if="error"
      message="二手交易数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadTrades"
    />

    <EmptyState
      v-else-if="filteredTrades.length === 0"
      text="暂无符合条件的二手交易信息"
    />

    <div v-else class="grid">
      <div
        v-for="item in filteredTrades"
        :key="item.id"
        class="card"
        @click="goDetail(item.id)"
      >
        <div class="card-image">
          <img :src="item.images?.[0] || item.image" :alt="item.title" />
          <span class="condition-tag">{{ item.condition }}</span>
        </div>

        <div class="card-body">
          <h3>{{ item.title }}</h3>

          <div class="price-row">
            <span class="price">¥{{ item.price }}</span>
            <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
          </div>

          <div class="meta-row">
            <span>{{ item.category }}</span>
            <span>{{ item.location }}</span>
            <span>{{ item.publishTime?.slice(0, 10) }}</span>
          </div>

          <div class="card-footer">
            <div class="publisher">
              <img :src="item.publisherAvatar" class="avatar" />
              <span>{{ item.publisherName }}</span>
            </div>
            <button
              class="fav-btn"
              :class="{ active: favoriteStore.isFavorite('trade', item.id) }"
              @click="toggleFav(item, $event)"
            >
              {{ favoriteStore.isFavorite('trade', item.id) ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f9fafb;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.condition-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
}

.card-body {
  padding: 14px;
}

.card-body h3 {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
}

.original-price {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: line-through;
}

.meta-row {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.publisher {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.fav-btn {
  border: none;
  border-radius: 999px;
  padding: 5px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 13px;
  transition: all 0.2s;
}

.fav-btn.active {
  background: #dbeafe;
  color: #2563eb;
}
</style>
