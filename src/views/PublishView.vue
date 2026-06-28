<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElRow, ElCol, ElCard, ElIcon } from 'element-plus'
import { Goods, WarningFilled, Connection, Position } from '@element-plus/icons-vue'

const router = useRouter()

const publishTypes = [
  { icon: Goods, title: '二手交易', desc: '闲置好物，低价转让', path: '/publish/item', color: '#3B82F6' },
  { icon: WarningFilled, title: '失物招领', desc: '丢失拾到，爱心接力', path: '/publish/lost', color: '#F59E0B' },
  { icon: Connection, title: '拼单搭子', desc: '组团拼单，省钱省心', path: '/publish/group', color: '#10B981' },
  { icon: Position, title: '跑腿委托', desc: '忙不过来，我来帮您', path: '/publish/task', color: '#8B5CF6' },
]

function goPublish(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="publish-page">
    <h1 class="page-title">发布信息</h1>
    <p class="page-desc">选择您要发布的类型</p>
    <ElRow :gutter="24">
      <ElCol v-for="item in publishTypes" :key="item.title" :span="12" class="col-card">
        <ElCard class="publish-card" shadow="hover" @click="goPublish(item.path)">
          <div class="card-content">
            <div class="icon-wrap" :style="{ background: item.color + '15', color: item.color }">
              <ElIcon :size="32">
                <component :is="item.icon" />
              </ElIcon>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
.publish-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  text-align: center;
  margin-bottom: 8px;
}

.page-desc {
  font-size: 15px;
  color: #64748B;
  text-align: center;
  margin-bottom: 32px;
}

.col-card {
  margin-bottom: 20px;
}

.publish-card {
  cursor: pointer;
  border-radius: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.publish-card:hover {
  transform: translateY(-4px);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  text-align: center;
}

.icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 14px;
  color: #64748B;
}
</style>
