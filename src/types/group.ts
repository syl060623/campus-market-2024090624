export interface GroupBuyItem {
  id: number
  title: string
  type: string
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
  status: string
}

export type GroupBuyCategory = '餐饮' | '购物' | '出行' | '其他'
