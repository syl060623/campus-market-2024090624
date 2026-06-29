import http from './http'

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

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function getGroupBuyById(id: number) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}
