<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElButton, ElCard, ElTag, ElRow, ElCol, ElMessage, ElIcon } from 'element-plus'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import AppNav from '@/components/AppNav.vue'
import { useItemStore } from '@/stores/item'
import { formatTime } from '@/utils/format'

const router = useRouter()
const searchQuery = ref('')
const itemStore = useItemStore()

const categories = [
  { icon: '🔄', title: '二手交易', desc: '闲置好物，低价转让', path: '/trade', color: '#3B82F6' },
  { icon: '🔍', title: '失物招领', desc: '丢失拾到，爱心接力', path: '/lost-found', color: '#F59E0B' },
  { icon: '🤝', title: '拼单搭子', desc: '组团拼单，省钱省心', path: '/group-buy', color: '#10B981' },
  { icon: '🏃', title: '跑腿委托', desc: '忙不过来，我来帮您', path: '/errand', color: '#8B5CF6' },
]

const latestTradeItems = computed(() => itemStore.tradeItems.slice(0, 8).map(i => ({ id: i.id, title: i.title, price: i.price, image: i.images[0], location: i.location, time: formatTime(i.createdAt) })))
const latestLostItems = computed(() => itemStore.lostItems.slice(0, 4).map(i => ({ id: i.id, type: i.type, itemName: i.itemName, image: i.images[0], location: i.location, time: formatTime(i.createdAt) })))
const latestGroupItems = computed(() => itemStore.groupItems.slice(0, 4).map(i => ({ id: i.id, title: i.title, current: i.currentCount, target: i.targetCount, image: i.images[0], location: i.meetLocation, time: formatTime(i.createdAt) })))
const latestErrandItems = computed(() => itemStore.errandTasks.slice(0, 4).map(i => ({ id: i.id, title: i.title, reward: i.reward, image: i.images?.[0] || 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop', location: i.deliveryLocation, time: formatTime(i.createdAt) })))

function quickSearch() {
  const q = searchQuery.value.trim()
  if (!q) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  router.push({ path: '/search', query: { q } })
}

function goTo(path: string) {
  router.push(path)
}

function goToDetail(type: string, id: number) {
  const paths: Record<string, string> = {
    trade: '/trade/',
    lost: '/lost-found/',
    group: '/group-buy/',
    errand: '/errand/'
  }
  const path = paths[type]
  if (path) router.push(path + id)
}
</script>

<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">校园轻集市</h1>
        <p class="hero-subtitle">二手交易 · 失物招领 · 拼单搭子 · 跑腿委托</p>
        <div class="hero-search">
          <ElInput
            v-model="searchQuery"
            placeholder="搜索你想要的..."
            size="large"
            clearable
            class="hero-search-input"
            :prefix-icon="Search"
            @keyup.enter="quickSearch"
          >
            <template #append>
              <ElButton type="primary" @click="quickSearch">搜索</ElButton>
            </template>
          </ElInput>
        </div>
      </div>
    </section>

    <AppNav />

    <section class="category-grid">
      <ElRow :gutter="20">
        <ElCol v-for="cat in categories" :key="cat.title" :span="6">
          <ElCard class="category-card" :body-style="{ padding: '24px' }" shadow="hover" @click="goTo(cat.path)">
            <div class="category-card-inner">
              <div class="category-icon" :style="{ background: cat.color + '15', color: cat.color }">
                {{ cat.icon }}
              </div>
              <div class="category-info">
                <h3>{{ cat.title }}</h3>
                <p>{{ cat.desc }}</p>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>最新二手</h2>
        <router-link to="/trade" class="section-more">
          查看更多 <ElIcon><ArrowRight /></ElIcon>
        </router-link>
      </div>
      <ElRow :gutter="20">
        <ElCol v-for="item in latestTradeItems" :key="item.id" :span="6">
          <ElCard class="info-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('trade', item.id)">
            <div class="card-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="card-body">
              <h4 class="card-title">{{ item.title }}</h4>
              <div class="card-meta">
                <span class="price">¥{{ item.price }}</span>
                <span class="location">{{ item.location }}</span>
              </div>
              <div class="card-footer">
                <span class="time">{{ item.time }}</span>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>失物招领</h2>
        <router-link to="/lost-found" class="section-more">
          查看更多 <ElIcon><ArrowRight /></ElIcon>
        </router-link>
      </div>
      <ElRow :gutter="16">
        <ElCol v-for="item in latestLostItems" :key="item.id" :span="6">
          <ElCard class="compact-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('lost', item.id)">
            <img :src="item.image" :alt="item.itemName" class="compact-img" />
            <div class="compact-body">
              <ElTag :type="item.type === '拾到' ? 'success' : 'danger'" size="small" class="compact-tag">{{ item.type }}</ElTag>
              <h4 class="compact-title">{{ item.itemName }}</h4>
              <div class="compact-meta">
                <span>{{ item.location }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>拼单搭子</h2>
        <router-link to="/group-buy" class="section-more">
          查看更多 <ElIcon><ArrowRight /></ElIcon>
        </router-link>
      </div>
      <ElRow :gutter="16">
        <ElCol v-for="item in latestGroupItems" :key="item.id" :span="6">
          <ElCard class="compact-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('group', item.id)">
            <img :src="item.image" :alt="item.title" class="compact-img" />
            <div class="compact-body">
              <h4 class="compact-title">{{ item.title }}</h4>
              <ElTag type="warning" size="small">还差{{ item.target - item.current }}人</ElTag>
              <div class="compact-meta">
                <span>{{ item.location }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>跑腿委托</h2>
        <router-link to="/errand" class="section-more">
          查看更多 <ElIcon><ArrowRight /></ElIcon>
        </router-link>
      </div>
      <ElRow :gutter="16">
        <ElCol v-for="item in latestErrandItems" :key="item.id" :span="6">
          <ElCard class="compact-card" :body-style="{ padding: 0 }" shadow="hover" @click="goToDetail('errand', item.id)">
            <img :src="item.image" :alt="item.title" class="compact-img" />
            <div class="compact-body">
              <h4 class="compact-title">{{ item.title }}</h4>
              <span class="price">¥{{ item.reward }}</span>
              <div class="compact-meta">
                <span>{{ item.location }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%);
  border-radius: 16px;
  padding: 48px 64px;
  margin-bottom: 24px;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 24px;
}

.hero-search-input {
  max-width: 500px;
  margin: 0 auto;
}

.hero-search-input :deep(.el-input__wrapper) {
  border-radius: 10px 0 0 10px;
  background: rgba(255, 255, 255, 0.95);
}

.hero-search-input :deep(.el-input-group__append) {
  border-radius: 0 10px 10px 0;
}

.hero-search-input :deep(.el-input-group__append .el-button) {
  border-radius: 0 10px 10px 0;
}

.category-grid {
  margin-bottom: 32px;
}

.category-card {
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
}

.category-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.category-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 4px;
}

.category-info p {
  font-size: 13px;
  color: #64748B;
}

.section-block {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #3B82F6;
  cursor: pointer;
}

.info-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.compact-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.compact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.compact-img {
  width: 100%;
  height: 130px;
  object-fit: cover;
}

.compact-body {
  padding: 10px 12px 12px;
}

.compact-tag {
  margin-bottom: 4px;
}

.compact-title {
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
}

.compact-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #94A3B8;
  margin-top: 6px;
}

.card-body {
  padding: 14px;
}

.card-tags {
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
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.price {
  font-size: 14px;
  font-weight: 700;
  color: #EF4444;
}
</style>
