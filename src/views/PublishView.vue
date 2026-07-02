<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '../components/FormField.vue'
import { createTrade } from '../api/trade'
import { createLostFound } from '../api/lostFound'
import { createGroupBuy } from '../api/groupBuy'
import { createErrand } from '../api/errand'
import { useUserStore } from '../stores/user'

type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

const router = useRouter()
const userStore = useUserStore()
const publishType = ref<PublishType>('trade')
const submitting = ref(false)

const form = reactive({
  title: '',
  location: '',
  description: '',
  category: '',
  price: 0,
  condition: '',
  lostFoundType: 'lost',
  itemName: '',
  eventTime: '',
  groupType: '',
  targetCount: 2,
  deadline: '',
  taskType: '',
  reward: 0,
  from: '',
  to: '',
  images: [] as File[],
})

const errors = reactive<Record<string, string>>({})
const previewUrls = ref<string[]>([])

function handleImageUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  form.images = Array.from(input.files)
  previewUrls.value = form.images.map(f => URL.createObjectURL(f))
}

function removeImage(index: number) {
  form.images.splice(index, 1)
  const url = previewUrls.value[index]
  if (url) URL.revokeObjectURL(url)
  previewUrls.value.splice(index, 1)
}

watch(publishType, () => {
  resetForm()
})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function validateForm() {
  clearErrors()

  if (!form.title) {
    errors.title = '请输入标题'
  }

  if (!form.location) {
    errors.location = '请输入地点'
  }

  if (!form.description) {
    errors.description = '请输入描述'
  }

  if (publishType.value === 'trade') {
    if (!form.category) {
      errors.category = '请输入商品分类'
    }
    if (form.price <= 0) {
      errors.price = '价格应大于 0'
    }
    if (!form.condition) {
      errors.condition = '请选择商品成色'
    }
  }

  if (publishType.value === 'lostFound') {
    if (!form.itemName) {
      errors.itemName = '请输入物品名称'
    }
    if (!form.eventTime) {
      errors.eventTime = '请选择发生时间'
    }
  }

  if (publishType.value === 'groupBuy') {
    if (!form.groupType) {
      errors.groupType = '请输入拼单类型'
    }
    if (form.targetCount < 2) {
      errors.targetCount = '目标人数不能少于 2 人'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  if (publishType.value === 'errand') {
    if (!form.taskType) {
      errors.taskType = '请输入任务类型'
    }
    if (form.reward < 0) {
      errors.reward = '酬劳不能为负数'
    }
    if (!form.from) {
      errors.from = '请输入取件地点'
    }
    if (!form.to) {
      errors.to = '请输入送达地点'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  return Object.values(errors).every((message) => !message)
}

function resetForm() {
  form.title = ''
  form.location = ''
  form.description = ''
  form.category = ''
  form.price = 0
  form.condition = ''
  form.lostFoundType = 'lost'
  form.itemName = ''
  form.eventTime = ''
  form.groupType = ''
  form.targetCount = 2
  form.deadline = ''
  form.taskType = ''
  form.reward = 0
  form.from = ''
  form.to = ''
  form.images = []

  previewUrls.value.forEach(u => URL.revokeObjectURL(u))
  previewUrls.value = []

  clearErrors()
}

function getCurrentTime() {
  const now = new Date()
  return now.toISOString().slice(0, 16).replace('T', ' ')
}

async function handleSubmit() {
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    window.alert('请先登录后再发布信息')
    router.push('/login')
    return
  }

  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    const now = getCurrentTime()
    const imageUrls = form.images.length > 0 ? form.images.map(f => URL.createObjectURL(f)) : ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop']

    if (publishType.value === 'trade') {
      await createTrade({
        title: form.title,
        category: form.category,
        price: form.price,
        originalPrice: 0,
        condition: form.condition,
        images: imageUrls,
        description: form.description,
        location: form.location,
        contact: '站内消息联系',
        publisherId: userStore.currentUser.id,
        publisherName: userStore.currentUser.name,
        publisherAvatar: userStore.currentUser.avatar,
        createdAt: now,
        status: 'open',
        publisher: userStore.displayName,
        publishTime: now,
        image: imageUrls[0] || '',
      })

      window.alert('二手商品发布成功')
      router.push('/trade')
    }

    if (publishType.value === 'lostFound') {
      await createLostFound({
        title: form.title,
        type: form.lostFoundType,
        itemName: form.itemName,
        images: imageUrls,
        description: form.description,
        location: form.location,
        happenedAt: form.eventTime || now,
        contact: '站内消息联系',
        publisherId: userStore.currentUser.id,
        publisherName: userStore.currentUser.name,
        publisherAvatar: userStore.currentUser.avatar,
        createdAt: now,
        status: 'open',
        eventTime: form.eventTime,
      })

      window.alert('失物招领信息发布成功')
      router.push('/lost-found')
    }

    if (publishType.value === 'groupBuy') {
      await createGroupBuy({
        title: form.title,
        type: form.groupType,
        currentCount: 1,
        targetCount: form.targetCount,
        deadline: form.deadline,
        meetLocation: form.location,
        description: form.description,
        images: imageUrls,
        publisherId: userStore.currentUser.id,
        publisherName: userStore.currentUser.name,
        publisherAvatar: userStore.currentUser.avatar,
        createdAt: now,
        status: 'open',
        publisher: userStore.displayName,
        location: form.location,
      })

      window.alert('拼单搭子信息发布成功')
      router.push('/group-buy')
    }

    if (publishType.value === 'errand') {
      await createErrand({
        title: form.title,
        type: '其他',
        content: `${form.taskType}：从${form.from}送到${form.to}`,
        description: form.description,
        reward: form.reward,
        images: imageUrls,
        deliveryLocation: form.to,
        expectedTime: form.deadline || '尽快',
        contact: '站内消息联系',
        publisherId: userStore.currentUser.id,
        publisherName: userStore.currentUser.name,
        publisherAvatar: userStore.currentUser.avatar,
        createdAt: now,
        status: 'open',
        taskType: form.taskType,
        from: form.from,
        to: form.to,
        deadline: form.deadline,
        publisher: userStore.displayName,
      })

      window.alert('跑腿委托发布成功')
      router.push('/errand')
    }
  } catch (error) {
    console.error(error)
    window.alert('发布失败，请确认 JSON Server 已启动，并检查表单数据是否完整。')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p>选择发布类型，填写必要信息，让校园需求更快被看见。</p>
    </div>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <FormField label="发布类型" required>
        <select v-model="publishType">
          <option value="trade">二手交易</option>
          <option value="lostFound">失物招领</option>
          <option value="groupBuy">拼单搭子</option>
          <option value="errand">跑腿委托</option>
        </select>
      </FormField>

      <FormField label="标题" required :error="errors.title">
        <input v-model.trim="form.title" type="text" placeholder="输入标题，例如：出售二手自行车" />
      </FormField>

      <FormField label="地点" required :error="errors.location">
        <input v-model.trim="form.location" type="text" placeholder="如：北区食堂、图书馆三楼" />
      </FormField>

      <template v-if="publishType === 'trade'">
        <FormField label="商品分类" required :error="errors.category">
          <input v-model.trim="form.category" type="text" placeholder="如：数码配件、教材资料、生活用品" />
        </FormField>

        <FormField label="价格" required :error="errors.price">
          <input v-model.number="form.price" type="number" min="0" placeholder="输入转让价格（元）" />
        </FormField>

        <FormField label="成色" required :error="errors.condition">
          <select v-model="form.condition">
            <option value="">请选择成色</option>
            <option value="全新">全新</option>
            <option value="九成新">九成新</option>
            <option value="八成新">八成新</option>
            <option value="正常使用痕迹">正常使用痕迹</option>
          </select>
        </FormField>
      </template>

      <template v-if="publishType === 'lostFound'">
        <FormField label="信息类型" required>
          <select v-model="form.lostFoundType">
            <option value="lost">寻物</option>
            <option value="found">招领</option>
          </select>
        </FormField>

        <FormField label="物品名称" required :error="errors.itemName">
          <input v-model.trim="form.itemName" type="text" placeholder="请输入物品名称" />
        </FormField>

        <FormField label="发生时间" required :error="errors.eventTime">
          <input v-model="form.eventTime" type="datetime-local" />
        </FormField>
      </template>

      <template v-if="publishType === 'groupBuy'">
        <FormField label="拼单类型" required :error="errors.groupType">
          <input v-model.trim="form.groupType" type="text" placeholder="如：拼餐、资料团购、运动搭子" />
        </FormField>

        <FormField label="目标人数" required :error="errors.targetCount">
          <input v-model.number="form.targetCount" type="number" min="2" placeholder="凑齐多少人开始拼单" />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <template v-if="publishType === 'errand'">
        <FormField label="任务类型" required :error="errors.taskType">
          <input v-model.trim="form.taskType" type="text" placeholder="如：取快递、代买、代送" />
        </FormField>

        <FormField label="酬劳" required :error="errors.reward">
          <input v-model.number="form.reward" type="number" min="0" placeholder="输入跑腿酬劳（元）" />
        </FormField>

        <FormField label="取件地点" required :error="errors.from">
          <input v-model.trim="form.from" type="text" placeholder="如：菜鸟驿站 3 号货架" />
        </FormField>

        <FormField label="送达地点" required :error="errors.to">
          <input v-model.trim="form.to" type="text" placeholder="如：15 号宿舍楼 302" />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <FormField label="描述" required :error="errors.description">
        <textarea v-model.trim="form.description" rows="5" placeholder="详细描述物品情况、交易要求等"></textarea>
      </FormField>

      <FormField label="图片">
        <div class="image-upload-area">
          <label class="image-upload-btn">
            <input type="file" accept="image/*" multiple @change="handleImageUpload" hidden />
            <span>+ 添加图片</span>
          </label>
          <div class="image-preview-list" v-if="previewUrls.length > 0">
            <div v-for="(url, i) in previewUrls" :key="i" class="image-preview-item">
              <img :src="url" class="preview-img" />
              <button type="button" class="remove-img" @click="removeImage(i)">×</button>
            </div>
          </div>
        </div>
      </FormField>

      <div class="actions">
        <button type="button" class="secondary" @click="resetForm">重置</button>
        <button type="submit" class="primary" :disabled="submitting">
          {{ submitting ? '提交中...' : '发布' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 15px;
  color: #64748B;
}

.publish-form {
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.publish-form input,
.publish-form select,
.publish-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.publish-form input:focus,
.publish-form select:focus,
.publish-form textarea:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.publish-form textarea {
  resize: vertical;
  font-family: inherit;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.actions button {
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.actions .primary {
  background: #3B82F6;
  color: #fff;
}

.actions .primary:hover {
  background: #2563EB;
}

.actions .primary:disabled {
  background: #93C5FD;
  cursor: not-allowed;
}

.actions .secondary {
  background: #F1F5F9;
  color: #475569;
}

.actions .secondary:hover {
  background: #E2E8F0;
}

.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.image-upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  cursor: pointer;
  color: #94A3B8;
  font-size: 13px;
  transition: all 0.2s;
  background: #FAFAFA;
}

.image-upload-btn:hover {
  border-color: #3B82F6;
  color: #3B82F6;
  background: #EFF6FF;
}

.image-preview-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.image-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-img:hover {
  background: rgba(239,68,68,0.8);
}
</style>
