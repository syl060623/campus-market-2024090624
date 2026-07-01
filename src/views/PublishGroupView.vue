<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElSteps, ElStep, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElDatePicker, ElUpload, ElButton, ElMessage, ElCheckbox, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { GROUP_TYPES } from '@/utils/constants'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useItemStore } from '@/stores/item'
import { useUserStore } from '@/stores/user'
import type { GroupBuyItem } from '@/types/group'

const router = useRouter()
const itemStore = useItemStore()
const userStore = useUserStore()

const activeStep = ref(0)
const form = ref({
  topic: '',
  type: '',
  targetCount: 2,
  deadline: null as Date | null,
  meetupPlace: '',
  description: '',
  images: [] as UploadUserFile[],
  agreed: false,
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const groupTypes = [...GROUP_TYPES]

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
  const newItem: GroupBuyItem = {
    id: Date.now(),
    title: form.value.topic,
    type: form.value.type as GroupBuyItem['type'],
    currentCount: 1,
    targetCount: form.value.targetCount,
    deadline: form.value.deadline?.toISOString() || new Date().toISOString(),
    meetLocation: form.value.meetupPlace,
    description: form.value.description,
    images: form.value.images.map(f => URL.createObjectURL(f.raw!)),
    publisherId: userStore.currentUser.id,
    publisherName: userStore.currentUser.name,
    publisherAvatar: userStore.currentUser.avatar,
    createdAt: new Date().toISOString(),
    status: 'active'
  }
  itemStore.addGroupItem(newItem)
  ElMessage.success('发布成功')
  router.push('/')
}

function saveDraft() {
  ElMessage.info('已保存草稿')
}
</script>

<template>
  <div class="publish-form-page">
    <h1 class="page-title">发布拼单搭子</h1>

    <ElSteps :active="activeStep" class="form-steps" finish-status="success">
      <ElStep title="填写信息" />
      <ElStep title="确认发布" />
      <ElStep title="发布成功" />
    </ElSteps>

    <div class="form-wrapper">
      <template v-if="activeStep === 0">
        <ElForm ref="formRef" :model="form" label-width="100px" class="publish-form">
          <ElFormItem label="拼单主题" prop="topic" :rules="[{ required: true, message: '请输入拼单主题' }]">
            <ElInput v-model="form.topic" placeholder="请输入拼单主题" />
          </ElFormItem>

          <ElFormItem label="类型" prop="type" :rules="[{ required: true, message: '请选择类型' }]">
            <ElSelect v-model="form.type" placeholder="请选择类型" class="full-width">
              <ElOption v-for="t in groupTypes" :key="t" :label="t" :value="t" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="目标人数" prop="targetCount" :rules="[{ required: true, message: '请输入目标人数' }]">
            <ElInputNumber v-model="form.targetCount" :min="2" :max="50" />
          </ElFormItem>

          <ElFormItem label="截止时间" prop="deadline" :rules="[{ required: true, message: '请选择截止时间' }]">
            <ElDatePicker v-model="form.deadline" type="datetime" placeholder="选择截止时间" style="width: 100%" />
          </ElFormItem>

          <ElFormItem label="集合地点" prop="meetupPlace" :rules="[{ required: true, message: '请输入集合地点' }]">
            <ElInput v-model="form.meetupPlace" placeholder="请输入集合地点" />
          </ElFormItem>

          <ElFormItem label="描述" prop="description" :rules="[{ required: true, message: '请描述详情' }]">
            <ElInput v-model="form.description" type="textarea" :rows="4" placeholder="请描述拼单详情" />
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
            <p><strong>拼单主题：</strong>{{ form.topic }}</p>
            <p><strong>类型：</strong>{{ form.type }}</p>
            <p><strong>目标人数：</strong>{{ form.targetCount }}人</p>
            <p><strong>截止时间：</strong>{{ form.deadline?.toLocaleString() || '未填' }}</p>
            <p><strong>集合地点：</strong>{{ form.meetupPlace }}</p>
            <p><strong>描述：</strong>{{ form.description || '未填' }}</p>
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
          <p>您的拼单信息已提交，等待审核</p>
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
