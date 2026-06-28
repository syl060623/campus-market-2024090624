<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElForm, ElFormItem, ElInput, ElButton, ElCard, ElMessage, ElDivider } from 'element-plus'
import { User, Lock, School } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  phone: '',
  password: '',
})

const loading = ref(false)

function handleLogin() {
  if (!form.phone.trim() || !form.password.trim()) {
    ElMessage.warning('请填写手机号和密码')
    return
  }
  loading.value = true
  try {
    userStore.login({ phone: form.phone, password: form.password })
    ElMessage.success('登录成功')
    router.push('/')
  } catch {
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-decoration">
        <div class="decoration-content">
          <ElIcon :size="64" color="#fff"><School /></ElIcon>
          <h1 class="decoration-title">校园轻集市</h1>
          <p class="decoration-desc">二手交易 · 失物招领 · 拼单搭子 · 跑腿委托</p>
        </div>
      </div>
      <ElCard class="login-card" :body-style="{ padding: '40px' }">
        <h2 class="login-title">欢迎回来</h2>
        <p class="login-subtitle">登录你的账号</p>
        <ElForm :model="form" label-width="0" class="login-form" @keyup.enter="handleLogin">
          <ElFormItem>
            <ElInput
              v-model="form.phone"
              placeholder="手机号"
              size="large"
              :prefix-icon="User"
            />
          </ElFormItem>
          <ElFormItem>
            <ElInput
              v-model="form.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton
              type="primary"
              size="large"
              :loading="loading"
              class="login-btn"
              @click="handleLogin"
            >
              登录
            </ElButton>
          </ElFormItem>
        </ElForm>
        <ElDivider>
          <span style="color: #94A3B8; font-size: 13px;">还没有账号？</span>
        </ElDivider>
        <div class="register-link">
          <ElButton text type="primary" size="large" @click="router.push('/register')">
            立即注册
          </ElButton>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  display: flex;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 100%;
}

.login-decoration {
  flex: 1;
  background: linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  min-height: 400px;
}

.decoration-content {
  text-align: center;
  color: #fff;
}

.decoration-title {
  font-size: 28px;
  font-weight: 800;
  margin-top: 16px;
  margin-bottom: 8px;
}

.decoration-desc {
  font-size: 14px;
  opacity: 0.85;
}

.login-card {
  width: 380px;
  border-radius: 0;
  border: none;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.login-subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 28px;
}

.login-form {
  max-width: 100%;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.login-btn {
  width: 100%;
  border-radius: 8px;
  height: 44px;
  font-size: 15px;
}

.register-link {
  text-align: center;
}
</style>
