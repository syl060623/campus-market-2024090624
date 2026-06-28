<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElSteps, ElStep, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElDatePicker, ElUpload, ElButton, ElMessage, ElCheckbox, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { TASK_TYPES } from '@/utils/constants'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useItemStore } from '@/stores/item'
import { useUserStore } from '@/stores/user'
import type { ErrandTask } from '@/types/task'

const router = useRouter()
const itemStore = useItemStore()
const userStore = useUserStore()

const activeStep = ref(0)
const form = ref({
  content: '',
  type: '',
  reward: null as number | null,
  deliveryPlace: '',
  deadline: null as Date | null,
  contact: '',
  images: [] as UploadUserFile[],
  agreed: false,
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const taskTypes = [...TASK_TYPES]

const handleRemove: UploadProps['onRemove'] = () => {
  ElMessage.info('已移除图片')
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  ElMessage.info('预览: ' + file.name)
}

function nextStep() {
  if (activeStep.value === 0) {
    formRef.value?.validate((valid) => {
      if (!valid) return
      activeStep.value = 1
    })
    return
  }
  if (activeStep.value === 1) {
    if (!form.value.agreed) {
      ElMessage.warning('请先阅读并同意发布须知')
      return
    }
    activeStep.value = 2
    return
  }
}

function prevStep() {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

function submitForm() {
  const newItem: ErrandTask = {
    id: Date.now(),
    title: form.value.content,
    type: form.value.type as ErrandTask['type'],
    content: form.value.content,
    reward: form.value.reward || 0,
    images: form.value.images.map(f => URL.createObjectURL(f.raw!)),
    deliveryLocation: form.value.deliveryPlace,
    expectedTime: form.value.deadline?.toISOString() || new Date().toISOString(),
    contact: form.value.contact,
    publisherId: userStore.user.id,
    publisherName: userStore.user.nickname,
    publisherAvatar: userStore.user.avatar,
    createdAt: new Date().toISOString(),
    status: '待接单'
  }
  itemStore.addErrandTask(newItem)
  ElMessage.success('发布成功')
  router.push('/')
}

function saveDraft() {
  ElMessage.info('已保存草稿')
}
</script>

<template>
  <div class="publish-form-page">
    <h1 class="page-title">发布跑腿委托</h1>

    <ElSteps :active="activeStep" class="form-steps" finish-status="success">
      <ElStep title="填写信息" />
      <ElStep title="确认发布" />
      <ElStep title="发布成功" />
    </ElSteps>

    <div class="form-wrapper">
      <template v-if="activeStep === 0">
        <ElForm ref="formRef" :model="form" label-width="110px" class="publish-form">
          <ElFormItem label="任务内容" prop="content" :rules="[{ required: true, message: '请输入任务内容' }]">
            <ElInput v-model="form.content" placeholder="请输入任务内容" />
          </ElFormItem>

          <ElFormItem label="类型" prop="type" :rules="[{ required: true, message: '请选择类型' }]">
            <ElSelect v-model="form.type" placeholder="请选择类型" class="full-width">
              <ElOption v-for="t in taskTypes" :key="t" :label="t" :value="t" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="报酬" prop="reward" :rules="[{ required: true, message: '请输入报酬' }]">
            <ElInputNumber v-model="form.reward" :min="0" :precision="2" class="full-width">
              <template #prefix>¥</template>
            </ElInputNumber>
          </ElFormItem>

          <ElFormItem label="送达地点" prop="deliveryPlace" :rules="[{ required: true, message: '请输入送达地点' }]">
            <ElInput v-model="form.deliveryPlace" placeholder="请输入送达地点" />
          </ElFormItem>

          <ElFormItem label="期望完成时间" prop="deadline" :rules="[{ required: true, message: '请选择完成时间' }]">
            <ElDatePicker v-model="form.deadline" type="datetime" placeholder="选择期望完成时间" style="width: 100%" />
          </ElFormItem>

          <ElFormItem label="联系方式" prop="contact" :rules="[{ required: true, message: '请输入联系方式' }]">
            <ElInput v-model="form.contact" placeholder="请输入手机号/微信/QQ" />
          </ElFormItem>

          <ElFormItem label="图片上传">
            <ElUpload
              v-model:file-list="form.images"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
            >
              <ElIcon><Plus /></ElIcon>
            </ElUpload>
          </ElFormItem>
        </ElForm>
      </template>

      <template v-if="activeStep === 1">
        <div class="confirm-box">
          <h3>请确认发布信息</h3>
          <div class="confirm-detail">
            <p><strong>任务内容：</strong>{{ form.content }}</p>
            <p><strong>类型：</strong>{{ form.type }}</p>
            <p><strong>报酬：</strong>¥{{ form.reward }}</p>
            <p><strong>送达地点：</strong>{{ form.deliveryPlace }}</p>
            <p><strong>期望完成时间：</strong>{{ form.deadline?.toLocaleString() || '未填' }}</p>
            <p><strong>联系方式：</strong>{{ form.contact }}</p>
          </div>
          <ElCheckbox v-model="form.agreed" class="agree-checkbox">
            我已阅读并同意 <a href="#" class="link">发布须知</a>
          </ElCheckbox>
        </div>
      </template>

      <template v-if="activeStep === 2">
        <div class="success-box">
          <div class="success-icon">✓</div>
          <h2>发布成功！</h2>
          <p>您的跑腿委托已提交，等待审核</p>
        </div>
      </template>

      <div class="form-actions">
        <ElButton v-if="activeStep === 1" @click="prevStep">返回修改</ElButton>
        <ElButton v-if="activeStep < 2" type="primary" @click="nextStep">
          {{ activeStep === 0 ? '下一步' : '确认发布' }}
        </ElButton>
        <ElButton v-if="activeStep === 0" @click="saveDraft">保存草稿</ElButton>
        <ElButton v-if="activeStep === 2" type="primary" @click="submitForm">返回首页</ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publish-form-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  text-align: center;
  margin-bottom: 28px;
}

.form-steps {
  margin-bottom: 32px;
}

.form-wrapper {
  background: #fff;
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.publish-form {
  max-width: 100%;
}

.full-width {
  width: 100%;
}

.confirm-box {
  text-align: center;
}

.confirm-box h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1E293B;
}

.confirm-detail {
  text-align: left;
  background: #F8FAFC;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.confirm-detail p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 10px;
  line-height: 1.6;
}

.confirm-detail p:last-child {
  margin-bottom: 0;
}

.agree-checkbox {
  margin-top: 12px;
}

.link {
  color: #3B82F6;
  text-decoration: underline;
}

.success-box {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #10B981;
  color: #fff;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-box h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 10px;
}

.success-box p {
  font-size: 15px;
  color: #64748B;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}
</style>
