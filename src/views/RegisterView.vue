<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { RegisterParams } from '@/types/user'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElCard, ElMessage, ElDivider } from 'element-plus'
import { User, Lock, Phone, School, OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  campus: '',
  college: '',
})

const loading = ref(false)

const campusOptions = ['主校区', '东校区', '西校区', '南校区', '北校区']
const collegeOptions = [
  '计算机科学与技术学院',
  '电子信息工程学院',
  '数学与统计学院',
  '外国语学院',
  '经济管理学院',
  '人文学院',
  '艺术与设计学院',
  '材料科学与工程学院',
  '机械工程学院',
  '土木工程学院',
]

function handleRegister() {
  if (!form.nickname.trim() || !form.phone.trim() || !form.password.trim()) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.error('两次密码输入不一致')
    return
  }
  if (!form.campus) {
    ElMessage.warning('请选择校区')
    return
  }
  if (!form.college) {
    ElMessage.warning('请选择学院')
    return
  }
  loading.value = true
  try {
    const params: RegisterParams = {
      nickname: form.nickname,
      phone: form.phone,
      password: form.password,
      campus: form.campus,
      college: form.college,
    }
    userStore.register(params)
    ElMessage.success('注册成功')
    router.push('/')
  } catch {
    ElMessage.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-decoration">
        <div class="decoration-content">
          <ElIcon :size="64" color="#fff"><School /></ElIcon>
          <h1 class="decoration-title">加入校园轻集市</h1>
          <p class="decoration-desc">开启你的校园交易之旅</p>
        </div>
      </div>
      <ElCard class="register-card" :body-style="{ padding: '40px' }">
        <h2 class="register-title">创建账号</h2>
        <p class="register-subtitle">填写信息完成注册</p>
        <ElForm :model="form" label-width="0" class="register-form" @keyup.enter="handleRegister">
          <ElFormItem>
            <ElInput
              v-model="form.nickname"
              placeholder="昵称"
              size="large"
              :prefix-icon="User"
            />
          </ElFormItem>
          <ElFormItem>
            <ElInput
              v-model="form.phone"
              placeholder="手机号"
              size="large"
              :prefix-icon="Phone"
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
            <ElInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </ElFormItem>
          <ElFormItem>
            <ElSelect v-model="form.campus" placeholder="选择校区" size="large" :prefix-icon="School">
              <ElOption v-for="c in campusOptions" :key="c" :label="c" :value="c" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElSelect v-model="form.college" placeholder="选择学院" size="large" :prefix-icon="OfficeBuilding">
              <ElOption v-for="c in collegeOptions" :key="c" :label="c" :value="c" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElButton
              type="primary"
              size="large"
              :loading="loading"
              class="register-btn"
              @click="handleRegister"
            >
              注册
            </ElButton>
          </ElFormItem>
        </ElForm>
        <ElDivider>
          <span style="color: #94A3B8; font-size: 13px;">已有账号？</span>
        </ElDivider>
        <div class="login-link">
          <ElButton text type="primary" size="large" @click="router.push('/login')">
            返回登录
          </ElButton>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}

.register-container {
  display: flex;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 100%;
}

.register-decoration {
  flex: 1;
  background: linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  min-height: 500px;
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

.register-card {
  width: 420px;
  border-radius: 0;
  border: none;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.register-subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 28px;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.register-form :deep(.el-select) {
  width: 100%;
}

.register-btn {
  width: 100%;
  border-radius: 8px;
  height: 44px;
  font-size: 15px;
}

.login-link {
  text-align: center;
}
</style>
