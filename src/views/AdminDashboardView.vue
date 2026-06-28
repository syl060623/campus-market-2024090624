<script setup lang="ts">
import { type Component } from 'vue'
import { ElRow, ElCol, ElCard, ElTable, ElTableColumn, ElTag, ElIcon } from 'element-plus'
import { UserFilled, Goods, Clock, WarningFilled } from '@element-plus/icons-vue'

interface StatItem {
  label: string
  value: string
  icon: string
  color: string
  bg: string
}

interface ChartDataItem {
  label: string
  count: number
  pct: number
}

interface ActivityLogItem {
  user: string
  action: string
  time: string
  status: string
}

interface AnnouncementItem {
  title: string
  date: string
  tag: string
  type: string
}

const iconMap: Record<string, Component> = { UserFilled, Goods, Clock, WarningFilled }

const stats: StatItem[] = [
  { label: '总用户数', value: '1,280', icon: 'UserFilled', color: '#3B82F6', bg: '#EFF6FF' },
  { label: '发布总数', value: '356', icon: 'Goods', color: '#10B981', bg: '#ECFDF5' },
  { label: '待审核数', value: '23', icon: 'Clock', color: '#F59E0B', bg: '#FFFBEB' },
  { label: '今日举报', value: '5', icon: 'WarningFilled', color: '#EF4444', bg: '#FEF2F2' },
]

const mockChartData: ChartDataItem[] = [
  { label: '二手交易', count: 128, pct: 80 },
  { label: '失物招领', count: 42, pct: 26 },
  { label: '拼单搭子', count: 56, pct: 35 },
  { label: '跑腿委托', count: 74, pct: 46 },
]

const activityLog: ActivityLogItem[] = [
  { user: '张三', action: '发布二手商品「iPhone 15」', time: '2026-06-28 14:32', status: '已通过' },
  { user: '李四', action: '举报失物信息虚假', time: '2026-06-28 13:15', status: '待处理' },
  { user: '王五', action: '发布拼单「奶茶拼单」', time: '2026-06-28 11:48', status: '审核中' },
  { user: '赵六', action: '修改个人信息', time: '2026-06-28 10:02', status: '已完成' },
  { user: '陈七', action: '发布跑腿「代取快递」', time: '2026-06-27 21:30', status: '已通过' },
  { user: '刘八', action: '申诉账号封禁', time: '2026-06-27 19:12', status: '待处理' },
]

const announcements: AnnouncementItem[] = [
  { title: '关于暑假期间审核延迟的通知', date: '2026-06-25', tag: '重要', type: 'danger' },
  { title: '平台违规内容清理公告（第六期）', date: '2026-06-20', tag: '公告', type: 'warning' },
  { title: '新增举报反馈机制说明', date: '2026-06-15', tag: '更新', type: 'info' },
]

function statusType(status: string) {
  if (status.includes('通过') || status.includes('完成')) return 'success'
  if (status.includes('待处理') || status.includes('审核')) return 'warning'
  return 'info'
}
</script>

<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <h2>管理后台</h2>
      <p class="text-slate-500 text-sm">欢迎回来，今天是 {{ new Date().toLocaleDateString('zh-CN') }}</p>
    </div>

    <ElRow :gutter="20" class="stats-row">
      <ElCol v-for="stat in stats" :key="stat.label" :span="6">
        <ElCard class="stat-card" shadow="never">
          <div class="stat-inner">
            <div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">
              <ElIcon :size="24"><component :is="iconMap[stat.icon]" /></ElIcon>
            </div>
            <div class="stat-info">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20" class="charts-section">
      <ElCol :span="14">
        <ElCard class="section-card" shadow="never">
          <template #header><span class="card-title">发布分类统计</span></template>
          <div class="chart-bars">
            <div v-for="item in mockChartData" :key="item.label" class="chart-item">
              <div class="chart-label">
                <span>{{ item.label }}</span>
                <span class="chart-count">{{ item.count }}</span>
              </div>
              <div class="chart-track">
                <div class="chart-fill" :style="{ width: item.pct + '%' }" />
              </div>
            </div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="10">
        <ElCard class="section-card" shadow="never">
          <template #header><span class="card-title">系统公告</span></template>
          <div class="announcement-list">
            <div v-for="item in announcements" :key="item.title" class="announcement-item">
              <ElTag :type="item.type" size="small" effect="dark">{{ item.tag }}</ElTag>
              <div class="announcement-content">
                <span class="announcement-title">{{ item.title }}</span>
                <span class="announcement-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElCard class="section-card" shadow="never">
      <template #header><span class="card-title">近期操作记录</span></template>
      <ElTable :data="activityLog" stripe style="width: 100%">
        <ElTableColumn prop="user" label="用户" width="100" />
        <ElTableColumn prop="action" label="操作" min-width="240" />
        <ElTableColumn prop="time" label="时间" width="170" />
        <ElTableColumn label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="statusType(row.status)" size="small" effect="plain">{{ row.status }}</ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>
  </div>
</template>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.stat-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #94A3B8;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #1E293B;
}

.charts-section {
  margin-bottom: 20px;
}

.section-card {
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  margin-bottom: 20px;
}

.section-card:last-child {
  margin-bottom: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chart-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.chart-count {
  font-weight: 600;
  color: #1E293B;
}

.chart-track {
  height: 10px;
  background: #F1F5F9;
  border-radius: 5px;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
  border-radius: 5px;
  transition: width 0.6s ease;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.announcement-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.announcement-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.announcement-title {
  font-size: 13px;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-date {
  font-size: 12px;
  color: #94A3B8;
}
</style>
