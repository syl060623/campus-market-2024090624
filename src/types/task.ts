export interface ErrandTask {
  id: number
  title: string
  type: string
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
  status: string
  takerId?: number
  takerName?: string
}

export type TaskCategory = '取快递' | '送东西' | '代购' | '其他'
