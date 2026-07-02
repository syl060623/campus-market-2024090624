<script setup lang="ts">
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElTabs, ElTabPane, ElCard, ElTable, ElTableColumn, ElTag, ElButton, ElDialog, ElIcon, ElMessage } from 'element-plus'
import { Select, Close, View } from '@element-plus/icons-vue'

interface ReviewItem {
  id: number
  type: string
  typeTag: 'primary' | 'success' | 'warning' | 'info' | 'danger' | ''
  title: string
  publisher: string
  time: string
  preview: string
  status: 'pending' | 'approved' | 'rejected'
}

const activeTab = ref('pending')

const reviewList = ref<ReviewItem[]>([
  { id: 1, type: '二手', typeTag: '', title: '出售全新高数教材第六版', publisher: '张三', time: '2026-06-28 14:20', preview: '教材全新未使用，带课后习题答案，价格可小刀', status: 'pending' },
  { id: 2, type: '失物', typeTag: 'warning', title: '寻物启事：黑色钱包丢失', publisher: '李四', time: '2026-06-28 13:45', preview: '在二食堂三楼丢失黑色皮质钱包一个，内含校园卡和现金若干', status: 'pending' },
  { id: 3, type: '拼单', typeTag: 'success', title: '东区食堂三楼拼奶茶满减', publisher: '王五', time: '2026-06-28 12:10', preview: '凑满减，还差2人，晚上6点下单，有意者私聊', status: 'pending' },
  { id: 4, type: '跑腿', typeTag: '', title: '代取快递到7栋宿舍', publisher: '赵六', time: '2026-06-28 11:30', preview: '菜鸟驿站取件，送到7栋305，酬谢5元，下午3点前', status: 'pending' },
  { id: 5, type: '二手', typeTag: '', title: '出二手电动车一辆', publisher: '陈七', time: '2026-06-28 10:00', preview: '骑了半年，电池续航还有30公里，价格800元，可看车', status: 'pending' },
  { id: 6, type: '失物', typeTag: 'warning', title: '拾到校园卡一张', publisher: '刘八', time: '2026-06-27 21:15', preview: '在图书馆二楼拾到校园卡一张，学号2024XXXX，失主请联系', status: 'pending' },
  { id: 7, type: '二手', typeTag: '', title: '毕业清仓：台灯、键盘、耳机', publisher: '孙九', time: '2026-06-27 19:40', preview: '快毕业了，杂物低价出，台灯20元、键盘30元、耳机50元', status: 'pending' },
  { id: 8, type: '拼单', typeTag: 'success', title: '周五下午拼车去高铁站', publisher: '周十', time: '2026-06-27 18:00', preview: '周五下午2点北门出发，拼车去高铁站，4人车已打，还差2人', status: 'pending' },
  { id: 9, type: '跑腿', typeTag: '', title: '求带饭到图书馆', publisher: '吴一', time: '2026-06-27 17:30', preview: '中午11:30帮忙带一份黄焖鸡米饭到图书馆三楼，6元跑腿费', status: 'pending' },
  { id: 10, type: '二手', typeTag: '', title: '全新未拆封蓝牙耳机', publisher: '郑二', time: '2026-06-27 16:20', preview: '双十一囤货，全新未拆封，型号AirPods Pro，价格可议', status: 'pending' },
])

const dialogVisible = ref(false)
const detailItem = ref<ReviewItem | null>(null)

function approve(item: ReviewItem) {
  item.status = 'approved'
  ElMessage.success(`已通过「${item.title}」的审核`)
}

function reject(item: ReviewItem) {
  item.status = 'rejected'
  ElMessage.warning(`已拒绝「${item.title}」的审核`)
}

function showDetail(item: ReviewItem) {
  detailItem.value = item
  dialogVisible.value = true
}

function filteredList(status: string): ReviewItem[] {
  if (status === 'pending') return reviewList.value.filter(i => i.status === 'pending')
  if (status === 'approved') return reviewList.value.filter(i => i.status === 'approved')
  return reviewList.value.filter(i => i.status === 'rejected')
}
</script>

<template>
  <div class="admin-review">
    <ElBreadcrumb class="mb-4" separator="/">
      <ElBreadcrumbItem :to="{ path: '/admin' }">管理后台</ElBreadcrumbItem>
      <ElBreadcrumbItem>内容审核</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="page-header">
      <h2>内容审核管理</h2>
      <p class="text-slate-500 text-sm">审核用户发布的各类内容，维护平台秩序</p>
    </div>

    <ElCard class="review-card" shadow="never">
      <ElTabs v-model="activeTab" class="review-tabs">
        <ElTabPane label="待审核" name="pending">
          <ElTable :data="filteredList('pending')" stripe style="width: 100%">
            <ElTableColumn label="类型" width="90">
              <template #default="{ row }">
                <ElTag :type="(row.typeTag as any)" size="small" effect="plain">{{ row.type }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="title" label="标题" min-width="180" show-overflow-tooltip />
            <ElTableColumn prop="publisher" label="发布人" width="90" />
            <ElTableColumn prop="time" label="发布时间" width="160" />
            <ElTableColumn prop="preview" label="内容预览" min-width="220" show-overflow-tooltip />
            <ElTableColumn label="操作" width="220" fixed="right">
              <template #default="{ row }">
                <ElButton type="success" size="small" @click="approve(row as ReviewItem)">
                  <ElIcon><Select /></ElIcon> 通过
                </ElButton>
                <ElButton type="danger" size="small" @click="reject(row as ReviewItem)">
                  <ElIcon><Close /></ElIcon> 拒绝
                </ElButton>
                <ElButton size="small" @click="showDetail(row as ReviewItem)">
                  <ElIcon><View /></ElIcon> 详情
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElTabPane>
        <ElTabPane label="已通过" name="approved">
          <ElTable :data="filteredList('approved')" stripe style="width: 100%">
            <ElTableColumn label="类型" width="90">
              <template #default="{ row }">
                <ElTag :type="(row.typeTag as any)" size="small" effect="plain">{{ row.type }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="title" label="标题" min-width="180" show-overflow-tooltip />
            <ElTableColumn prop="publisher" label="发布人" width="90" />
            <ElTableColumn prop="time" label="发布时间" width="160" />
            <ElTableColumn prop="preview" label="内容预览" min-width="220" show-overflow-tooltip />
            <ElTableColumn label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <ElTag type="success" effect="plain" size="small">已通过</ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElTabPane>
        <ElTabPane label="已拒绝" name="rejected">
          <ElTable :data="filteredList('rejected')" stripe style="width: 100%">
            <ElTableColumn label="类型" width="90">
              <template #default="{ row }">
                <ElTag :type="(row.typeTag as any)" size="small" effect="plain">{{ row.type }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="title" label="标题" min-width="180" show-overflow-tooltip />
            <ElTableColumn prop="publisher" label="发布人" width="90" />
            <ElTableColumn prop="time" label="发布时间" width="160" />
            <ElTableColumn prop="preview" label="内容预览" min-width="220" show-overflow-tooltip />
            <ElTableColumn label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <ElTag type="danger" effect="plain" size="small">已拒绝</ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElTabPane>
      </ElTabs>
    </ElCard>

    <ElDialog v-model="dialogVisible" title="内容详情" width="560px" :close-on-click-modal="false">
      <template v-if="detailItem">
        <div class="detail-field">
          <span class="detail-label">类型</span>
          <ElTag :type="(detailItem.typeTag as any)" size="small" effect="plain">{{ detailItem.type }}</ElTag>
        </div>
        <div class="detail-field">
          <span class="detail-label">标题</span>
          <span>{{ detailItem.title }}</span>
        </div>
        <div class="detail-field">
          <span class="detail-label">发布人</span>
          <span>{{ detailItem.publisher }}</span>
        </div>
        <div class="detail-field">
          <span class="detail-label">发布时间</span>
          <span>{{ detailItem.time }}</span>
        </div>
        <div class="detail-field">
          <span class="detail-label">内容预览</span>
          <span class="detail-preview">{{ detailItem.preview }}</span>
        </div>
        <div class="detail-field">
          <span class="detail-label">当前状态</span>
          <ElTag v-if="detailItem.status === 'pending'" type="warning" size="small">待审核</ElTag>
          <ElTag v-else-if="detailItem.status === 'approved'" type="success" size="small">已通过</ElTag>
          <ElTag v-else type="danger" size="small">已拒绝</ElTag>
        </div>
      </template>
      <template #footer>
        <ElButton @click="dialogVisible = false">关闭</ElButton>
        <ElButton v-if="detailItem?.status === 'pending'" type="success" @click="approve(detailItem); dialogVisible = false">
          <ElIcon><Select /></ElIcon> 通过
        </ElButton>
        <ElButton v-if="detailItem?.status === 'pending'" type="danger" @click="reject(detailItem); dialogVisible = false">
          <ElIcon><Close /></ElIcon> 拒绝
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.admin-review {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.review-card {
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.review-tabs {
  margin-bottom: -18px;
}

.detail-field {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #334155;
}

.detail-label {
  min-width: 72px;
  font-weight: 600;
  color: #64748B;
  flex-shrink: 0;
}

.detail-preview {
  line-height: 1.6;
  color: #475569;
}
</style>
