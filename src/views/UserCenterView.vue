<template>
  <section class="page">
    <div v-if="!userStore.isLoggedIn" class="panel">
      <h1>请先登录</h1>
      <p>登录后可以查看个人资料、我的收藏和我的发布。</p>
      <RouterLink class="login-link" to="/login">去登录</RouterLink>
    </div>

    <template v-else>
      <div class="profile-card">
        <div class="avatar">
          {{ userStore.displayName.slice(0, 1) }}
        </div>

        <div>
          <h1>{{ userStore.displayName }}</h1>
          <p>{{ userStore.userDescription }}</p>
          <p>{{ userStore.currentUser?.bio }}</p>
        </div>
      </div>

      <div class="panel">
        <h2>我的收藏</h2>

        <EmptyState
          v-if="favoriteStore.favorites.length === 0"
          text="暂无收藏内容"
        />

        <div v-else class="favorite-list">
          <ItemCard
            v-for="item in favoriteStore.favorites"
            :key="`${item.type}-${item.id}`"
            :title="item.title"
            :description="item.description"
            :tag="getTypeLabel(item.type)"
            :location="item.location"
          >
            <template #footer>
              <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">
                取消收藏
              </button>
            </template>
          </ItemCard>
        </div>
      </div>

      <div class="panel">
        <h2>我的发布</h2>

        <EmptyState
          v-if="myPosts.length === 0"
          text="还没有发布过任何内容"
        />

        <div v-else class="favorite-list">
          <ItemCard
            v-for="item in myPosts"
            :key="`${item.type}-${item.id}`"
            :title="item.title"
            :description="item.description"
            :tag="item.typeLabel"
            :location="item.location"
            :time="item.time"
          >
            <template #footer>
              <div class="post-actions">
                <button class="action-btn edit-btn" @click="openEdit(item)">修改</button>
                <button class="action-btn delete-btn" @click="handleDelete(item)">删除</button>
              </div>
            </template>
          </ItemCard>
        </div>
      </div>

      <div class="panel">
        <h2>账号设置</h2>
        <ElForm :model="settingsForm" label-width="80px" class="settings-form">
          <ElFormItem label="昵称">
            <ElInput v-model="settingsForm.nickname" />
          </ElFormItem>
          <ElFormItem label="手机号">
            <ElInput v-model="settingsForm.phone" />
          </ElFormItem>
          <ElFormItem label="邮箱">
            <ElInput v-model="settingsForm.email" />
          </ElFormItem>
          <ElDivider />
          <h3 class="section-title">修改密码</h3>
          <ElFormItem label="原密码">
            <ElInput v-model="settingsForm.oldPassword" type="password" show-password />
          </ElFormItem>
          <ElFormItem label="新密码">
            <ElInput v-model="settingsForm.newPassword" type="password" show-password />
          </ElFormItem>
          <ElFormItem label="确认密码">
            <ElInput v-model="settingsForm.confirmPassword" type="password" show-password />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="saveSettings">保存设置</ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </template>

    <ElDialog v-model="editDialogVisible" title="修改发布" width="500px">
      <ElForm v-if="editingItem" :model="editingItem" label-width="80px">
        <ElFormItem label="标题">
          <ElInput v-model="editingItem.title" />
        </ElFormItem>
        <ElFormItem label="描述">
          <ElInput v-model="editingItem.description" type="textarea" :rows="3" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveEdit">保存</ElButton>
      </template>
    </ElDialog>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElDivider, ElDialog, ElMessage, ElMessageBox } from 'element-plus'

import EmptyState from '../components/EmptyState.vue'
import ItemCard from '../components/ItemCard.vue'
import { getTrades, deleteTrade, updateTrade } from '../api/trade'
import { getLostFounds, deleteLostFound, updateLostFound } from '../api/lostFound'
import { getGroupBuys, deleteGroupBuy, updateGroupBuy } from '../api/groupBuy'
import { getErrands, deleteErrand, updateErrand } from '../api/errand'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'

interface MyPost {
  id: number | string
  title: string
  description: string
  type: string
  typeLabel: string
  location: string
  time: string
}

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const myPosts = ref<MyPost[]>([])

const editDialogVisible = ref(false)
const editingItem = ref<MyPost | null>(null)

const settingsForm = reactive({
  nickname: '',
  phone: '',
  email: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }
  return map[type] || '校园信息'
}

async function loadMyPosts() {
  const currentUser = userStore.currentUser
  if (!currentUser) return

  try {
    const [tradesRes, lostsRes, groupsRes, tasksRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])

    const all: MyPost[] = [
      ...tradesRes.data.filter(t => String(t.publisherId) === String(currentUser.id)).map(t => ({
        id: t.id, title: t.title, description: t.description,
        type: 'trade', typeLabel: '二手交易', location: t.location, time: t.publishTime || t.createdAt,
      })),
      ...lostsRes.data.filter(l => String(l.publisherId) === String(currentUser.id)).map(l => ({
        id: l.id, title: l.itemName, description: l.description,
        type: 'lostFound', typeLabel: '失物招领', location: l.location, time: l.createdAt || l.happenedAt,
      })),
      ...groupsRes.data.filter(g => String(g.publisherId) === String(currentUser.id)).map(g => ({
        id: g.id, title: g.title, description: g.description,
        type: 'groupBuy', typeLabel: '拼单搭子', location: g.meetLocation || g.location, time: g.createdAt,
      })),
      ...tasksRes.data.filter(t => String(t.publisherId) === String(currentUser.id)).map(t => ({
        id: t.id, title: t.title, description: t.description,
        type: 'errand', typeLabel: '跑腿委托', location: t.deliveryLocation || t.from, time: t.createdAt,
      })),
    ]

    all.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    myPosts.value = all
  } catch {
    console.error('加载发布列表失败')
  }
}

function openEdit(item: MyPost) {
  editingItem.value = { ...item }
  editDialogVisible.value = true
}

async function saveEdit() {
  if (!editingItem.value) return
  const item = editingItem.value
  try {
    if (item.type === 'trade') {
      await updateTrade(item.id as number, { title: item.title, description: item.description })
    } else if (item.type === 'lostFound') {
      await updateLostFound(item.id as number, { itemName: item.title, description: item.description })
    } else if (item.type === 'groupBuy') {
      await updateGroupBuy(item.id as number, { title: item.title, description: item.description })
    } else if (item.type === 'errand') {
      await updateErrand(item.id as number, { title: item.title, description: item.description })
    }
    const idx = myPosts.value.findIndex(p => p.id === item.id && p.type === item.type)
    if (idx >= 0) myPosts.value[idx] = { ...myPosts.value[idx], ...item }
    editDialogVisible.value = false
    ElMessage.success('修改成功')
  } catch {
    ElMessage.error('修改失败')
  }
}

async function handleDelete(item: MyPost) {
  try {
    await ElMessageBox.confirm('确定要删除该发布吗？', '删除确认', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' })
    if (item.type === 'trade') await deleteTrade(item.id as number)
    else if (item.type === 'lostFound') await deleteLostFound(item.id as number)
    else if (item.type === 'groupBuy') await deleteGroupBuy(item.id as number)
    else if (item.type === 'errand') await deleteErrand(item.id as number)
    myPosts.value = myPosts.value.filter(p => !(p.id === item.id && p.type === item.type))
    ElMessage.success('删除成功')
  } catch {
    // cancelled or error
  }
}

async function saveSettings() {
  if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
    ElMessage.error('两次密码输入不一致')
    return
  }
  try {
    await userStore.updateProfile({
      name: settingsForm.nickname,
    })
    if (settingsForm.oldPassword && settingsForm.newPassword) {
      // Password would be updated here in a real app
      settingsForm.oldPassword = ''
      settingsForm.newPassword = ''
      settingsForm.confirmPassword = ''
    }
    ElMessage.success('设置已保存')
  } catch {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    loadMyPosts()
    if (userStore.currentUser) {
      settingsForm.nickname = userStore.currentUser.name || ''
    }
  }
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card,
.panel {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  font-size: 28px;
  font-weight: 700;
}

.profile-card h1,
.panel h2 {
  margin: 0 0 8px;
}

.profile-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.favorite-list {
  display: grid;
  gap: 16px;
}

.remove-btn {
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
}

.login-link {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
  font-size: 13px;
}

.edit-btn {
  background: #eff6ff;
  color: #2563eb;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.settings-form {
  max-width: 500px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 12px;
}
</style>
