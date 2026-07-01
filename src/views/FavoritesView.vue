<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favorite'
import { useRouter } from 'vue-router'
import { ElRow, ElCol, ElCard, ElTag, ElButton, ElEmpty, ElIcon, ElMessage } from 'element-plus'
import { StarFilled, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }
  return map[type] || '校园信息'
}

function removeFavorite(type: 'trade' | 'lostFound' | 'groupBuy' | 'errand', id: number) {
  favoriteStore.removeFavorite(type, id)
  ElMessage.success('已取消收藏')
}
</script>

<template>
  <div class="favorites-view">
    <div class="page-header">
      <h2>我的收藏</h2>
      <span class="fav-count">共 {{ favoriteStore.favoriteCount }} 件收藏</span>
    </div>

    <template v-if="favoriteStore.favorites.length > 0">
      <ElRow :gutter="20">
        <ElCol
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :xs="24" :sm="12" :md="8" :lg="6"
        >
          <ElCard class="fav-card" :body-style="{ padding: 0 }" shadow="hover">
            <div class="fav-image">
              <div class="fav-badge">
                <ElIcon color="#F59E0B"><StarFilled /></ElIcon>
              </div>
            </div>
            <div class="fav-body">
              <h4 class="fav-title">{{ item.title }}</h4>
              <ElTag size="small">{{ getTypeLabel(item.type) }}</ElTag>
              <p class="fav-desc">{{ item.description }}</p>
              <div class="fav-bottom">
                <span class="fav-location" v-if="item.location">{{ item.location }}</span>
                <ElButton
                  size="small"
                  text
                  type="danger"
                  :icon="Delete"
                  @click="removeFavorite(item.type, item.id)"
                >
                  取消收藏
                </ElButton>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </template>

    <ElEmpty v-else description="还没有收藏任何内容" :image-size="200">
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
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.fav-image {
  height: 140px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.fav-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.fav-body {
  padding: 12px;
}

.fav-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
}

.fav-desc {
  font-size: 12px;
  color: #64748B;
  margin: 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fav-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.fav-location {
  font-size: 12px;
  color: #94A3B8;
}
</style>
