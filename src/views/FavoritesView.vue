<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useRouter } from 'vue-router'
import { ElRow, ElCol, ElCard, ElTag, ElButton, ElEmpty, ElIcon, ElMessage } from 'element-plus'
import { Star, StarFilled, Delete } from '@element-plus/icons-vue'
import { useItemStore } from '@/stores/item'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const itemStore = useItemStore()

const favoriteItems = computed(() =>
  itemStore.allItemsForFavorites.filter(item => favoriteStore.isFavorited(item.id))
)

function removeFavorite(id: number) {
  favoriteStore.removeFavorite(id)
  ElMessage.success('已取消收藏')
}

function goToDetail(id: number) {
  router.push('/trade/' + id)
}
</script>

<template>
  <div class="favorites-view">
    <div class="page-header">
      <h2>我的收藏</h2>
      <span class="fav-count">共 {{ favoriteItems.length }} 件收藏</span>
    </div>

    <template v-if="favoriteItems.length > 0">
      <ElRow :gutter="20">
        <ElCol
          v-for="item in favoriteItems"
          :key="item.id"
          :xs="24" :sm="12" :md="8" :lg="6"
        >
          <ElCard class="fav-card" :body-style="{ padding: 0 }" shadow="hover">
            <div class="fav-image" @click="goToDetail(item.id)">
              <img :src="item.image" :alt="item.title" />
              <div class="fav-badge">
                <ElIcon color="#F59E0B"><StarFilled /></ElIcon>
              </div>
            </div>
            <div class="fav-body">
              <h4 class="fav-title" @click="goToDetail(item.id)">{{ item.title }}</h4>
              <div class="fav-bottom">
                <span class="fav-price">¥{{ item.price }}</span>
                <ElButton
                  size="small"
                  text
                  type="danger"
                  :icon="Delete"
                  @click="removeFavorite(item.id)"
                >
                  取消收藏
                </ElButton>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </template>

    <ElEmpty v-else description="还没有收藏任何商品" :image-size="200">
      <ElButton type="primary" @click="router.push('/trade')">去逛逛</ElButton>
    </ElEmpty>
  </div>
</template>

<style scoped>
.favorites-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
}

.fav-count {
  font-size: 14px;
  color: #94A3B8;
}

.fav-card {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.fav-card:hover {
  transform: translateY(-2px);
}

.fav-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.fav-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.fav-card:hover .fav-image img {
  transform: scale(1.05);
}

.fav-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-body {
  padding: 14px;
}

.fav-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fav-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-price {
  font-size: 18px;
  font-weight: 700;
  color: #EF4444;
}
</style>
