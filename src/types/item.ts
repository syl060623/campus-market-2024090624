export interface TradeItem {
  id: number
  title: string
  category: string
  price: number
  originalPrice: number
  condition: string
  images: string[]
  description: string
  location: string
  contact: string
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: 'active' | 'sold' | 'deleted'
}

export type ItemCategory = '教材' | '电子产品' | '生活用品' | '体育用品' | '服饰' | '其他'

export type ItemCondition = '全新' | '九成新' | '七成新' | '五成新' | '有瑕疵'
