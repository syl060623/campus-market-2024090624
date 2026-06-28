export interface ErrandTask {
  id: number
  title: string
  type: '取快递' | '送东西' | '代购' | '其他'
  content: string
  reward: number
  images: string[]
  deliveryLocation: string
  expectedTime: string
  contact: string
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: '待接单' | '已接单' | '已完成' | '已取消'
  takerId?: number
  takerName?: string
}

export type TaskCategory = '取快递' | '送东西' | '代购' | '其他'
