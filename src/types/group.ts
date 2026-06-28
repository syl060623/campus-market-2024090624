export interface GroupBuyItem {
  id: number
  title: string
  type: '餐饮' | '购物' | '出行' | '其他'
  currentCount: number
  targetCount: number
  deadline: string
  meetLocation: string
  description: string
  images: string[]
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: 'active' | 'full' | 'expired' | 'deleted'
}

export type GroupBuyCategory = '餐饮' | '购物' | '出行' | '其他'
