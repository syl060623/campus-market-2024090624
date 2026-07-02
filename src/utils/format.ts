
export function formatTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

export function deadlineText(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return '已截止'
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `还剩${hours}小时`
  const days = Math.floor(diff / 86400000)
  return `还剩${days}天`
}

export type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

export function statusTagType(status: string): TagType {
  const map: Record<string, TagType> = {
    '待接单': 'warning',
    '已接单': 'primary',
    '已完成': 'success',
    '已取消': 'danger',
    'active': 'success',
    'sold': 'info',
    'full': 'warning',
    'expired': 'danger',
    'resolved': 'success',
    '已解决': 'success',
    '已过期': 'danger',
    '已售出': 'info',
    '已删除': 'info',
  }
  return map[status] || 'info'
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: '已发布',
    sold: '已售出',
    completed: '已完成',
    expired: '已过期',
    resolved: '已解决',
    deleted: '已删除',
    full: '已满员',
  }
  return map[status] || status
}
