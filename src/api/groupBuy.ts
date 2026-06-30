import http from './http'

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
  publisher: string
  location: string
}

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function getGroupBuyById(id: number) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}

export function createGroupBuy(data: Partial<Omit<GroupBuyItem, 'id'>>) {
  return http.post<GroupBuyItem>('/groupBuys', data)
}

export function deleteGroupBuy(id: number) {
  return http.delete(`/groupBuys/${id}`)
}

export function updateGroupBuy(id: number, data: Partial<Omit<GroupBuyItem, 'id'>>) {
  return http.patch<GroupBuyItem>(`/groupBuys/${id}`, data)
}

