<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElTag, ElButton, ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElEmpty } from 'element-plus'
import { Edit, Delete, Check, Plus } from '@element-plus/icons-vue'
import { getTrades, deleteTrade } from '@/api/trade'
import { getLostFounds, deleteLostFound } from '@/api/lostFound'
import { getGroupBuys, deleteGroupBuy } from '@/api/groupBuy'
import { getErrands, deleteErrand } from '@/api/errand'
import { useUserStore } from '@/stores/user'
import { statusLabel, statusTagType } from '@/utils/format'

const router = useRouter()
const userStore = useUserStore()

interface PostItem {
  id: number
  title: string
  apiType: 'trade' | 'lost' | 'group' | 'task'
  typeLabel: string
  status: string
  rawStatus: string
  price?: number
  reward?: number
  createdAt: string
}

const items = ref<PostItem[]>([])
const loading = ref(false)

const typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
  trade: 'primary',
  lost: 'danger',
  group: 'warning',
  task: 'success',
}

async function fetchData() {
  loading.value = true
  try {
    const [tradesRes, lostsRes, groupsRes, tasksRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])

    const all: PostItem[] = [
      ...tradesRes.data.filter(t => t.publisherId === userStore.currentUser.id).map(t => ({
        id: t.id, title: t.title, apiType: 'trade' as const, typeLabel: '二手交易',
        status: statusLabel(t.status), rawStatus: t.status, price: t.price, createdAt: t.createdAt,
      })),
      ...lostsRes.data.filter(l => l.publisherId === userStore.currentUser.id).map(l => ({
        id: l.id, title: l.itemName, apiType: 'lost' as const, typeLabel: '失物招领',
        status: statusLabel(l.status), rawStatus: l.status, createdAt: l.createdAt,
      })),
      ...groupsRes.data.filter(g => g.publisherId === userStore.currentUser.id).map(g => ({
        id: g.id, title: g.title, apiType: 'group' as const, typeLabel: '拼单搭子',
        status: statusLabel(g.status), rawStatus: g.status, createdAt: g.createdAt,
      })),
      ...tasksRes.data.filter(t => t.publisherId === userStore.currentUser.id).map(t => ({
        id: t.id, title: t.title, apiType: 'task' as const, typeLabel: '跑腿委托',
        status: statusLabel(t.status), rawStatus: t.status, reward: t.reward, createdAt: t.createdAt,
      })),
    ]

    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    items.value = all
  } catch {
    ElMessage.error('加载发布列表失败')
  } finally {
    loading.value = false
  }
}

async function handleDelete(row: any) {
  const item = row as PostItem
  try {
    if (item.apiType === 'trade') await deleteTrade(item.id)
    else if (item.apiType === 'lost') await deleteLostFound(item.id)
    else if (item.apiType === 'group') await deleteGroupBuy(item.id)
    else if (item.apiType === 'task') await deleteErrand(item.id)

    items.value = items.value.filter(i => !(i.apiType === item.apiType && i.id === item.id))
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

function formatPrice(row: any) {
  const item = row as PostItem
  if (item.price !== undefined) return '¥' + item.price
  if (item.reward !== undefined) return '¥' + item.reward
  return '-'
}

const editDialogVisible = ref(false)
const editingItem = ref<PostItem | null>(null)

function handleEdit(row: any) {
  editingItem.value = { ...(row as PostItem) }
  editDialogVisible.value = true
}

function saveEdit() {
  if (!editingItem.value) return
  const idx = items.value.findIndex(i => i.apiType === editingItem.value!.apiType && i.id === editingItem.value!.id)
  if (idx >= 0 && items.value[idx]) {
    items.value[idx]!.title = editingItem.value.title
  }
  editDialogVisible.value = false
  ElMessage.success('修改成功')
}

onMounted(fetchData)
</script>

<template>
  <div class="myposts-view">
    <div class="page-header">
      <h2>我的发布</h2>
      <ElButton type="primary" :icon="Plus" @click="router.push('/publish')">发布新商品</ElButton>
    </div>

    <ElTable v-loading="loading" :data="items" stripe style="width: 100%" row-key="id">
      <ElTableColumn prop="title" label="标题" min-width="260" />
      <ElTableColumn label="类型" width="100">
        <template #default="scope">
          <ElTag :type="typeColors[scope.row.apiType]" size="small">{{ scope.row.typeLabel }}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="价格/酬劳" width="100">
        <template #default="scope">
          {{ formatPrice(scope.row) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" width="90">
        <template #default="scope">
          <ElTag :type="statusTagType(scope.row.rawStatus)" size="small">{{ scope.row.status }}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="createdAt" label="发布时间" width="170" />
      <ElTableColumn label="操作" width="240">
        <template #default="scope">
          <ElButton size="small" text type="primary" :icon="Edit" @click="handleEdit(scope.row)">编辑</ElButton>
          <ElButton size="small" text type="danger" :icon="Delete" @click="handleDelete(scope.row)">删除</ElButton>
          <ElButton v-if="scope.row.status !== '已完成'" size="small" text type="success" :icon="Check">完成</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElEmpty v-if="!loading && items.length === 0" description="还没有发布过任何内容" />

    <ElDialog v-model="editDialogVisible" title="编辑发布" width="500px">
      <ElForm v-if="editingItem" :model="editingItem" label-width="80px">
        <ElFormItem label="标题">
          <ElInput v-model="editingItem.title" />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect v-model="editingItem.apiType" style="width: 100%" disabled>
            <ElOption label="二手交易" value="trade" />
            <ElOption label="失物招领" value="lost" />
            <ElOption label="拼单搭子" value="group" />
            <ElOption label="跑腿委托" value="task" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveEdit">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.myposts-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
}
</style>
