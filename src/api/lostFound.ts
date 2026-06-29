import http from './http'

export interface LostFoundItem {
  id: number
  type: '丢失' | '拾到'
  itemName: string
  images: string[]
  description: string
  location: string
  happenedAt: string
  contact: string
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: 'active' | 'resolved' | 'deleted'
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function getLostFoundById(id: number) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}
