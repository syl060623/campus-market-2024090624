<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElAvatar, ElTabs, ElTabPane, ElTag, ElButton, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElUpload, ElRow, ElCol, ElDivider, ElMessage, ElDialog, ElEmpty } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { useItemStore } from '@/stores/item'
import { statusLabel, statusTagType } from '@/utils/format'

interface PostItem {
  id: number
  title: string
  type: string
  status: string
  time: string
  price?: number
  currentCount?: number
  targetCount?: number
  reward?: number
}

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const itemStore = useItemStore()

const activeTab = ref('posts')

const myPosts = computed<PostItem[]>(() => itemStore.myPublishedPosts as PostItem[])

const allItems = computed(() => itemStore.allItemsForFavorites)

const favoriteItems = computed(() => allItems.value.filter(item => favoriteStore.isFavorite('trade', item.id)))

function deletePost(id: number) {
  const idx = itemStore.myPublishedPosts.findIndex((p: any) => p.id === id)
  if (idx !== -1) itemStore.myPublishedPosts.splice(idx, 1)
  ElMessage.success('已删除')
}

function completePost(id: number) {
  const post = itemStore.myPublishedPosts.find((p: any) => p.id === id)
  if (post) post.status = 'completed'
  ElMessage.success('已标记完成')
}

const editDialogVisible = ref(false)
const editingPost = ref<PostItem | null>(null)

function openEdit(post: PostItem) {
  editingPost.value = { ...post }
  editDialogVisible.value = true
}

function saveEdit() {
  const idx = myPosts.value.findIndex(p => p.id === editingPost.value!.id)
  if (idx > -1) myPosts.value[idx] = { ...editingPost.value! }
  editDialogVisible.value = false
  ElMessage.success('已更新')
}

const settingsForm = ref({
  nickname: userStore.currentUser?.name || '',
  phone: '',
  email: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function saveSettings() {
  ElMessage.success('设置已保存')
}
</script>

<template>
  <div class="profile-view">
    <div class="profile-sidebar">
      <ElCard :body-style="{ padding: '28px' }">
        <div class="user-info">
          <ElAvatar :size="80" :src="userStore.currentUser?.avatar || ''" class="user-avatar" />
          <h2 class="user-name">{{ userStore.displayName }}</h2>
          <p class="user-campus">{{ userStore.userDescription }}</p>
          <div class="user-bio">
            <p>{{ userStore.currentUser?.bio }}</p>
          </div>
        </div>
        <ElDivider />
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">8</span>
            <span class="stat-label">发布</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ favoriteStore.favoriteCount }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">100</span>
            <span class="stat-label">信用</span>
          </div>
        </div>
        <ElDivider />
        <div class="recent-activity">
          <h4>最近动态</h4>
          <ul>
            <li>发布了二手教材《软件工程导论》</li>
            <li>收藏了「富士拍立得相机」</li>
            <li>完成了跑腿任务「代购烧鸭饭」</li>
            <li>加入了拼单「东区食堂奶茶」</li>
          </ul>
        </div>
      </ElCard>
    </div>

    <div class="profile-main">
      <ElTabs v-model="activeTab" class="profile-tabs">
        <ElTabPane label="我的发布" name="posts">
          <ElTable :data="myPosts" stripe style="width: 100%">
            <ElTableColumn prop="title" label="标题" min-width="240" />
            <ElTableColumn prop="type" label="类型" width="100">
              <template #default="{ row }">
                <ElTag size="small">{{ row.type }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="time" label="时间" width="120" />
            <ElTableColumn label="状态" width="100">
              <template #default="{ row }">
                <ElTag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="200">
              <template #default="{ row }">
                <ElButton size="small" :icon="Edit" @click="openEdit(row as PostItem)">编辑</ElButton>
                <ElButton size="small" :icon="Delete" type="danger" @click="deletePost(row.id)">删除</ElButton>
                <ElButton v-if="row.status === 'active'" size="small" type="success" @click="completePost(row.id)">完成</ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElTabPane>

        <ElTabPane label="我的收藏" name="favorites">
          <ElRow v-if="favoriteItems.length > 0" :gutter="16">
            <ElCol v-for="item in favoriteItems" :key="item.id" :span="8">
              <ElCard :body-style="{ padding: 0 }" shadow="hover" class="fav-card">
                <img :src="item.image" :alt="item.title" class="fav-img" />
                <div class="fav-body">
                  <h4>{{ item.title }}</h4>
                  <div class="fav-meta">
                    <span v-if="item.price" class="price">¥{{ item.price }}</span>
                    <span v-if="item.reward" class="price">¥{{ item.reward }}</span>
                    <ElTag size="small">{{ item.type }}</ElTag>
                  </div>
                  <ElButton size="small" text type="primary" @click="favoriteStore.toggleFavorite({ id: item.id, type: 'trade', title: item.title, description: item.description, location: item.location })">
                    取消收藏
                  </ElButton>
                </div>
              </ElCard>
            </ElCol>
          </ElRow>
          <ElEmpty v-else description="还没有收藏" />
        </ElTabPane>

        <ElTabPane label="账号设置" name="settings">
          <ElCard>
            <ElForm :model="settingsForm" label-width="100" class="settings-form">
              <ElFormItem label="昵称">
                <ElInput v-model="settingsForm.nickname" />
              </ElFormItem>
              <ElFormItem label="手机号">
                <ElInput v-model="settingsForm.phone" />
              </ElFormItem>
              <ElFormItem label="邮箱">
                <ElInput v-model="settingsForm.email" />
              </ElFormItem>
              <ElFormItem label="头像">
                <ElUpload action="#" list-type="picture-card" :auto-upload="false">
                  <ElAvatar :size="80" :src="userStore.currentUser?.avatar || ''" />
                </ElUpload>
              </ElFormItem>
              <ElDivider />
              <h4 class="section-title">修改密码</h4>
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
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>

    <ElDialog v-model="editDialogVisible" title="编辑发布" width="500px">
      <ElForm v-if="editingPost" :model="editingPost" label-width="80">
        <ElFormItem label="标题">
          <ElInput v-model="editingPost.title" />
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
.profile-view {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
}

.profile-main {
  flex: 1;
  min-width: 0;
}

.user-info {
  text-align: center;
}

.user-avatar {
  margin: 0 auto 12px;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.user-campus {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 8px;
}

.user-bio {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.user-bio p {
  margin: 0;
}

.user-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
}

.stat-label {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 2px;
}

.recent-activity h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1E293B;
}

.recent-activity ul {
  list-style: none;
  padding: 0;
}

.recent-activity li {
  font-size: 13px;
  color: #64748B;
  padding: 4px 0;
  position: relative;
  padding-left: 12px;
}

.recent-activity li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 4px;
  height: 4px;
  background: #3B82F6;
  border-radius: 50%;
}

.profile-tabs :deep(.el-tabs__header) {
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 0 20px;
  margin-bottom: 0;
}

.profile-tabs :deep(.el-tabs__content) {
  background: #fff;
  border-radius: 0 0 12px 12px;
  padding: 20px;
}

.settings-form {
  max-width: 500px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1E293B;
}

.fav-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.fav-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.fav-body {
  padding: 12px;
}

.fav-body h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1E293B;
}

.fav-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
