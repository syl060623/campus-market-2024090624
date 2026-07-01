<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElForm, ElFormItem, ElInput, ElUpload, ElButton, ElMessage, ElCard, ElDivider, ElAvatar } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const userStore = useUserStore()

const form = reactive({
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  const u = userStore.currentUser
  form.nickname = u.name
  form.avatar = u.avatar
})

function handleAvatarSuccess(res: { url?: string; data?: { url?: string } }) {
  form.avatar = res.url || res.data?.url || form.avatar
  ElMessage.success('头像上传成功')
}

function saveSettings() {
  if (form.newPassword && form.newPassword !== form.confirmPassword) {
    ElMessage.error('两次密码输入不一致')
    return
  }
  userStore.updateProfile({
    nickname: form.nickname,
    phone: form.phone,
    email: form.email,
    avatar: form.avatar,
  })
  if (form.oldPassword && form.newPassword) {
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  }
  ElMessage.success('设置已保存')
}
</script>

<template>
  <div class="settings-view">
    <div class="page-header">
      <h2>账号设置</h2>
    </div>

    <ElRow :gutter="20">
      <ElCol :span="16">
        <ElCard class="settings-card">
          <h3 class="section-title">个人信息</h3>
          <ElDivider />
          <ElForm :model="form" label-width="120px" class="settings-form">
            <ElFormItem label="昵称">
              <ElInput v-model="form.nickname" placeholder="请输入昵称" maxlength="20" show-word-limit />
            </ElFormItem>
            <ElFormItem label="手机号">
              <ElInput v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
            </ElFormItem>
            <ElFormItem label="邮箱">
              <ElInput v-model="form.email" placeholder="请输入邮箱" />
            </ElFormItem>
            <ElFormItem label="头像">
              <div class="avatar-upload-wrapper">
                <ElAvatar :size="72" :src="form.avatar" shape="square" />
                <ElUpload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :auto-upload="false"
                >
                  <ElButton type="primary" :icon="Upload" style="margin-left: 16px;">上传头像</ElButton>
                </ElUpload>
              </div>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <ElCard class="settings-card" style="margin-top: 20px;">
          <h3 class="section-title">密码修改</h3>
          <ElDivider />
          <ElForm :model="form" label-width="120px" class="settings-form">
            <ElFormItem label="旧密码">
              <ElInput v-model="form.oldPassword" type="password" placeholder="输入旧密码" show-password />
            </ElFormItem>
            <ElFormItem label="新密码">
              <ElInput v-model="form.newPassword" type="password" placeholder="输入新密码" show-password />
            </ElFormItem>
            <ElFormItem label="确认密码">
              <ElInput v-model="form.confirmPassword" type="password" placeholder="再次输入新密码" show-password />
            </ElFormItem>
          </ElForm>
        </ElCard>

        <div class="save-bar">
          <ElButton type="primary" size="large" @click="saveSettings">保存设置</ElButton>
        </div>
      </ElCol>

      <ElCol :span="8">
        <ElCard class="info-card">
          <div class="info-header">
            <ElAvatar :size="56" :src="form.avatar" />
            <div class="info-user">
              <span class="info-name">{{ form.nickname || '未设置' }}</span>
              <span class="info-campus">{{ userStore.currentUser.college }}</span>
            </div>
          </div>
          <ElDivider />
          <div class="info-stats">
            <div class="info-row">
              <span class="info-label">学院</span>
              <span class="info-value">{{ userStore.currentUser.college }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">年级</span>
              <span class="info-value">{{ userStore.currentUser.grade }}</span>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
}

.settings-card {
  border-radius: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.settings-form {
  max-width: 500px;
}

.avatar-upload-wrapper {
  display: flex;
  align-items: center;
}

.save-bar {
  margin-top: 20px;
  text-align: center;
}

.info-card {
  border-radius: 12px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-user {
  display: flex;
  flex-direction: column;
}

.info-name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.info-campus {
  font-size: 12px;
  color: #94A3B8;
}

.info-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 13px;
  color: #64748B;
}

.info-value {
  font-size: 13px;
  color: #1E293B;
  font-weight: 500;
}
</style>
