<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElTag, ElButton, ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus'
import { Edit, Delete, Check, Plus } from '@element-plus/icons-vue'
import { useItemStore } from '@/stores/item'
import { statusLabel, statusTagType } from '@/utils/format'

const router = useRouter()

interface Post {
  id: number
  title: string
  type: string
  status: string
  statusType: string
  price?: number
  reward?: number
  createdAt: string
}

const itemStore = useItemStore()

const posts = computed<Post[]>(() =>
  itemStore.myPublishedPosts.map(p => ({
    ...p,
    status: statusLabel(p.status),
    statusType: statusTagType(p.status),
    createdAt: p.time,
  }))
)

const typeColors: Record<string, string> = {
  '二手交易': 'primary',
  '拼单搭子': 'warning',
  '跑腿委托': 'success',
  '失物招领': 'danger',
  '二手': 'primary',
  '拼单': 'warning',
  '跑腿': 'success',
  '失物': 'danger',
}

const editDialogVisible = ref(false)
const editingPost = reactive<Post>({
  id: 0, title: '', type: '二手交易', status: '已发布', statusType: 'success', createdAt: ''
})
const editingIndex = ref(-1)

function handleEdit(post: Post, index: number) {
  Object.assign(editingPost, post)
  editingIndex.value = index
  editDialogVisible.value = true
}

function saveEdit() {
  if (editingIndex.value >= 0) {
    posts.value[editingIndex.value] = { ...editingPost }
  }
  editDialogVisible.value = false
  ElMessage.success('修改成功')
}

function handleDelete(index: number) {
  posts.value.splice(index, 1)
  ElMessage.success('删除成功')
}

function markComplete(index: number) {
  posts.value[index].status = '已完成'
  posts.value[index].statusType = 'success'
  ElMessage.success('已标记为完成')
}

function formatPrice(row: Post) {
  if (row.price !== undefined) return '¥' + row.price
  if (row.reward !== undefined) return '¥' + row.reward
  return '-'
}
</script>

<template>
  <div class="myposts-view">
    <div class="page-header">
      <h2>我的发布</h2>
      <ElButton type="primary" :icon="Plus" @click="router.push('/publish')">发布新商品</ElButton>
    </div>

    <ElTable :data="posts" stripe style="width: 100%" row-key="id">
      <ElTableColumn prop="title" label="标题" min-width="260" />
      <ElTableColumn label="类型" width="80">
        <template #default="{ row }">
          <ElTag :type="typeColors[row.type] || ''" size="small">{{ row.type }}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="价格/酬劳" width="100">
        <template #default="{ row }">
          {{ formatPrice(row) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" width="90">
        <template #default="{ row }">
          <ElTag :type="row.statusType" size="small">{{ row.status }}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="createdAt" label="发布时间" width="110" />
      <ElTableColumn label="操作" width="240">
        <template #default="{ row, $index }">
          <ElButton size="small" text type="primary" :icon="Edit" @click="handleEdit(row, $index)">编辑</ElButton>
          <ElButton size="small" text type="danger" :icon="Delete" @click="handleDelete($index)">删除</ElButton>
          <ElButton v-if="row.status !== '已完成'" size="small" text type="success" :icon="Check" @click="markComplete($index)">完成</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDialog v-model="editDialogVisible" title="编辑发布" width="500px">
      <ElForm :model="editingPost" label-width="80px">
        <ElFormItem label="标题">
          <ElInput v-model="editingPost.title" />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect v-model="editingPost.type" style="width: 100%">
            <ElOption label="二手" value="二手" />
            <ElOption label="拼单" value="拼单" />
            <ElOption label="跑腿" value="跑腿" />
            <ElOption label="失物" value="失物" />
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
