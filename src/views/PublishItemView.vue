<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElSteps, ElStep, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElUpload, ElButton, ElMessage, ElCheckbox, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '@/utils/constants'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useItemStore } from '@/stores/item'
import { useUserStore } from '@/stores/user'
import type { TradeItem } from '@/types/item'
import http from '@/api/http'

const router = useRouter()
const itemStore = useItemStore()
const userStore = useUserStore()

const activeStep = ref(0)
const form = ref({
  name: '',
  category: '',
  price: null as number | null,
  originalPrice: null as number | null,
  condition: '',
  location: '',
  contact: '',
  description: '',
  images: [] as UploadUserFile[],
  agreed: false,
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const categories = [...ITEM_CATEGORIES]
const conditions = [...ITEM_CONDITIONS]

const previewUrls = ref<string[]>([])

watch(() => form.value.images, () => {
  previewUrls.value = form.value.images.map(f => f.url || URL.createObjectURL(f.raw!))
}, { deep: true, immediate: true })

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

async function submitForm() {
  const newItem: TradeItem = {
    id: Date.now(),
    title: form.value.name,
    category: form.value.category,
    price: form.value.price!,
    originalPrice: form.value.originalPrice || 0,
    condition: form.value.condition,
    images: form.value.images.length > 0 ? form.value.images.map(f => URL.createObjectURL(f.raw!)) : ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    description: form.value.description,
    location: form.value.location,
    contact: form.value.contact,
    publisherId: userStore.currentUser.id,
    publisherName: userStore.currentUser.name,
    publisherAvatar: userStore.currentUser.avatar,
    createdAt: new Date().toISOString(),
    status: 'active'
  }
  itemStore.addTradeItem(newItem)
  try {
    await http.post('/trades', newItem)
  } catch {
    /* json-server may not be running */
  }
  ElMessage.success('发布成功')
  router.push('/')
}

function saveDraft() {
  ElMessage.info('已保存草稿')
}
</script>

<template>
  <div class="publish-form-page">
    <h1 class="page-title">发布二手商品</h1>

    <ElSteps :active="activeStep" class="form-steps" finish-status="success">
      <ElStep title="填写信息" />
      <ElStep title="确认发布" />
      <ElStep title="发布成功" />
    </ElSteps>

    <div class="form-wrapper">
      <template v-if="activeStep === 0">
        <ElForm ref="formRef" :model="form" label-width="100px" class="publish-form">
          <ElFormItem label="商品名称" prop="name" :rules="[{ required: true, message: '请输入商品名称' }]">
            <ElInput v-model="form.name" placeholder="请输入商品名称" />
          </ElFormItem>

          <ElFormItem label="分类" prop="category" :rules="[{ required: true, message: '请选择分类' }]">
            <ElSelect v-model="form.category" placeholder="请选择分类" class="full-width">
              <ElOption v-for="c in categories" :key="c" :label="c" :value="c" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="价格" prop="price" :rules="[{ required: true, message: '请输入价格' }]">
            <ElInput v-model.number="form.price" type="number" placeholder="请输入价格" class="full-width">
              <template #prefix>¥</template>
            </ElInput>
          </ElFormItem>

          <ElFormItem label="原价" prop="originalPrice">
            <ElInput v-model.number="form.originalPrice" type="number" placeholder="请输入原价（选填）" class="full-width">
              <template #prefix>¥</template>
            </ElInput>
          </ElFormItem>

          <ElFormItem label="成色" prop="condition" :rules="[{ required: true, message: '请选择成色' }]">
            <ElSelect v-model="form.condition" placeholder="请选择成色" class="full-width">
              <ElOption v-for="c in conditions" :key="c" :label="c" :value="c" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="交易地点" prop="location" :rules="[{ required: true, message: '请输入交易地点' }]">
            <ElInput v-model="form.location" placeholder="请输入交易地点" />
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

          <ElFormItem label="商品描述" prop="description">
            <ElInput v-model="form.description" type="textarea" :rows="4" placeholder="请描述商品情况（选填）" />
          </ElFormItem>
        </ElForm>
      </template>

      <template v-if="activeStep === 1">
        <div class="confirm-box">
          <h3>请确认发布信息</h3>
          <div class="confirm-detail">
            <p><strong>商品名称：</strong>{{ form.name }}</p>
            <p><strong>分类：</strong>{{ form.category }}</p>
            <p><strong>价格：</strong>¥{{ form.price }}</p>
            <p><strong>原价：</strong>¥{{ form.originalPrice || '未填' }}</p>
            <p><strong>成色：</strong>{{ form.condition }}</p>
            <p><strong>交易地点：</strong>{{ form.location }}</p>
            <p><strong>联系方式：</strong>{{ form.contact }}</p>
            <p><strong>描述：</strong>{{ form.description || '未填' }}</p>
            <div class="confirm-images" v-if="form.images.length > 0">
              <strong>图片：</strong>
              <div class="image-list">
                <img v-for="(f, i) in form.images" :key="i" :src="previewUrls[i]" class="preview-img" />
              </div>
            </div>
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
          <p>您的商品信息已提交，等待审核</p>
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

.confirm-images {
  margin-top: 12px;
}

.confirm-images strong {
  font-size: 14px;
  color: #475569;
}

.image-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.preview-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
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
